# Aegis — Runbook Final de Segurança e Redeploy

**Data:** 2026-06-18
**Repositório:** `github.com/EdCryptoFi/aegis`
**Contrato vulnerável em produção (testnet):** `0x6472bb19be1908b8c948169c5627e625e54419b10138519e1caf5be4502d9e7d`
**Objetivo deste documento:** dar a um operador (você ou o Claude Code na sua máquina) tudo o que é
preciso para (1) confirmar as correções, (2) compilar e testar, (3) redeployar com segurança e
(4) re-apontar todo o stack para o novo package — em ordem, com comandos prontos.

> **Estado atual:** as correções nos contratos **já estão aplicadas no código-fonte** (`Move/sources/`).
> A compilação/teste e o publish **não foram executados** (precisam do `sui` CLI na sua máquina;
> o ambiente da sessão é ARM64/GLIBC 2.35 e não roda os binários pré-compilados da Sui).

---

## 0. TL;DR — sequência mínima

```bash
# 1. Verificar correções + testar (na pasta aegis/Move)
cd aegis/Move
sui move build
sui move test                 # 3 novos security_tests devem passar

# 2. Publicar o contrato corrigido (gera NOVO package id)
sui client publish --gas-budget 200000000

# 3. Anotar o novo Package ID e o novo BadgeRegistry (objeto compartilhado criado no init)
#    e atualizar todos os pontos de config (seção 5)

# 4. Re-registrar agentes de demo e redeployar o frontend (seção 6)
```

---

## 1. Resumo dos achados (auditoria)

| # | Severidade | Arquivo | Função | Problema | Status |
|---|-----------|---------|--------|----------|--------|
| 1 | **CRÍTICA** | `reputation.move` | `record_execution` | Objeto compartilhado sem checagem de sender → reputação forjável por qualquer carteira | ✅ Corrigido |
| 2 | **CRÍTICA (regressão)** | `reputation.move` | `update_walrus_blob_id` | Refactor removeu o `assert` de dono; virou `public fun` sem `ctx` → qualquer um re-aponta o blob | ✅ Corrigido |
| 3 | **MÉDIA** | `badge.move` | `mint_badge` | Transferia o badge para `tx_sender`, sem gate → roubo/forja de badge | ✅ Corrigido |
| 4 | **BAIXA (funcional)** | `reputation.move` | `record_execution` | `MIN_BLOCKS_BETWEEN_EXECUTIONS = 1` (epoch ≈ 24h) quebrava a própria suíte de testes | ✅ Corrigido (→ 0) |
| 5 | **INFO** | geral | — | Dados on-chain são públicos por design; nenhum segredo embutido nos contratos | OK |
| 6 | **INTEGRAÇÃO** | `Frontend/src/lib/sdk.ts` | `link_memwal_session` | Frontend chamava função que **não existe** no contrato atual | ✅ Resolvido (opção A — chamada removida) |

**Sobre "dado exposto":** não há vazamento. Em blockchain todos os campos de objeto são legíveis.
Os segredos locais (`.env.local`, arquivo `.key`) **nunca foram commitados** — confirmado em todo o
histórico do Git. A falha real é de **integridade** (escrita sem permissão), não de confidencialidade.
A carteira não foi exposta por nada nesse código.

---

## 2. Detalhe técnico de cada vulnerabilidade e a correção aplicada

### #1 — `record_execution` sem autorização (CRÍTICA)

O `ReputationObject` é criado com `transfer::share_object` (objeto **compartilhado**), então qualquer
transação o referencia. A função não verificava o autor. Qualquer carteira podia inflar
`total_executions`/`successful_executions`/`total_volume` (e farmar badges via `auto_check`) ou
sabotar um agente registrando falhas/slippage até `is_flagged = true`.

**Correção aplicada** (`Move/sources/reputation.move`, início de `record_execution`):
```move
assert!(tx_sender(ctx) == rep.agent_id, E_NOT_AUTHORIZED);
```
Modelo escolhido: **só a própria carteira do agente** grava. Casa com `register_agent`
(`agent_id = sender`) e com o demo (uma carteira por agente).

### #2 — `update_walrus_blob_id` perdeu a autorização (CRÍTICA, regressão)

Antes do refactor a função era `entry` e tinha `assert!(rep.agent_id == tx_sender(ctx), 0)`.
O source vigente a havia transformado em `public fun` **sem `ctx` e sem assert** — qualquer um
re-apontava o `walrus_blob_id` de qualquer agente para um blob malicioso.

**Correção aplicada:**
```move
public entry fun update_walrus_blob_id(
    rep: &mut ReputationObject,
    blob_id: vector<u8>,
    ctx: &TxContext
) {
    assert!(tx_sender(ctx) == rep.agent_id, E_NOT_AUTHORIZED);
    rep.walrus_blob_id = some(blob_id);
}
```

