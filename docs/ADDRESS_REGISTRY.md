# Aegis - Addresses & Wallets Registry

## Current Session Wallet

| Role | Address | Notes |
|------|---------|-------|
| **Primary Wallet** | `0x8c8598aba05e5c2998a17c4d726c209221d021a71cc77a3f5809bc0009edf6c1` | Main wallet - all txs signed here |

---

## Deployed Contracts (v1 - Obsolete)

| Package | Address | Status |
|---------|---------|--------|
| **Aegis v1 Package** | `0xdcfe62a45e5eb19edefc1bf246b23e6bf97c38004805bc7890f8a5bd09e6bc57` | ❌ Deprecated |
| **BadgeRegistry v1** | `0x8da4eb777bcef3b0cbc65fdbe02868c30b73245d852bd24ab61a783520a0fcb8` | ❌ Deprecated |

---

## Deployed Contracts (v2 - Deprecated)

| Package | Address | Status |
|---------|---------|--------|
| **Aegis v2 Package** | `0x6472bb19be1908b8c948169c5627e625e54419b10138519e1caf5be4502d9e7d` | ❌ Deprecated |
| **UpgradeCap** | `0xf7b9e65e712262ab0cb6ec8a7cc2f574a3941d6789b959da6d06fa4c37175a8a` | ❌ Deprecated |

---

## Deployed Contracts (v3 - Active / Security Fix)

| Package | Address | Status |
|---------|---------|--------|
| **Aegis v3 Package** | `0x5b0b03884fd52a1c36d21b486fe44ddf016837e413c94b469a24bf5f2887c5f9` | ✅ Active |
| **BadgeRegistry v3** | `0xd79da82c2490d212b3892a17a0c22c2f6adaed30a412daafb765ad2ec0a448b3` | ✅ Active (shared) |
| **UpgradeCap v3** | `0xe6e207fbf707823e349ac024332dc718209979ae4de2999a00071803ec5013c3` | 🔐 For upgrades |

---

## Demo Agents (ReputationObjects)

| Agent | Object ID | Badge | Trust | Owner Wallet |
|-------|-----------|-------|-------|--------------|
| **AlphaTrader** | `0x4cd8be48b4e1e0b1bdf01e93fedeac7de29f350b8ea1085367cc9d91367bfefc` | 🥇 Gold | HIGH (100%) | `0x8c8598aba05e5c2998a17c4d726c209221d021a71cc77a3f5809bc0009edf6c1` |
| **BetaBot** | `0xabeddc0a2835b6db914b4b06eb246f643076960bdc8bffc2d9ff120abda90dec` | 🥈 Silver | MEDIUM (80%) | `0x8c8598aba05e5c2998a17c4d726c209221d021a71cc77a3f5809bc0009edf6c1` |
| **GammaScam** | `0xb3fa170083a4bbe952a83147ed3839e75ba008558f8f017aee58c9bc89c9ffb6` | 🚫 Revoked | FLAGGED (0%) | `0x8c8598aba05e5c2998a17c4d726c209221d021a71cc77a3f5809bc0009edf6c1` |
| **DeltaBot** | `0x853ad4079d47acffaec2a138a0a0b727c1c5649081c53a5c33c8a217c5a1d01c` | 🚫 Revoked | FLAGGED | `0x8c8598aba05e5c2998a17c4d726c209221d021a71cc77a3f5809bc0009edf6c1` |
| **Epsilon** | `0x2cc5321741f10ba6d928fc12f641e6c1e85fc1ea1043e62f6dc86da0872529f9` | None | NEW | `0x8c8598aba05e5c2998a17c4d726c209221d021a71cc77a3f5809bc0009edf6c1` |

---

## Stale Packages (Test Deployments)

| Package | Address | Notes |
|---------|---------|-------|
| **Package 1 (stale)** | `0x10914ba0e821ac6581660a323bde632d0a98e614fd1cbe4bbebda2171554489a` | 🔴 Abandoned |

---

## Wallet Roles Summary

### Primary Wallet: `0x8c8598aba05e5c2998a17c4d726c209221d021a71cc77a3f5809bc0009edf6c1`

