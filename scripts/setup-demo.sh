#!/bin/bash

# Aegis Demo Agents Setup Script
# Run with: chmod +x scripts/setup-demo.sh && ./scripts/setup-demo.sh

PACKAGE_ID="0x10914ba0e821ac6581660a323bde632d0a98e614fd1cbe4bbebda2171554489a"
NETWORK="testnet"

echo "═══════════════════════════════════════════════════"
echo "    Aegis - Demo Agents Setup"
echo "═══════════════════════════════════════════════════"
echo ""
echo "Package ID: $PACKAGE_ID"
echo "Network: $NETWORK"
echo ""

# Check if wallet is configured
echo "Checking wallet configuration..."
ADDRESS=$(sui client active-address 2>/dev/null)
if [ -z "$ADDRESS" ]; then
    echo "❌ No active address. Run: sui client"
    exit 1
fi
echo "Active address: $ADDRESS"
echo ""

echo "This script will create 3 demo agents:"
echo "  1. AlphaTrader (High Trust - 100% success)"
echo "  2. BetaBot (Medium Trust - 75% success)"
echo "  3. GammaScam (Flagged - 30% success)"
echo ""
read -p "Continue? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Cancelled."
    exit 0
fi

# Agent 1: AlphaTrader
echo ""
echo "═══════════════════════════════════════════════════"
echo "🤖 Creating AlphaTrader..."
echo "   Strategy: High-frequency scalping with tight spreads"
echo "═══════════════════════════════════════════════════"

echo "📝 Registering AlphaTrader..."
ALPHA_RESULT=$(sui client call \
  --package $PACKAGE_ID \
  --module reputation \
  --function register_agent \
  --gas-budget 20000000 2>&1)

if echo "$ALPHA_RESULT" | grep -q "Transaction Digest"; then
    echo "✅ Registered!"
    ALPHA_DIGEST=$(echo "$ALPHA_RESULT" | grep "Transaction Digest:" | awk '{print $3}')
    echo "   Digest: $ALPHA_DIGEST"
else
    echo "❌ Registration failed"
    echo "$ALPHA_RESULT"
fi

echo ""
echo "⏳ Waiting for transaction to finalize..."
sleep 3

# Get Alpha object ID
ALPHA_OBJ=$(sui client objects --owner all 2>/dev/null | grep -A1 "ReputationObject" | head -1 | awk '{print $2}')
echo "   Object ID: $ALPHA_OBJ"

if [ -n "$ALPHA_OBJ" ]; then
    echo "📝 Recording 5 successful executions..."
    
    for i in {1..5}; do
        RESULT=$(sui client call \
          --package $PACKAGE_ID \
          --module reputation \
          --function record_execution \
          --args $ALPHA_OBJ true 500000000 20 \
          --gas-budget 20000000 2>&1)
        if echo "$RESULT" | grep -q "Transaction Digest"; then
            echo "   ✅ Execution $i recorded"
        fi
        sleep 2
    done
    
    echo "✅ AlphaTrader setup complete!"
fi

# Agent 2: BetaBot
echo ""
echo "═══════════════════════════════════════════════════"
echo "🤖 Creating BetaBot..."
echo "   Strategy: Swing trading with moderate risk"
echo "═══════════════════════════════════════════════════"

echo "📝 Registering BetaBot..."
BETA_RESULT=$(sui client call \
  --package $PACKAGE_ID \
  --module reputation \
  --function register_agent \
  --gas-budget 20000000 2>&1)

if echo "$BETA_RESULT" | grep -q "Transaction Digest"; then
    echo "✅ Registered!"
    BETA_DIGEST=$(echo "$BETA_RESULT" | grep "Transaction Digest:" | awk '{print $3}')
    echo "   Digest: $BETA_DIGEST"
fi

echo ""
echo "⏳ Waiting for transaction to finalize..."
sleep 3

