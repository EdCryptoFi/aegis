# Aegis - Knowledge Base

## Sui Fundamentals

### Object Model
- Everything is an **object** with unique ID on-chain
- Types: Owned (address), Shared, Immutable, Party
- Versioning: ID + version for state history
- PTB (Programmable Transaction Blocks): up to 1024 operations per transaction
- Docs: https://docs.sui.io/

### DeepBookV3
- CLOB (Central Limit Order Book) native on Sui
- Supports market orders, limit orders, flash loans
- DEEP token for fees with discount
- Staking DEEP for maker/taker rebates
- Docs: https://docs.deepbook.tech/

---

## Move 2024 Edition

### Key Changes from Legacy
- `public struct` → `struct` (structs are always public, no modifier needed)
- `as u8` → `as u8()` with parentheses
- `let i = 0` → `let mut i = 0` for mutable variables
- `vector::empty<T>()` → `vector[]` literal
- Module label: `module aegis::reputation;` (no semicolon)
- Events must be internal to module with `copy + drop` abilities

### Events Pattern
```move
// Events are internal to module, don't add sender field (automatic)
struct ExecutionRecorded has copy, drop {
    success: bool,
    volume: u64,
    slippage: u64,
}

emit(ExecutionRecorded { success, volume, slippage });
```

---

## Capability Pattern (from Move Book)

Capabilities control access to operations. An object that must be passed as argument.

```move
public struct AdminCap has key { id: UID }

public fun grant_admin(_: &AdminCap, target: address, ctx: &mut TxContext) {
    transfer::transfer(AdminCap { id: object::new(ctx) }, target);
}
```

**Advantages over address check:**
- Easier migration (transfer capability object)
- More descriptive function signatures
- No extra checks in function body
- Discoverable in wallet/explorer

---

## Init Pattern (One-Time Setup)

Create initial objects on package publish:

```move
struct AegisAdmin has key { id: UID }

fun init(ctx: &mut TxContext) {
    transfer::transfer(AegisAdmin { id: object::new(ctx) }, ctx.sender());
}
```

---

## Testing with Test Scenario

```move
#[test]
fun test_shared_registry() {
    let alice = @0xA;
    let mut scenario = test_scenario::begin(alice);

    // Create shared object
    init_registry(scenario.ctx());

    // Next transaction
    scenario.next_tx(alice);

    // Use with_shared! macro for cleaner code
    scenario.with_shared!<BadgeRegistry>(|registry, _| {
        grant_badge(registry, alice, 1, scenario.ctx());
    });

    // Verify via effects
    let effects = scenario.end();
    assert_eq!(effects.num_user_events(), 1);

    test_scenario::end(scenario);
}
```

### Key Test Functions
- `test_scenario::begin(sender)` - Start scenario
- `scenario.next_tx(sender)` - Advance transaction
- `take_shared<T>()` - Access shared object
- `return_shared(obj)` - Return shared object
- `with_shared!<T>(|obj, _| {})` - Macro for cleaner shared access
- `scenario.ctx()` - Get TxContext

---

## Walrus Integration

### CLI
```bash
# Install via suiup
curl -sSfL https://raw.githubusercontent.com/Mystenlabs/suiup/main/install.sh | sh
suiup install walrus

# Store blob
walrus store file.txt --epochs 2 --context testnet

# Read blob
walrus read <blob-id> --out output.txt --context testnet
```

### TypeScript SDK
```bash
npm install @mysten/walrus @mysten/sui
```

```typescript
import { SuiGrpcClient } from '@mysten/sui/grpc';
import { walrus, WalrusFile } from '@mysten/walrus';

const client = new SuiGrpcClient({
  network: 'testnet',
  baseUrl: 'https://fullnode.testnet.sui.io:443',
}).$extend(walrus());

// Write blob
const file = WalrusFile.from({
  contents: new TextEncoder().encode(JSON.stringify(data)),
  identifier: 'agent_logs.json',
});
const result = await client.walrus.writeFiles({
  files: [file],
  epochs: 3,
  deletable: true,
  signer,
});
```

### Upload Relay (Recommended for Frontend)
```typescript
const client = new SuiGrpcClient({
  network: 'testnet',
  baseUrl: 'https://fullnode.testnet.sui.io:443',
}).$extend(walrus({
  uploadRelay: {
    host: 'https://upload-relay.testnet.walrus.space',
  },
}));
```

---

## Aegis Architecture

### BadgeRegistry (Source of Truth)

```
BadgeRegistry (Shared Object)
├── entries: vector<BadgeEntry>
│   ├── agent_id
│   ├── badge_type (1=Bronze, 2=Silver, 3=Gold)
│   ├── issued_at
│   ├── is_valid ← SOURCE OF TRUTH
│   └── revoked_reason
└── Functions:
    ├── init_registry()
    ├── grant_badge()
    ├── revoke_badge()
    ├── check_and_revoke_invalid()
    └── is_badge_valid_for()
```

### Badge Requirements

| Badge | Type ID | Executions | Success Rate | Volume |
|-------|---------|------------|--------------|--------|
| Bronze | 1 | 10+ | 80%+ | - |
| Silver | 2 | 50+ | 90%+ | - |
| Gold | 3 | 200+ | 95%+ | 1M+ MIST |

### Auto-Revocation Conditions
- Agent gets flagged
- Metrics drop below badge requirements
- Any user can call `check_and_revoke_invalid()`

---

## Setup Quick Reference

```bash
# 1. Install Sui + Walrus
curl -sSfL https://raw.githubusercontent.com/Mystenlabs/suiup/main/install.sh | sh
suiup install sui@testnet
suiup install walrus

# 2. Configure
curl --create-dirs https://docs.wal.app/setup/client_config.yaml -o ~/.config/walrus/client_config.yaml
sui client  # configure testnet

# 3. Fund account
sui client active-address  # copy address
# https://faucet.sui.io/  # get test SUI
walrus get-wal --context testnet  # convert to WAL
```

---

## Move Book Reference

**Essential chapters:**
- [Events](https://move-book.com/programmability/events) - Custom event patterns
- [Test Scenario](https://move-book.com/testing/test-scenario) - Multi-transaction testing
- [Capability Pattern](https://move-book.com/programmability/capability) - Access control
- [One-Time Witness](https://move-book.com/programmability/one-time-witness) - Module initialization
- [2024 Migration](https://move-book.com/before-we-begin/move-2024) - Edition migration

**Full book:** https://move-book.com

---

## References

- Sui Docs: https://docs.sui.io/
- Walrus Docs: https://docs.wal.app/
- Walrus SDK: https://sdk.mystenlabs.com/walrus
- DeepBook: https://docs.deepbook.tech/
- Suiup: https://github.com/MystenLabs/suiup
- Move Book: https://move-book.com