```
Role: Developer / Admin
Used for:
  ├── Deploy contracts
  ├── Register demo agents
  ├── Record executions
  ├── Grant badges
  ├── Revoke badges
  └── Test security features

All transactions in this session signed by this wallet.
```

---

## Address Reference Table

| Short ID | Full Address | Usage |
|----------|--------------|-------|
| `0x8c85...` | `0x8c8598aba05e5c2998a17c4d726c209221d021a71cc77a3f5809bc0009edf6c1` | Primary wallet |
| `0x6472...` | `0x6472bb19be1908b8c948169c5627e625e54419b10138519e1caf5be4502d9e7d` | v2 Package (deprecated) |
| `0x5b0b...` | `0x5b0b03884fd52a1c36d21b486fe44ddf016837e413c94b469a24bf5f2887c5f9` | v3 Package (active) |
| `0xd79d...` | `0xd79da82c2490d212b3892a17a0c22c2f6adaed30a412daafb765ad2ec0a448b3` | BadgeRegistry v3 (active) |
| `0xdcfe...` | `0xdcfe62a45e5eb19edefc1bf246b23e6bf97c38004805bc7890f8a5bd09e6bc57` | v1 Package (old) |
| `0x8da4...` | `0x8da4eb777bcef3b0cbc65fdbe02868c30b73245d852bd24ab61a783520a0fcb8` | BadgeRegistry v1 |
| `0xf7b9...` | `0xf7b9e65e712262ab0cb6ec8a7cc2f574a3941d6789b959da6d06fa4c37175a8a` | UpgradeCap |
| `0x4cd8...` | `0x4cd8be48b4e1e0b1bdf01e93fedeac7de29f350b8ea1085367cc9d91367bfefc` | AlphaTrader RepObject |
| `0xabed...` | `0xabeddc0a2835b6db914b4b06eb246f643076960bdc8bffc2d9ff120abda90dec` | BetaBot RepObject |
| `0xb3fa...` | `0xb3fa170083a4bbe952a83147ed3839e75ba008558f8f017aee58c9bc89c9ffb6` | GammaScam RepObject |
| `0x853a...` | `0x853ad4079d47acffaec2a138a0a0b727c1c5649081c53a5c33c8a217c5a1d01c` | DeltaBot RepObject |
| `0x2cc5...` | `0x2cc5321741f10ba6d928fc12f641e6c1e85fc1ea1043e62f6dc86da0872529f9` | Epsilon RepObject |
| `0x1091...` | `0x10914ba0e821ac6581660a323bde632d0a98e614fd1cbe4bbebda2171554489a` | Stale Package |

---

## Explorer Links

| Resource | URL |
|----------|-----|
| Primary Wallet | https://suivision.xyz/account/0x8c8598aba05e5c2998a17c4d726c209221d021a71cc77a3f5809bc0009edf6c1 |
| v2 Package (deprecated) | https://testnet.suivision.xyz/package/0x6472bb19be1908b8c948169c5627e625e54419b10138519e1caf5be4502d9e7d |
| v3 Package (active) | https://testnet.suivision.xyz/package/0x5b0b03884fd52a1c36d21b486fe44ddf016837e413c94b469a24bf5f2887c5f9 |
| BadgeRegistry v3 | https://testnet.suivision.xyz/object/0xd79da82c2490d212b3892a17a0c22c2f6adaed30a412daafb765ad2ec0a448b3 |
| UpgradeCap | https://suivision.xyz/object/0xf7b9e65e712262ab0cb6ec8a7cc2f574a3941d6789b959da6d06fa4c37175a8a |
| AlphaTrader | https://suivision.xyz/object/0x4cd8be48b4e1e0b1bdf01e93fedeac7de29f350b8ea1085367cc9d91367bfefc |
| BetaBot | https://suivision.xyz/object/0xabeddc0a2835b6db914b4b06eb246f643076960bdc8bffc2d9ff120abda90dec |
| GammaScam | https://suivision.xyz/object/0xb3fa170083a4bbe952a83147ed3839e75ba008558f8f017aee58c9bc89c9ffb6 |

---

*Document generated: 2026-05-10*
*Total unique addresses: 13*