#!/bin/bash

# Walrus Test Script
# Tests Walrus storage using REST API

echo "═══════════════════════════════════════════════════"
echo "   TESTING WALRUS INTEGRATION"
echo "═══════════════════════════════════════════════════"
echo ""

WALRUS_RELAY="https://upload-relay.testnet.walrus.space"

# Test 1: Check Walrus relay health
echo "Test 1: Checking Walrus relay health..."
response=$(curl -s -o /dev/null -w "%{http_code}" "$WALRUS_RELAY/health" 2>/dev/null)
if [ "$response" = "200" ]; then
    echo "  ✅ Walrus relay is healthy"
else
    echo "  ❌ Walrus relay returned: $response"
fi
echo ""

# Test 2: Store a simple blob (test data)
echo "Test 2: Storing test blob..."
TEST_DATA='{"agent_id":"0xtest123","logs":[],"created_at":1234567890,"updated_at":1234567890}'

result=$(curl -s -X POST "$WALRUS_RELAY/v1/store" \
    -H "Content-Type: application/octet-stream" \
    -d "$TEST_DATA" 2>/dev/null)

echo "  Response: $result"

# Extract blob ID if available
BLOB_ID=$(echo "$result" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('blobId',''))" 2>/dev/null)

if [ -n "$BLOB_ID" ]; then
    echo "  ✅ Blob stored successfully!"
    echo "  Blob ID: $BLOB_ID"
    echo ""
    
    # Test 3: Read the blob back
    echo "Test 3: Reading blob back..."
    READ_RESULT=$(curl -s "$WALRUS_RELAY/v1/$BLOB_ID" 2>/dev/null)
    echo "  Content: $READ_RESULT"
    
    # Check if content matches
    if echo "$READ_RESULT" | grep -q "agent_id"; then
        echo "  ✅ Blob retrieved successfully!"
    else
        echo "  ❌ Blob retrieval failed"
    fi
else
    echo "  ❌ Failed to store blob"
fi

echo ""
echo "═══════════════════════════════════════════════════"
echo "   WALRUS TEST COMPLETE"
echo "═══════════════════════════════════════════════════"