### #3 — `mint_badge` entregava o badge ao chamador (MÉDIA)

`Move/sources/badge.move` transferia para `tx_sender(_ctx)`. Combinado com #1, era forja trivial.

**Correção aplicada:**
```move
public entry fun mint_badge(rep: &mut ReputationObject, badge_type: u8, _ctx: &mut TxContext) {
    assert!(tx_sender(_ctx) == get_agent_id(rep), 0);   // gate
    ...
    transfer::transfer(badge, get_agent_id(rep));        // destinatário = agente
}
```

### #4 — rate-limit por epoch (BAIXA, funcional)

`MIN_BLOCKS_BETWEEN_EXECUTIONS = 1` exigia avançar 1 epoch (~24h) entre execuções e fazia
`test_volume_tracking` e `test_auto_grant_bronze` abortarem com `E_RATE_LIMITED`. Voltou para `0`.

> **Recomendação futura (fora do escopo deste fix):** se quiser anti-spam de verdade, limite por
> **tempo** via `sui::clock::Clock` (timestamp em ms), não por epoch.

### #6 — `link_memwal_session` ausente (INTEGRAÇÃO) — ✅ RESOLVIDO (opção A)

`Frontend/src/lib/sdk.ts` fazia `moveCall` em `${PACKAGE_ID}::reputation::link_memwal_session`, mas
essa função **não existe** no `reputation.move` atual (só existia no checkpoint antigo). No novo
package esse caminho falharia.

**Aplicado nesta sessão (opção A — remover a chamada):**
- Removida a função `linkMemWalSession` em `Frontend/src/lib/sdk.ts`.
- Removida a entrada `linkMemWalSession` da interface `WriteFunctions`.
- Verificado: **0** referências restantes a `link_memwal_session`/`linkMemWalSession` em `Frontend/src`;
  nenhum componente a consumia. As leituras do campo `memwal_session_id` (sdk.ts:70 e 109) foram
  mantidas — caem para `null` quando o campo não existe, sem erro. O vínculo MemWal continua coberto
  pelo módulo `memwal_adapter`.

> Alternativa não escolhida (B): re-adicionar `link_memwal_session` ao contrato **com auth**
> (`assert!(tx_sender(ctx) == rep.agent_id, ...)`), além do campo `memwal_session_id` na struct e no
> `register_agent`. Descartada para reduzir superfície no hackathon.

---

## 3. Verificação (rodar na sua máquina — tem `sui`)

```bash
cd aegis/Move
sui move build          # deve compilar sem erros
sui move test           # toda a suíte, incluindo:
                        #   security_tests::attacker_cannot_record_execution      [expected abort]
                        #   security_tests::attacker_cannot_repoint_walrus_blob    [expected abort]
                        #   security_tests::agent_can_record_own_execution         [ok]
```

Arquivo de prova: `Move/tests/security_tests.move` (criado nesta sessão). Se o compilador reclamar do
`abort_code` no `expected_failure`, o valor `0x10004` está definido localmente no topo do teste —
basta confirmar que bate com `E_NOT_AUTHORIZED` em `reputation.move`.

> Os arquivos `SECURITY_AUDIT.md` e `security-fixes.patch` na raiz de `aegis/` são registro.
> **NÃO** rode `git apply security-fixes.patch` — as mudanças **já estão no source**; reaplicar dá conflito.

---

## 4. Publish (gera novo Package ID)

```bash
cd aegis/Move
sui client active-env           # confirme: testnet
sui client active-address       # confirme a carteira de deploy (com SUI de gas)
sui client publish --gas-budget 200000000
```

Da saída do publish, **anote**:
- **Package ID** (novo) → objeto `published` / `packageId`.
- **BadgeRegistry** (objeto compartilhado) e **AdminCap** (vai para sua carteira) — criados no `init`
  do módulo `badge_registry`. Procure em *Object Changes* por:
  - `...::badge_registry::BadgeRegistry` → **shared** → esse é o novo `badgeRegistry`.
  - `...::badge_registry::AdminCap` → **owned** (sua carteira) → guarde o ID p/ ações admin.

---

## 5. Re-apontar TODO o stack para o novo package

O package id antigo está **hardcoded em vários lugares** (duplicação). Após o publish, substitua o
antigo `0x6472bb…` pelo **novo** e o `0xd7f704…` (badge registry) pelo novo, nestes arquivos:

**Agent (`aegis/Agent/`)**
- `src/config.ts` → `packageId`, `badgeRegistry`
- `src/sdk.ts` → `PACKAGE_ID`, `BADGE_REGISTRY_ID`
- `src/types.ts` → `PACKAGE_ID`
- `src/setup-demo-agents.ts` → `PACKAGE_ID`
- `src/test-functions.ts` → `PACKAGE_ID`
- `data/demo-agents.json` → `package_id`, `badge_registry` (e os `reputation_object_id` ficam obsoletos — serão recriados no re-registro)
- recompilar: `npm run build` (regenera `dist/`)

