#!/bin/bash

PACKAGE_ID="0x6472bb19be1908b8c948169c5627e625e54419b10138519e1caf5be4502d9e7d"
BADGE_REGISTRY="0xd7f704c15109a42a56b74e962745831af33fb05cece15103b928bc7d9bd4adb3"

echo "═══════════════════════════════════════════════════"
echo "    AEGIS - Demo Agents Setup"
echo "═══════════════════════════════════════════════════"
echo ""
echo "Package ID: $PACKAGE_ID"
echo "BadgeRegistry: $BADGE_REGISTRY"
echo ""
echo "Creating 3 demo agents..."
echo ""

get_object_id() {
    echo "$1" | grep -A1 "aegis::reputation::ReputationObject" | head -1 | awk '{print $2}'
}

echo "═══════════════════════════════════════════════════"
echo "🤖 Creating AlphaTrader (100% success)"
echo "═══════════════════════════════════════════════════"

ALPHA_RESULT=$(sui client call --package $PACKAGE_ID --module reputation --function register_agent --gas-budget 20000000 2>&1)
ALPHA_OBJ=$(get_object_id "$ALPHA_RESULT")
echo "✅ Registered: $ALPHA_OBJ"

sleep 3
echo "Recording 5 successful executions..."
for i in 1 2 3 4 5; do
    sui client call --package $PACKAGE_ID --module reputation --function record_execution --args $ALPHA_OBJ true 500000000 20 --gas-budget 20000000 2>&1 | grep -q "Success" && echo "  ✅ $i"
    sleep 2
done

echo "Granting Gold Badge (type 3)..."
sui client call --package $PACKAGE_ID --module badge_registry --function grant_badge --args $BADGE_REGISTRY 0x8c8598aba05e5c2998a17c4d726c209221d021a71cc77a3f5809bc0009edf6c1 3 --gas-budget 20000000 2>&1 | grep -q "Success" && echo "  🥇 Gold Badge granted!"
echo ""

echo "═══════════════════════════════════════════════════"
echo "🤖 Creating BetaBot (80% success)"
echo "═══════════════════════════════════════════════════"

BETA_RESULT=$(sui client call --package $PACKAGE_ID --module reputation --function register_agent --gas-budget 20000000 2>&1)
BETA_OBJ=$(get_object_id "$BETA_RESULT")
echo "✅ Registered: $BETA_OBJ"

sleep 3
echo "Recording 4 successful executions..."
for i in 1 2 3 4; do
    sui client call --package $PACKAGE_ID --module reputation --function record_execution --args $BETA_OBJ true 800000000 150 --gas-budget 20000000 2>&1 | grep -q "Success" && echo "  ✅ $i"
    sleep 2
done

echo "Recording 1 failure..."
sui client call --package $PACKAGE_ID --module reputation --function record_execution --args $BETA_OBJ false 0 0 --gas-budget 20000000 2>&1 | grep -q "Success" && echo "  ❌ 5"

echo "Granting Silver Badge (type 2)..."
sui client call --package $PACKAGE_ID --module badge_registry --function grant_badge --args $BADGE_REGISTRY 0x8c8598aba05e5c2998a17c4d726c209221d021a71cc77a3f5809bc0009edf6c1 2 --gas-budget 20000000 2>&1 | grep -q "Success" && echo "  🥈 Silver Badge granted!"
echo ""

echo "═══════════════════════════════════════════════════"
echo "🤖 Creating GammaScam (FLAGGED - auto-revoke demo)"
echo "═══════════════════════════════════════════════════"

GAMMA_RESULT=$(sui client call --package $PACKAGE_ID --module reputation --function register_agent --gas-budget 20000000 2>&1)
GAMMA_OBJ=$(get_object_id "$GAMMA_RESULT")
echo "✅ Registered: $GAMMA_OBJ"

sleep 3
echo "Recording 3 failed executions with high slippage..."
for i in 1 2 3; do
    sui client call --package $PACKAGE_ID --module reputation --function record_execution --args $GAMMA_OBJ false 0 600 --gas-budget 20000000 2>&1 | grep -q "Success" && echo "  ❌ $i (high slippage)"
    sleep 2
done

echo "Auto-revocation triggers when check_and_revoke_invalid() is called."
echo ""

echo "═══════════════════════════════════════════════════"
echo "    Setup Complete!"
echo "═══════════════════════════════════════════════════"
echo ""
echo "🤖 AlphaTrader"
echo "   Object: $ALPHA_OBJ | Trust: ✅ HIGH | Badge: GOLD"
echo ""
echo "🤖 BetaBot"
echo "   Object: $BETA_OBJ | Trust: ⚠️ MEDIUM | Badge: SILVER"
echo ""
echo "🤖 GammaScam"
echo "   Object: $GAMMA_OBJ | Trust: ❌ FLAGGED | Badge: AUTO-REVOKED"
echo ""
echo "View BadgeRegistry:"
echo "https://suivision.xyz/object/$BADGE_REGISTRY"
echo ""