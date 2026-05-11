# Aegis Security & Fraud Analysis

## ⚠️ CRITICAL VULNERABILITIES FOUND

---

## 1. RATE LIMITING ISSUES

### Problem
`record_execution()` has **no rate limiting**. Anyone can call it unlimited times.

```move
// Current: No rate limit
public entry fun record_execution(
    rep: &mut ReputationObject,
    success: bool,
    volume: u64,
    slippage: u64,
    _ctx: &mut TxContext
) {
    // Can be called every block with no cooldown
}
```

### Attack Vector
```
Attacker creates 100 wallets → 100 ReputationObjects
Each wallet reports 1000 fake "success" executions
Agent appears 100% trusted but never did real work
```

### Fix Needed
```move
// Add rate limiting constants
const MIN_EXECUTION_INTERVAL: u64 = 60; // 60 seconds minimum

// Track last execution time
public struct ReputationObject has key, store {
    ...
    last_execution_time: u64,  // Add this
}

// Check in record_execution
fun check_rate_limit(rep: &ReputationObject, ctx: &TxContext) {
    let current_time = tx_epoch(ctx);
    assert!(current_time >= rep.last_execution_time + MIN_EXECUTION_INTERVAL, E_RATE_LIMITED);
}
```

---

## 2. SELF-REPORTED METRICS (FRAUD)

### Problem
`volume` and `slippage` are **self-reported** with no verification.

```move
// Current: User provides their own values
public entry fun record_execution(
    rep: &mut ReputationObject,
    success: bool,
    volume: u64,      // Self-reported - can lie!
    slippage: u64,    // Self-reported - can lie!
) {
```

### Attack Vector
```
Agent reports: success=true, volume=1000000000, slippage=0
Reality: Failed trade, volume=0, slippage=5000 bps
→ Fake 100% success rate
→ Qualifies for Gold badge ($1M volume requirement)
→ Gets trusted by real users who lose money
```

### Fix Needed
```move
// Option A: Require transaction hash from real execution
public entry fun record_execution_with_proof(
    rep: &mut ReputationObject,
    success: bool,
    volume: u64,
    slippage: u64,
    transaction_hash: vector<u8>,  // Verify against Sui execution
    _ctx: &mut TxContext
) {
    // Verify transaction actually happened
    // Verify transaction involved this agent
}

// Option B: Use price oracle for slippage verification
use oracle::price_feeds;

// Option C: Require signature from verifiable data source
public entry fun record_execution_signed(
    rep: &mut ReputationObject,
    execution_data: ExecutionData,
    signature: vector<u8>,
    verifier: address,
) {
    // Verify signature from approved verifier
}
```

---

## 3. BADGE GRANT WITHOUT VALIDATION

### Problem
`grant_badge()` doesn't validate if agent meets requirements.

```move
// Current: No validation!
public fun grant_badge(
    registry: &mut BadgeRegistry,
    agent_id: address,
    badge_type: u8,
    ctx: &mut TxContext
) {
    // Can grant Gold badge to agent with 0 executions
    // Can grant badge to non-existent agent
}
```

### Attack Vector
```
1. Create agent (0 executions, 0% success rate)
2. Call grant_badge(Gold) → succeeds!
3. Agent appears trusted but is garbage
4. Users trust agent → lose funds
```

### Fix Needed
```move
public fun grant_badge(
    registry: &mut BadgeRegistry,
    agent_id: address,
    badge_type: u8,
    rep: &ReputationObject,  // Need reputation object reference
    ctx: &mut TxContext
) {
    // Validate requirements
    let (executions, successes, volume) = get_metrics(rep);

    if (badge_type == BADGE_GOLD) {
        assert!(executions >= GOLD_MIN_EXECUTIONS, E_NOT_ELIGIBLE);
        assert!(success_rate >= GOLD_MIN_SUCCESS_RATE, E_NOT_ELIGIBLE);
        assert!(volume >= GOLD_MIN_VOLUME, E_NOT_ELIGIBLE);
    };
    // ... similar for other badges
}
```

---

## 4. UNVERIFIED AGENT IN BADGE OPS

### Problem
Badge operations don't verify agent exists or belongs to caller.

