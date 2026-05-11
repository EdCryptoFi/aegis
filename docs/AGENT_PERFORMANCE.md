# Aegis Agent Performance Dashboard

Real-time agent reputation tracking on Sui blockchain.

**Package**: `0xdcfe62a45e5eb19edefc1bf246b23e6bf97c38004805bc7890f8a5bd09e6bc57`  
**BadgeRegistry**: `0x8da4eb777bcef3b0cbc65fdbe02868c30b73245d852bd24ab61a783520a0fcb8`

## Live Agents

| Agent | Trust | Badge | Score | Executions | Status |
|-------|-------|-------|-------|-------------|--------|
| AlphaTrader | ✅ HIGH | 🥇 Gold | 100 | 5/5 | Active |
| BetaBot | ⚠️ MEDIUM | 🥈 Silver | 80 | 4/5 | Active |
| GammaScam | ❌ FLAGGED | 🚫 Revoked | 0 | 0/3 | Revoked |

## Agent Details

### AlphaTrader 🥇

```
Contract: 0x4cd8be48b4e1e0b1bdf01e93fedeac7de29f350b8ea1085367cc9d91367bfefc
Success Rate: 100%
Total Volume: 2.5 SUI
Avg Slippage: 20 BPS
Badge: GOLD (Valid)
```

### BetaBot 🥈

```
Contract: 0xabeddc0a2835b6db914b4b06eb246f643076960bdc8bffc2d9ff120abda90dec
Success Rate: 80%
Total Volume: 3.2 SUI
Avg Slippage: 120 BPS
Badge: SILVER (Valid)
```

### GammaScam 🚫

```
Contract: 0xb3fa170083a4bbe952a83147ed3839e75ba008558f8f017aee58c9bc89c9ffb6
Success Rate: 0%
Total Volume: 0 SUI
Avg Slippage: 600 BPS ⚠️
Badge: REVOKED (Auto-revoked)
Reason: High slippage detected
```

## Auto-Revocation Rules

```
┌─────────────────────────────────────────────────────────┐
│                    FLAG CONDITIONS                       │
├─────────────────────────────────────────────────────────┤
│  • Success rate < 70%                                   │
│  • 5+ consecutive failures                              │
│  • Slippage > 500 BPS                                   │
└─────────────────────────────────────────────────────────┘
                         │
                         ▼
              ┌──────────────────┐
              │   AUTO-REVOKE    │
              │   badge_status    │
              │       =          │
              │     false        │
              └──────────────────┘
```

## Event Stream

| Event | Agent | Timestamp |
|-------|-------|-----------|
| AgentRegistered | AlphaTrader | 2026-05-10 12:30 |
| ExecutionRecorded | AlphaTrader | 2026-05-10 12:31 |
| BadgeMinted | AlphaTrader | 2026-05-10 12:32 |
| AgentFlagged | GammaScam | 2026-05-10 12:35 |
| BadgeRevoked | GammaScam | 2026-05-10 12:36 |

---

[View on Explorer →](https://suivision.xyz/object/0x8da4eb777bcef3b0cbc65fdbe02868c30b73245d852bd24ab61a783520a0fcb8)