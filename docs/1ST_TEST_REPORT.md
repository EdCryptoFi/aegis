# Aegis - 1st Test Report

**Date:** May 10, 2026
**Project:** Aegis - Agent Reputation Oracle
**Hackathon:** Sui Overflow 2026
**Status:** CP1 Complete ✅

---

## Executive Summary

Aegis is a trust layer for AI agents on Sui that enables verifiable reputation tracking through on-chain metrics and persistent memory via Walrus storage.

**Hook:** "Trust is not asked. It's proven. On-chain."

**Tracks:** Agentic Web (Primary) + Walrus (Secondary)

---

## What Was Built

### 1. Smart Contracts (Move)

| File | Description | Tests |
|------|-------------|-------|
| `reputation.move` | Core ReputationObject with metrics tracking | 4/4 |
| `badge.move` | Bronze/Silver/Gold badge minting | - |
| `events.move` | On-chain event definitions | - |

**ReputationObject Fields:**
- `agent_id`, `total_executions`, `successful_executions`
- `failed_executions`, `total_volume`, `total_slippage`
- `uptime_score`, `last_update`, `is_flagged`, `walrus_blob_id`

**Auto-flagging Conditions:**
- Success rate < 50%
- 5+ consecutive failures
- Slippage > 500 basis points (5%)

### 2. TypeScript SDK

| Module | Purpose |
|--------|---------|
| `Agent/src/sdk.ts` | Core SDK - getAgentReputation(), registerAgent(), recordExecution() |
| `Walrus/src/storage.ts` | Persistent log storage |
| `Walrus/src/retrieval.ts` | Blob verification |

### 3. Frontend Demo

- `AgentCard.tsx` - Reputation display component
- `index.tsx` - Home page with agent search
- `agent/[address].tsx` - Agent detail page

---

## Deployment

**Network:** Sui Testnet
**Package ID:** `0x10914ba0e821ac6581660a323bde632d0a98e614fd1cbe4bbebda2171554489a`
**Transaction:** `9URuVybNNYH6tV5qhdDSagL2fcMTkKdZ7U9k8iWcBn9h`
**Deployed Modules:** badge, events, reputation
**Gas Spent:** ~32,700 SUI

**Explorer:** https://suivision.xyz/package/0x10914ba0e821ac6581660a323bde632d0a98e614fd1cbe4bbebda2171554489a

---

## Repository

**GitHub:** https://github.com/EdCryptoFi/aegis

```
aegis/
├── Agent/          # TypeScript SDK
├── Walrus/        # Storage integration  
├── Frontend/      # Next.js demo
├── Move/          # Smart contracts
├── docs/          # SPEC.md + KNOWLEDGE.md
├── README.md
└── LICENSE        # MIT
```

---

## Knowledge Base

Studied and documented:
- **Sui Object Model** - Everything is an object with unique ID
- **PTBs (Programmable Transaction Blocks)** - Up to 1024 ops per transaction
- **DeepBookV3** - CLOB native on Sui with DEEP token
- **Walrus** - Decentralized storage with blob_id on-chain
- **Events** - Essential for indexers

---

## Test Results

```
Running Move unit tests
[ PASS ] aegis::reputation_tests::test_register_agent
[ PASS ] aegis::reputation_tests::test_record_successful_execution
[ PASS ] aegis::reputation_tests::test_record_failed_execution
[ PASS ] aegis::reputation_tests::test_volume_tracking

Test result: OK. Total tests: 4; passed: 4; failed: 0
```

---

## CP1 Checklist

| Task | Status | Date |
|------|--------|------|
| SPEC.md written | ✅ | May 10 |
| ReputationObject compiled | ✅ | May 10 |
| DeepBook integration | ⚠️ | Partial |
| Loom demo ≤60s | ❌ | Pending |
| GitHub repo | ✅ | May 10 |
| Deploy testnet | ✅ | May 10 |
| Package ID recorded | ✅ | May 10 |

---

## Next Steps

### CP2 (Week 3-4)
- [ ] Walrus anchor (blob_id stored on-chain)
- [ ] Badge mint integration
- [ ] Frontend badge display
- [ ] TypeScript snippet for wallets

### CP3 (Week 5-6)
- [ ] Demo video ≤5min
- [ ] Package docs
- [ ] Devfolio submission

---

## Links

- **Sui Docs:** https://docs.sui.io/
- **Walrus Docs:** https://docs.wal.app/
- **Hackathon:** https://overflow.sui.io/
- **Registry:** https://overflowportal.sui.io

---

*Report generated on May 10, 2026*
