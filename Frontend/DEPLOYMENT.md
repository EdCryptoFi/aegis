# 🚀 Guia de Deployment - Aegis Frontend em aegisonchain.xyz

## Status: ✅ PRONTO PARA DEPLOY

- ✅ Código compilado com sucesso (Next.js build OK)
- ✅ Problemas de segurança corrigidos
- ✅ TypeScript strict mode ativado
- ✅ CORS configurado
- ✅ Validação de entrada implementada
- ✅ Environment variables configuradas corretamente

---

## 📋 PREREQUISITOS

1. **Conta GitHub** - com o repositório deste projeto
2. **Conta Vercel** - free.vercel.com (grátis)
3. **Domínio aegisonchain.xyz** - já possui na Namecheap
4. **Groq API Key** - free em console.groq.com

---

## 📌 PASSO 1: Preparar o Repositório GitHub

### Se o repositório não estiver no GitHub ainda:

```bash
# 1. Iniciar repositório local (se não estiver feito)
cd aegis
git init

# 2. Adicionar remoto (substitua com seu repo)
git remote add origin https://github.com/SEU_USER/aegis.git

# 3. Fazer push
git branch -M main
git push -u origin main
```

### Se já estiver no GitHub:
```bash
# Apenas fazer push das mudanças
cd aegis
git push origin main
```

---

## 🔧 PASSO 2: Deployar no Vercel

### Opção A: Vercel Dashboard (RECOMENDADO - Visual)

1. Acessar: **vercel.com**
2. Clicar em **"Add New"** → **"Project"**
3. Conectar sua conta GitHub (Authorize se necessário)
4. Selecionar o repositório do projeto
5. Configurar:
   - **Framework Preset**: Next.js ✓
   - **Root Directory**: `aegis/Frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

6. **Adicionar variáveis de ambiente** (CRITICAL):
   ```
   GROQ_API_KEY=your_actual_groq_key_here
   NEXT_PUBLIC_ENV=testnet
   NEXT_PUBLIC_SUI_NETWORK=testnet
   NEXT_PUBLIC_PACKAGE_ID=0x5b0b03884fd52a1c36d21b486fe44ddf016837e413c94b469a24bf5f2887c5f9
   NEXT_PUBLIC_BADGE_REGISTRY=0xd79da82c2490d212b3892a17a0c22c2f6adaed30a412daafb765ad2ec0a448b3
   NEXT_PUBLIC_MEMWAL_RELAYER_URL=https://relayer.staging.memwal.ai
   NEXT_PUBLIC_MEMWAL_NAMESPACE=aegis
   ```

7. Clicar **"Deploy"** → Esperar ~2-3 minutos

### Opção B: Vercel CLI (Terminal)

```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Fazer login
vercel login

# 3. Deploy
cd aegis/Frontend
vercel --prod

# 4. Seguir prompts e adicionar variáveis de ambiente
```

---

## 🌐 PASSO 3: Conectar Domínio aegisonchain.xyz

### Via Namecheap (onde você tem o domínio):

1. **Copiar nameservers Vercel**
   - Acessar projeto no Vercel → Settings → Domains
   - Notar os 2 nameservers Vercel

2. **Acessar Namecheap**
   - Ir para: https://www.namecheap.com/myaccount/login/
   - Selecionar seu domínio `aegisonchain.xyz`
   - Ir a **"Nameservers"** → **"Manage Nameservers"**
   - Trocar para os nameservers Vercel fornecidos
   - Clicar **"Save Changes"**

3. **Aguardar propagação**
   - Pode levar 15 minutos a 24 horas
   - Vercel notificará quando pronto

4. **Verificar no Vercel**
   - Settings → Domains
   - Status mudará de "Pending" → "Valid"

---

## 🧪 PASSO 4: Verificação Pós-Deploy

### Checklist de Funcionamento:

- [ ] **Site carrega**: Acessar `https://aegisonchain.xyz`
- [ ] **HTTPS funciona**: URL é HTTPS (certificado automático)
- [ ] **Home page carrega**: Com logo, tema, navbar
- [ ] **Navegação funciona**:
  - [ ] Home → Agents
  - [ ] Agents → Agent detail page
  - [ ] Navbar links funcionam
