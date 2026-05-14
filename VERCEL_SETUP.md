# 🚀 Instruções: Deploy Monorepo no Vercel

## Status Atual:
- ✅ Código compilado e seguro
- ✅ Monorepo package.json criado
- ✅ @aegis/sdk adicionado como workspace dependency
- ✅ Commit feito localmente
- ⏳ **Seu turno**: Push para GitHub + Reconfigure Vercel

---

## PASSO 1: Push para GitHub

Se ainda não fez, execute na sua máquina:

```bash
cd /Users/fabioalves/Desktop/VibeCode/Sui\ -\ Hackaton/aegis

# Se remote não está configurado:
git remote add origin https://github.com/SEU_USER/aegis.git

# Fazer push
git push -u origin main
```

**Resultado esperado**: 
```
Counting objects: 3, done.
Writing objects: 100% (3/3)
remote: Create a pull request for 'main'
```

---

## PASSO 2: Reconfigurar Vercel (Importante!)

Se o deploy anterior falhou, precisa **cancelar/redenominar** o projeto e criar um novo:

### Opção A: Reconfigure Existing Project

1. Acessar: https://vercel.com/dashboard
2. Selecionar projeto "aegis"
3. Settings → General
4. **Root Directory**: Mudar de `./` para `./Frontend` ✅
5. Salvar
6. Voltar para Deployments → "Redeploy" o último commit

### Opção B: Criar Novo Projeto (Recomendado)

1. Acessar: https://vercel.com/dashboard
2. Clicar: **"Add New"** → **"Project"**
3. Selecionar repositório `aegis`
4. Preencher:
   - **Project Name**: `aegis`
   - **Framework Preset**: `Next.js` ✅
   - **Root Directory**: `./Frontend` ✅
5. **Build and Output Settings**:
   - Build Command: `npm run build`
   - Output Directory: `.next`
6. **Environment Variables** (IMPORTANTE):
   ```
   GROQ_API_KEY=seu_groq_api_key_aqui
   NEXT_PUBLIC_ENV=testnet
   NEXT_PUBLIC_SUI_NETWORK=testnet
   NEXT_PUBLIC_PACKAGE_ID=0x6472bb19be1908b8c948169c5627e625e54419b10138519e1caf5be4502d9e7d
   NEXT_PUBLIC_BADGE_REGISTRY=0xd7f704c15109a42a56b74e962745831af33fb05cece15103b928bc7d9bd4adb3
   NEXT_PUBLIC_MEMWAL_RELAYER_URL=https://relayer.staging.memwal.ai
   NEXT_PUBLIC_MEMWAL_NAMESPACE=aegis
   ```
7. Clicar **"Deploy"**

---

## PASSO 3: Aguardar Build

Tempo esperado: **2-3 minutos**

### Se build falhar novamente:
- Verificar logs: Dashboard → Deployments → Click no deploy
- Procurar por erros de instalação
- Erros comuns:
  - ❌ `@aegis/sdk not found` → package.json não foi atualizado
  - ❌ `workspace:*` syntax error → npm precisa ser atualizado no Vercel
  - ❌ `Root directory not found` → Verificar Root Directory = `./Frontend`

### Se build bem-sucedido:
```
✓ Compiled successfully
✓ Generating static pages (12/12)
Route (pages): ...
```

---

## PASSO 4: Conectar Domínio aegisonchain.xyz

Após deploy bem-sucedido:

1. **No Vercel Dashboard**:
   - Projeto → Settings → Domains
   - Copiar os 2 **Vercel Nameservers**

2. **Na Namecheap**:
   - Acessar: https://www.namecheap.com/myaccount/login
   - Selecionar `aegisonchain.xyz`
   - **Manage** → **Nameservers**
   - Trocar para os nameservers Vercel
   - Salvar

3. **Aguardar propagação** (15 min - 24h):
   - Vercel notificará quando pronto
   - Status mudará de "Pending" → "Valid"

---

## PASSO 5: Verificar Deploy em Produção

Assim que domínio estiver pronto, testar:

```bash
# Verificar HTTPS
curl -I https://aegisonchain.xyz

# Deve ter:
# HTTP/2 200
# X-Content-Type-Options: nosniff
# X-Frame-Options: DENY
```

### Testes Funcionais:
- [ ] Home page carrega: https://aegisonchain.xyz
- [ ] Tema funciona (toggle light/dark)
- [ ] Navbar e links funcionam
- [ ] Agents page carrega dados
- [ ] Wallet button está presente
- [ ] AI Chat responde

---

## 📊 Resumo de Mudanças

| Arquivo | Mudança |
|---------|---------|
| `aegis/package.json` | ✅ Criado (workspaces) |
| `aegis/Frontend/package.json` | ✅ Atualizado (@aegis/sdk) |
| Git Commits | ✅ 2 commits (security + monorepo) |
| Vercel Root Directory | ⏳ **Você configura**: `./Frontend` |
| Vercel Env Vars | ⏳ **Você adiciona**: 8 variáveis |

---

## 🆘 Troubleshooting

### Erro: `@aegis/sdk not found`
**Causa**: package.json não foi atualizado
**Solução**: Verificar se Frontend/package.json tem `"@aegis/sdk": "workspace:*"`

### Erro: `npm ERR! workspace not found`
**Causa**: Root package.json pode estar malformado
**Solução**: Verificar JSON syntax em aegis/package.json

### Erro: Root Directory não encontrado
**Causa**: Vercel está procurando em `./` em vez de `./Frontend`
**Solução**: Settings → Root Directory → Mudar para `./Frontend`

### Build timeout
**Causa**: Agent SDK está demorando muito para compilar
**Solução**: Não há muito o que fazer, tente redeploy

---

## ✅ Próximos Passos

1. ✅ **Você faz**: git push (local)
2. ✅ **Você configura**: Vercel Root Directory + Env Vars
3. ✅ **Você aguarda**: Build (2-3 min)
4. ✅ **Você conecta**: Nameservers no Namecheap
5. ✅ **Você testa**: Site em https://aegisonchain.xyz

**Tempo total**: ~20 minutos

---

## 📚 Referências

- [Vercel Workspaces](https://vercel.com/docs/monorepo)
- [npm Workspaces](https://docs.npmjs.com/cli/v7/using-npm/workspaces)
- [Next.js Monorepo](https://nextjs.org/docs/advanced-features/monorepo)

---

**Data**: 2026-05-14  
**Status**: Pronto para deploy ✅