```move
// Current: Anyone can grant badges to anyone
public fun grant_badge(
    registry: &mut BadgeRegistry,
    agent_id: address,  // No verification!
    badge_type: u8,
    ctx: &mut TxContext
) {
    // No check that agent_id is valid
    // No check that caller owns agent
}
```

### Fix Needed
```move
public fun grant_badge(
    registry: &mut BadgeRegistry,
    agent_id: address,
    badge_type: u8,
    rep: &ReputationObject,
    ctx: &mut TxContext
) {
    // Verify caller owns the agent
    assert!(rep.agent_id == tx_sender(ctx), E_NOT_AUTHORIZED);

    // Verify agent exists in registry
    assert!(is_registered_agent(agent_id), E_AGENT_NOT_FOUND);
}
```

---

## 5. DOUBLE BADGE VULNERABILITY

### Problem
Can grant multiple badges of same type to same agent.

```move
// Current: No duplicate check
public fun grant_badge(...) {
    // Just pushes new entry without checking existing
    vector::push_back(&mut registry.entries, entry);
}
```

### Attack Vector
```
1. Agent meets Bronze requirements
2. grant_badge(Bronze) → Bronze #1
3. Agent fails, drops below 80%
4. Revoked? Maybe not, depends on check_and_revoke_invalid
5. grant_badge(Bronze) again → Bronze #2!
6. Appears trusted, but actually failed
```

### Fix Needed
```move
public fun grant_badge(
    registry: &mut BadgeRegistry,
    agent_id: address,
    badge_type: u8,
    ctx: &mut TxContext
) {
    // Check no existing valid badge of this type
    assert!(!has_valid_badge(registry, agent_id, badge_type), E_ALREADY_HAS_BADGE);

    // Check no higher badge exists
    assert!(!has_higher_badge(registry, agent_id, badge_type), E_HAS_HIGHER_BADGE);
}
```

---

## 6. NO FLAG RECOVERY MECHANISM

### Problem
Once flagged, always flagged. No recovery path.

```move
// Current: Can only set to true
fun check_and_flag(rep: &mut ReputationObject, slippage: u64) {
    if (success_rate < FLAG_SUCCESS_RATE) {
        rep.is_flagged = true;  // Can only go true
        // ...
    };
    // No way to unflag!
}
```

### Impact
- Honest agent with temporary issues stays flagged forever
- No incentive to recover and improve
- Discourages legitimate agents

### Fix Needed
```move
// Add recovery conditions
fun check_and_unflag(rep: &mut ReputationObject) {
    // Can unflag if:
    // 1. 100 consecutive successes
    // 2. Time passed > recovery_period (e.g., 30 days)
    // 3. Explicit appeal granted by governance

    if (rep.is_flagged) {
        let recent_success_rate = calculate_recent_rate(rep);
        if (recent_success_rate >= 95 && rep.consecutive_failures == 0) {
            rep.is_flagged = false;
            emit(AgentUnflagged { agent_id: rep.agent_id });
        }
    }
}
```

---

## 7. NO SIGNATURE VERIFICATION

### Problem
Execution data has no cryptographic proof of origin.

```move
// Current: No signatures
public entry fun record_execution(
    rep: &mut ReputationObject,
    success: bool,
    volume: u64,
    slippage: u64,
    _ctx: &mut TxContext  // Only verifies transaction signer
) {
    // Transaction signer != Agent that performed execution
}
```

### Attack Vector
```
1. Agent signs transaction to call record_execution
2. But the execution data could be from ANY source
3. Attacker could front-run agent's legitimate reports
4. Mix good and bad reports to manipulate score
```

### Fix Needed
```move
// Require signed execution data
public struct ExecutionData has store, drop {
    actual_volume: u64,
    actual_slippage: u64,
    block_height: u64,
    transaction_hash: vector<u8>,
}

public entry fun record_execution_verified(
    rep: &mut ReputationObject,
    data: ExecutionData,
    agent_signature: vector<u8>,
    _ctx: &mut TxContext
) {
    // Verify signature from known agent address
    assert!(verify_signature(data, agent_signature, rep.agent_id), E_INVALID_SIGNATURE);

    // Verify transaction hash exists on-chain
    assert!(verify_transaction(data.transaction_hash), E_TX_NOT_FOUND);

    // Verify timing
    assert!(data.block_height <= ctx_epoch(_ctx), E_FUTURE_TX);
}
```