- [ ] **Tema funciona**:
  - [ ] Toggle light/dark mode
  - [ ] Cores corretas
- [ ] **Wallet dApp Kit funciona**:
  - [ ] Botão "Connect Wallet" aparece
  - [ ] Consegue conectar Sui wallet
- [ ] **AI Assistant funciona**:
  - [ ] Botão de chat está visível
  - [ ] Consegue enviar mensagens
  - [ ] Recebe respostas da Groq API
- [ ] **Performance**:
  - [ ] Pages carregam rápido (< 2s)
  - [ ] Sem erros no browser console
  - [ ] Network requests OK

### Verificar Segurança:

```bash
# 1. Verificar CORS headers
curl -i https://aegisonchain.xyz/api/chat \
  -H "Origin: https://example.com"

# Deve retornar:
# Access-Control-Allow-Origin: https://aegisonchain.xyz

# 2. Verificar HTTPS headers
curl -i https://aegisonchain.xyz

# Deve ter:
# X-Content-Type-Options: nosniff
# X-Frame-Options: DENY
# X-XSS-Protection: 1; mode=block
```

---

## 🔑 Gerenciar Secrets Seguros

### Para adicionar/alterar GROQ_API_KEY:

1. Vercel Dashboard → Project Settings
2. Environment Variables
3. Procurar por `GROQ_API_KEY`
4. Editar valor
5. Re-deploy automático será acionado

### IMPORTANTE:
- ❌ NUNCA commit `.env.local` com valores reais
- ❌ NUNCA exponha keys em público
- ✅ Use Vercel Environment Variables para secrets
- ✅ `.gitignore` protege `.env.local` local

---

## 📊 Monitorar Deployment

- **Vercel Analytics**: Projeto → Analytics
- **Build Logs**: Projeto → Deployments → Última build
- **Edge Logs**: Performance Monitoring
- **Error Tracking**: Integração com error reporting

---

## 🔄 Workflow Contínuo

Após configurar Vercel:

1. **Desenvolvimento Local**:
   ```bash
   npm run dev
   ```

2. **Fazer Commit**:
   ```bash
   git add .
   git commit -m "feat: descrição"
   git push origin main
   ```

3. **Vercel Auto-Deploy**:
   - Vercel monitora GitHub
   - Detecta novo commit em `main`
   - Auto-deploya em 2-3 minutos

4. **Ver Deploy**:
   - Vercel Dashboard → Deployments
   - Clique no status para ver logs

---

## 🆘 Troubleshooting

### "Build failed"
- [ ] Verificar logs em Vercel → Deployments
- [ ] Compilar localmente: `npm run build`
- [ ] Verificar TypeScript: `npm run lint`

### "GROQ_API_KEY not configured"
- [ ] Verificar se env var está setada em Vercel
- [ ] Re-deploy: `vercel --prod`
- [ ] Verificar se chave é válida em groq.com

### "CORS error in browser"
- [ ] Verificar console do browser
- [ ] next.config.js tem CORS config
- [ ] Re-deploy necessário para mudanças em next.config.js

### "Domínio não funciona"
- [ ] Aguardar 24h para propagação DNS
- [ ] Verificar Vercel → Project → Domains (deve estar "Valid")
- [ ] Vercel Dashboard → Settings → Domains tem nameservers corretos

---

## 📞 Suporte

- **Vercel Docs**: https://vercel.com/docs/frameworks/nextjs
- **Next.js Docs**: https://nextjs.org/docs
- **Groq API**: https://console.groq.com/docs

---

## ✨ Próximos Passos (Opcional)

Após deploy bem-sucedido:

1. **Setup Analytics**: Vercel Web Analytics
2. **Setup Monitoring**: Error tracking (Sentry, LogRocket)
3. **Custom Domain SSL**: Já incluído (Let's Encrypt via Vercel)
4. **CI/CD**: GitHub Actions para testes automáticos
5. **A/B Testing**: Vercel Experimentation

---

**Data de Atualização**: 2026-05-14
**Status**: ✅ Pronto para Deploy em Produção