**Frontend (`aegis/Frontend/`)**
- `.env.local` → `NEXT_PUBLIC_PACKAGE_ID`, `NEXT_PUBLIC_BADGE_REGISTRY`
- `.env.local.example` → idem (opcional, mantém doc coerente)
- `src/config.ts` → defaults de fallback
- `src/lib/environments.ts` → bloco `testnet` (`packageId`, `badgeRegistry`)
- `src/lib/sdk.ts` → a chamada `link_memwal_session` **já foi removida** (seção #6); nada a fazer aqui

**Busca de sanidade (não deve sobrar referência ao package antigo, exceto histórico/docs):**
```bash
cd aegis
grep -rn "0x6472bb19be1908b8c948169c5627e625e54419b10138519e1caf5be4502d9e7d" \
  --include='*.ts' --include='*.tsx' --include='*.json' --include='*.env*' . \
  | grep -vE '/dist/|/node_modules/|/build/'
# deve retornar vazio depois das substituições
```

---

## 6. Re-registrar agentes e redeployar o frontend

```bash
# Agentes de demo no novo package (cria novos ReputationObject compartilhados)
cd aegis/Agent
npm run build
node dist/setup-demo-agents.js     # confira o nome do script no package.json
# -> anote os novos reputation_object_id e atualize data/demo-agents.json se o frontend os consome

# Frontend
cd ../Frontend
npm run build                       # build local deve passar (0 erros)
# Deploy Vercel: push para main (deploy automático) OU `vercel --prod`
# Garanta que as env vars NEXT_PUBLIC_* novas estão no projeto Vercel (Settings → Environment Variables)
```

**Checklist pós-deploy**
- [ ] Frontend aponta para o novo Package ID (verificar no app: registrar agente → record execution funciona)
- [ ] `record_execution` por carteira que **não** é a dona aborta (auth ativa)
- [ ] `auto_check` concede badge corretamente com base na reputação real
- [ ] Fluxo de MemWal/Walrus funciona com a decisão da seção #6 aplicada
- [ ] Demo do Overflow apontando para o novo contrato (se for atualizar o link ao vivo)

---

## 7. Prompt pronto para colar no Claude Code

> Cole o bloco abaixo no Claude Code (CLI), na raiz do repo `aegis`, para ele executar as etapas que
> exigem o `sui` local. Revise cada comando antes de confirmar; **o publish gasta gas e é irreversível**.

```
Contexto: as correções de segurança dos contratos Move já estão aplicadas em aegis/Move/sources/
(record_execution e update_walrus_blob_id com assert de sender; mint_badge gateado; rate-limit=0).
Há testes em aegis/Move/tests/security_tests.move. NÃO rode `git apply security-fixes.patch` (já aplicado).

Tarefas, em ordem, parando para eu confirmar antes do publish:
1. cd aegis/Move && sui move build && sui move test  — mostre a saída; os 3 security_tests devem passar.
   (Obs: a chamada link_memwal_session do frontend JÁ foi removida — seção #6, opção A. Nada a decidir.)
2. Aguarde minha confirmação. Então: sui client publish --gas-budget 200000000.
   Capture o novo Package ID, o BadgeRegistry (shared) e o AdminCap (owned).
3. Substitua o package id antigo 0x6472bb... pelo novo e 0xd7f704... pelo novo BadgeRegistry em TODOS
   os arquivos listados na seção 5 do runbook. Rode a busca de sanidade (grep) para garantir 0 sobras.
4. cd aegis/Agent && npm run build && rode o setup de demo agents; atualize data/demo-agents.json.
5. cd aegis/Frontend && npm run build; me diga o que falta para o deploy na Vercel.
Mostre todos os diffs e peça confirmação antes de qualquer comando que gaste gas ou faça deploy.
```

---

## Apêndice — arquivos alterados nesta sessão (somente código local, sem deploy)

- `Move/sources/reputation.move` — auth em `record_execution` e `update_walrus_blob_id`; `MIN_BLOCKS_BETWEEN_EXECUTIONS = 0`; const `E_NOT_AUTHORIZED = 0x10004`.
- `Move/sources/badge.move` — gate em `mint_badge` e transferência para o agente.
- `Move/tests/security_tests.move` — novo; prova das correções.
- `Frontend/src/lib/sdk.ts` — removida a função `linkMemWalSession` e sua entrada na interface `WriteFunctions` (chamada órfã a `link_memwal_session`; seção #6, opção A).
- `SECURITY_AUDIT.md`, `security-fixes.patch`, `FINAL_SECURITY_RUNBOOK.md` — documentação/registro.