# Get Beta object ID
BETA_OBJ=$(sui client objects --owner all 2>/dev/null | grep -A1 "ReputationObject" | tail -1 | awk '{print $2}')
echo "   Object ID: $BETA_OBJ"

if [ -n "$BETA_OBJ" ]; then
    echo "📝 Recording mixed executions (4 success, 1 failure)..."
    
    # 4 successes
    for i in {1..4}; do
        RESULT=$(sui client call \
          --package $PACKAGE_ID \
          --module reputation \
          --function record_execution \
          --args $BETA_OBJ true 800000000 150 \
          --gas-budget 20000000 2>&1)
        if echo "$RESULT" | grep -q "Transaction Digest"; then
            echo "   ✅ Execution $i success"
        fi
        sleep 2
    done
    
    # 1 failure
    RESULT=$(sui client call \
      --package $PACKAGE_ID \
      --module reputation \
      --function record_execution \
      --args $BETA_OBJ false 0 0 \
      --gas-budget 20000000 2>&1)
    if echo "$RESULT" | grep -q "Transaction Digest"; then
        echo "   ❌ Execution 5 failure"
    fi
    
    echo "✅ BetaBot setup complete!"
fi

# Agent 3: GammaScam
echo ""
echo "═══════════════════════════════════════════════════"
echo "🤖 Creating GammaScam (High Risk Demo)..."
echo "   Strategy: Aggressive with high slippage"
echo "═══════════════════════════════════════════════════"

echo "📝 Registering GammaScam..."
GAMMA_RESULT=$(sui client call \
  --package $PACKAGE_ID \
  --module reputation \
  --function register_agent \
  --gas-budget 20000000 2>&1)

if echo "$GAMMA_RESULT" | grep -q "Transaction Digest"; then
    echo "✅ Registered!"
    GAMMA_DIGEST=$(echo "$GAMMA_RESULT" | grep "Transaction Digest:" | awk '{print $3}')
    echo "   Digest: $GAMMA_DIGEST"
fi

echo ""
echo "⏳ Waiting for transaction to finalize..."
sleep 3

# Get Gamma object ID
GAMMA_OBJ=$(sui client objects --owner all 2>/dev/null | grep -A1 "ReputationObject" | tail -2 | head -1 | awk '{print $2}')
echo "   Object ID: $GAMMA_OBJ"

if [ -n "$GAMMA_OBJ" ]; then
    echo "📝 Recording 3 failed executions with high slippage..."
    
    for i in {1..3}; do
        RESULT=$(sui client call \
          --package $PACKAGE_ID \
          --module reputation \
          --function record_execution \
          --args $GAMMA_OBJ false 0 600 \
          --gas-budget 20000000 2>&1)
        if echo "$RESULT" | grep -q "Transaction Digest"; then
            echo "   ❌ Execution $i failed (high slippage)"
        fi
        sleep 2
    done
    
    echo "✅ GammaScam setup complete (should be FLAGGED)!"
fi

# Final Summary
echo ""
echo "═══════════════════════════════════════════════════"
echo "    Setup Complete!"
echo "═══════════════════════════════════════════════════"
echo ""
echo "Demo Agents Summary:"
echo ""
echo "  🤖 AlphaTrader"
echo "     Object ID: $ALPHA_OBJ"
echo "     Trust Level: ✅ HIGH"
echo "     Expected: 100% success rate"
echo ""
echo "  🤖 BetaBot"
echo "     Object ID: $BETA_OBJ"
echo "     Trust Level: ⚠️ MEDIUM"
echo "     Expected: 80% success rate"
echo ""
echo "  🤖 GammaScam"
echo "     Object ID: $GAMMA_OBJ"
echo "     Trust Level: ❌ FLAGGED"
echo "     Expected: 0% success rate, flagged"
echo ""
echo "View objects at: https://suivision.xyz/"
echo "Or run: sui client objects --owner all"
echo ""