---

## 8. REPLAY ATTACK VULNERABILITY

### Problem
Execution records could be replayed.

```move
// Current: No replay protection
public entry fun record_execution(
    rep: &mut ReputationObject,
    success: bool,
    volume: u64,
    slippage: u64,
    _ctx: &mut TxContext
) {
    // No nonce or sequence number
}
```

### Fix Needed
```move
public struct ReputationObject has key, store {
    ...
    execution_nonce: u64,
}

// In record_execution
assert!(nonce == rep.execution_nonce, E_REPLAY_DETECTED);
rep.execution_nonce = rep.execution_nonce + 1;
```

---

## 9. SHARED OBJECT RACE CONDITIONS

### Problem
BadgeRegistry is shared - multiple transactions can conflict.

```move
public struct BadgeRegistry has key {
    entries: vector<BadgeEntry>,  // Linear search O(n)
}
```

### Impact
- If two transactions modify badge at same time, one fails
- No idempotency for operations
- Large registry becomes slow (linear search)

### Fix Needed
```move
// Use Table instead of vector for O(1) lookups
use sui::table::Table;

public struct BadgeRegistry has key {
    id: UID,
    badges: Table<vector<u8>, BadgeEntry>,  // key = agent_id + badge_type
}
```

---

## 10. MISSING ACCESS CONTROL

### Problem
No authorization layer for privileged operations.

| Function | Who Should Call | Current |
|----------|-----------------|---------|
| `grant_badge` | Agent owner or oracle | Anyone |
| `revoke_badge` | Admin or system | Anyone |
| `check_and_revoke_invalid` | Anyone | Anyone (OK) |
| `update_walrus_blob_id` | Agent owner | Anyone |

### Fix Needed
```move
// Add admin capability
public struct AegisAdminCap has key, store {
    id: UID,
}

public entry fun revoke_badge_admin(
    registry: &mut BadgeRegistry,
    agent_id: address,
    badge_type: u8,
    reason: vector<u8>,
    cap: &AegisAdminCap,  // Require admin cap
) {
    revoke_entry(registry, agent_id, badge_type, reason);
}
```

---

## SUMMARY: Security Score

| Issue | Severity | Status |
|-------|----------|--------|
| No Rate Limiting | 🔴 CRITICAL | ❌ |
| Self-Reported Metrics | 🔴 CRITICAL | ❌ |
| Badge Without Validation | 🔴 CRITICAL | ❌ |
| Unverified Agent | 🟠 HIGH | ❌ |
| Double Badge | 🟠 HIGH | ❌ |
| No Flag Recovery | 🟠 HIGH | ❌ |
| No Signature Verification | 🔴 CRITICAL | ❌ |
| Replay Attack | 🟡 MEDIUM | ❌ |
| Race Conditions | 🟡 MEDIUM | ❌ |
| Missing Access Control | 🟠 HIGH | ❌ |

---

## RECOMMENDED FIXES (Priority Order)

1. **Rate Limiting** - Prevent spam executions
2. **Signature Verification** - Prove execution authenticity
3. **Badge Validation** - Enforce requirements on-chain
4. **Access Control** - Restrict privileged operations
5. **Replay Protection** - Nonce-based prevention
6. **Flag Recovery** - Allow honest agents to recover
7. **Oracle Integration** - Verify metrics externally

---

## Quick Win: Add Rate Limiting

```move
// In reputation.move
const MIN_BLOCKS_BETWEEN_EXECUTIONS: u64 = 1;  // 1 block minimum

public entry fun record_execution(
    rep: &mut ReputationObject,
    success: bool,
    volume: u64,
    slippage: u64,
    ctx: &mut TxContext
) {
    // Add rate limit check
    let current_epoch = tx_epoch(ctx);
    assert!(
        current_epoch > rep.last_update + MIN_BLOCKS_BETWEEN_EXECUTIONS,
        E_RATE_LIMITED
    );

    // ... rest of function
}
```

---

*Document created: 2026-05-10*
*Status: Requires immediate fixes before production*