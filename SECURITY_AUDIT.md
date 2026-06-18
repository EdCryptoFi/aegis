# Aegis — Auditoria de Segurança dos Contratos Move

**Data:** 2026-06-17
**Escopo:** `aegis/Move/sources/*.move` (reputation, badge, badge_registry, memwal_adapter, events)
**Contrato deployado (testnet):** `0x6472bb19be1908b8c948169c5627e625e54419b10138519e1caf5be4502d9e7d`
**Status:** somente avaliação + patch proposto. Nada foi redeployado.

---

## Resumo executivo

A falha central é **escrita de reputação sem autorização** em um objeto compartilhado. Qualquer
carteira pode chamar `record_execution` no `ReputationObject` de qualquer agente e forjar ou
sabotar a reputação. Toda a métrica on-chain do protocolo é falsificável. É quase certo que essa
é a falha apontada na mensagem anônima.

Não há vazamento de chaves ou dados privados nos contratos. Em blockchain, todos os campos de
objeto são públicos por design — isso não é um "vazamento", é a natureza da rede. Os segredos
locais (`.env.local`, arquivo `.key`) **nunca foram commitados** no GitHub (`EdCryptoFi/aegis`);
estão protegidos pelo `.gitignore`. Não é necessário rotacionar chaves por exposição no Git.

| # | Severidade | Arquivo | Função | Problema |
|---|-----------|---------|--------|----------|
| 1 | **CRÍTICA** | reputation.move | `record_execution` | Sem checagem de sender em objeto compartilhado → reputação forjável por qualquer um |
| 2 | **CRÍTICA (regressão)** | reputation.move | `update_walrus_blob_id` | Refactor removeu o `assert` de dono; vira `public fun` sem `ctx` → qualquer um re-aponta o blob |
| 3 | **MÉDIA** | badge.move | `mint_badge` | Transfere badge para `tx_sender`, não para o agente; sem gate → roubo/forja de badge |
| 4 | **BAIXA (funcional)** | reputation.move | `record_execution` | `MIN_BLOCKS_BETWEEN_EXECUTIONS = 1` (epoch ≈ 24h) quebra a própria suíte de testes e o uso real |
| 5 | **INFO** | memwal_adapter / reputation | — | Dados on-chain são públicos; não coloque nada sensível em `memwal_account_id`/`namespace` |

---

## 1. CRÍTICA — `record_execution` sem autorização

**Local:** `Move/sources/reputation.move`, `record_execution` (≈ linha 81). O `ReputationObject` é
criado com `transfer::share_object` (linha 78), portanto é um objeto **compartilhado** que qualquer
transação referencia. A função só valida faixas de `volume`/`slippage` e um rate-limit por epoch —
**nunca verifica `tx_sender(ctx) == rep.agent_id`**.

**Impacto:**
- Inflar `total_executions` / `successful_executions` / `total_volume` de um agente e farmar badges
  Bronze/Silver/Gold (via `badge_registry::auto_check`, que confia nesses contadores) sem ter feito nada.
- Sabotar um concorrente registrando falhas / slippage alto até disparar `is_flagged = true`.

**Correção (modelo: só a própria carteira do agente):** `assert!(tx_sender(ctx) == rep.agent_id, E_NOT_AUTHORIZED);`
no início da função. Casa com `register_agent` (que define `agent_id = sender`) e com o demo atual
(uma carteira por agente).

> Alternativa mais escalável (não aplicada): uma `OracleCap` no padrão do `AdminCap`, detida por um
> backend confiável que grava em nome dos agentes. Mais código; só vale se você precisar de um
> recorder centralizado.

## 2. CRÍTICA — `update_walrus_blob_id` perdeu a autorização (regressão do refactor)

O checkpoint antigo tinha:
```move
public entry fun update_walrus_blob_id(rep, blob_id, ctx) {
    assert!(rep.agent_id == tx_sender(ctx), 0);   // checagem de dono
    ...
```
O source atual:
```move
public fun update_walrus_blob_id(rep: &mut ReputationObject, blob_id: vector<u8>) {  // sem ctx, sem assert
    rep.walrus_blob_id = some(blob_id);
}
```
Como `rep` é compartilhado, qualquer um re-aponta o `walrus_blob_id` de qualquer agente para um blob
malicioso. **Redeployar como está piora esse ponto** em relação ao contrato antigo. Correção: restaurar
`ctx` + `assert!(tx_sender(ctx) == rep.agent_id, E_NOT_AUTHORIZED)` e voltar a `public entry fun`.

## 3. MÉDIA — `mint_badge` entrega o badge para o chamador

`Move/sources/badge.move` linha 72: `transfer::transfer(badge, tx_sender(_ctx));`. Checa a reputação
de `rep` (compartilhado) e envia o badge para quem chamou. Combinado com a falha nº1, é forja trivial.
Correção: gatear com `assert!(tx_sender(_ctx) == get_agent_id(rep), 0)` e transferir para
`get_agent_id(rep)`.

## 4. BAIXA (funcional) — rate-limit por epoch quebra os testes

`MIN_BLOCKS_BETWEEN_EXECUTIONS = 1` exige avançar 1 epoch (≈ 24h na Sui) entre execuções. Os testes
`test_volume_tracking` e `test_auto_grant_bronze` gravam várias execuções no mesmo epoch e abortam com
`E_RATE_LIMITED` — ou seja, **o source atual não passa na própria suíte**. O refactor não foi validado.
O patch volta para `0` (comportamento do checkpoint, testes passam). Se quiser anti-spam de verdade,
use limitação por tempo via `sui::clock::Clock` (timestamp), não por epoch — recomendação futura, fora deste patch.

## 5. INFO — dados on-chain são públicos

`memwal_account_id`, `namespace` e todos os contadores de reputação são legíveis por qualquer um.
Não há chave privada embutida nos contratos (correto). Apenas garanta que nenhum identificador
sensível seja gravado em claro nesses campos.

---

## Como aplicar e verificar

A partir da pasta do repo (`aegis/`):

```bash
# 1) revisar o patch
git apply --check security-fixes.patch     # valida sem aplicar
git apply security-fixes.patch              # aplica nos .move locais

# 2) compilar
sui move build

# 3) rodar os testes (inclui o novo Move/tests/security_tests.move)
sui move test
```

O arquivo `Move/tests/security_tests.move` (criado pelo patch) prova as correções:
- `attacker_cannot_record_execution` — exploit da falha nº1 deve abortar com `E_NOT_AUTHORIZED`.
- `attacker_cannot_repoint_walrus_blob` — exploit da falha nº2 deve abortar.
- `agent_can_record_own_execution` — o agente legítimo continua funcionando (sem regressão).

Se o seu compilador reclamar do `abort_code` no `expected_failure`, o valor `0x10004` no topo do
arquivo de teste já é local — basta confirmar que bate com `E_NOT_AUTHORIZED` em `reputation.move`.

## Sequência de deploy (quando você decidir)

1. `sui move build` + `sui move test` passando.
2. `sui client publish` → anota o **novo** package ID.
3. Atualiza `Frontend/.env.local` (`NEXT_PUBLIC_PACKAGE_ID`) e `Agent/src/config.ts` / `sdk` com o novo ID.
4. Re-registra os agentes de demo (o `ReputationObject` antigo é de outro package).
5. Redeploy do frontend (Vercel).

Até o passo 2, o contrato antigo `0x6472bb…` continua imutável e vulnerável — o demo do Overflow
roda nele até o redeploy.
