#!/bin/bash

# Test script for Problem 5: A Crude Server
# This script starts the server, tests all CRUD endpoints, then stops the server

set -e  # Exit on error

echo "========================================="
echo "Testing Problem 5: A Crude Server"
echo "========================================="
echo ""

cd "$(dirname "$0")/../problem-5"

# Check if node_modules exists, if not install dependencies
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install --silent
fi

# Build the project
echo "🔨 Building project..."
npm run build --silent

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping server..."
    if [ ! -z "$SERVER_PID" ]; then
        kill $SERVER_PID 2>/dev/null || true
        wait $SERVER_PID 2>/dev/null || true
    fi
    # Also kill any remaining node processes for this server
    pkill -f "node.*problem-5.*dist/index.js" 2>/dev/null || true
    echo "✅ Server stopped"
}

# Trap to cleanup on script exit
trap cleanup EXIT

# Start server in background
echo "🚀 Starting server..."
npm start > /dev/null 2>&1 &
SERVER_PID=$!

# Wait for server to start
echo "⏳ Waiting for server to start..."
for i in {1..30}; do
    if curl -s http://localhost:3000/health > /dev/null 2>&1; then
        echo "✅ Server is running"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "❌ Server failed to start"
        exit 1
    fi
    sleep 1
done

echo ""
echo "🧪 Testing API endpoints..."
echo ""

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Helper function to format JSON
format_json() {
    local json=$1
    if [ -z "$json" ]; then
        return
    fi
    if command -v python3 &> /dev/null; then
        formatted=$(echo "$json" | python3 -m json.tool 2>/dev/null)
        if [ $? -eq 0 ] && [ ! -z "$formatted" ]; then
            echo "$formatted"
        else
            echo "$json"
        fi
    elif command -v jq &> /dev/null; then
        formatted=$(echo "$json" | jq . 2>/dev/null)
        if [ $? -eq 0 ] && [ ! -z "$formatted" ]; then
            echo "$formatted"
        else
            echo "$json"
        fi
    else
        echo "$json"
    fi
}

# Helper function to test endpoint with detailed logging
test_endpoint() {
    local name=$1
    local method=$2
    local url=$3
    local data=$4
    local expected_status=$5
    
    if [ -z "$expected_status" ]; then
        expected_status=200
    fi
    
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📋 Test: $name"
    echo "   Method: $method"
    echo "   URL: $url"
    
    if [ ! -z "$data" ]; then
        echo "   Request Body:"
        formatted_data=$(format_json "$data")
        if [ ! -z "$formatted_data" ]; then
            echo "$formatted_data" | sed 's/^/      /'
        else
            echo "      $data"
        fi
    fi
    
    if [ -z "$data" ]; then
        response=$(curl -s -w "\n%{http_code}" -X "$method" "$url" 2>/dev/null)
    else
        response=$(curl -s -w "\n%{http_code}" -X "$method" "$url" -H "Content-Type: application/json" -d "$data" 2>/dev/null)
    fi
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    echo "   Status Code: $http_code"
    if [ ! -z "$body" ]; then
        echo "   Response Body:"
        formatted_body=$(format_json "$body")
        if [ ! -z "$formatted_body" ]; then
            echo "$formatted_body" | sed 's/^/      /'
        else
            echo "      $body"
        fi
    fi
    
    if [ "$http_code" -eq "$expected_status" ]; then
        echo "   Result: ✅ PASSED"
        TESTS_PASSED=$((TESTS_PASSED + 1))
        echo ""
        return 0
    else
        echo "   Result: ❌ FAILED (Expected $expected_status, got $http_code)"
        TESTS_FAILED=$((TESTS_FAILED + 1))
        echo ""
        return 1
    fi
}

# Test 1: Health check
test_endpoint "Health check" "GET" "http://localhost:3000/health"

# Test 2: Create resource
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 Test: Create resource"
echo "   Method: POST"
echo "   URL: http://localhost:3000/api/resources"
CREATE_DATA='{"name": "Test Resource 1", "description": "First test resource"}'
echo "   Request Body:"
formatted_create_data=$(format_json "$CREATE_DATA")
if [ ! -z "$formatted_create_data" ]; then
    echo "$formatted_create_data" | sed 's/^/      /'
else
    echo "      $CREATE_DATA"
fi

CREATE_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST http://localhost:3000/api/resources \
    -H "Content-Type: application/json" \
    -d "$CREATE_DATA" 2>/dev/null)
CREATE_HTTP_CODE=$(echo "$CREATE_RESPONSE" | tail -n1)
CREATE_BODY=$(echo "$CREATE_RESPONSE" | sed '$d')
RESOURCE_ID=$(echo "$CREATE_BODY" | grep -o '"id":[0-9]*' | grep -o '[0-9]*' | head -1)

echo "   Status Code: $CREATE_HTTP_CODE"
if [ ! -z "$CREATE_BODY" ]; then
    echo "   Response Body:"
    formatted_create=$(format_json "$CREATE_BODY")
    if [ ! -z "$formatted_create" ]; then
        echo "$formatted_create" | sed 's/^/      /'
    else
        echo "      $CREATE_BODY"
    fi
fi

if [ "$CREATE_HTTP_CODE" -eq 201 ] && [ ! -z "$RESOURCE_ID" ]; then
    echo "   Result: ✅ PASSED (Resource ID: $RESOURCE_ID)"
    TESTS_PASSED=$((TESTS_PASSED + 1))
else
    echo "   Result: ❌ FAILED"
    TESTS_FAILED=$((TESTS_FAILED + 1))
fi
echo ""

# Test 3: Create another resource
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 Test: Create second resource"
echo "   Method: POST"
echo "   URL: http://localhost:3000/api/resources"
CREATE_DATA2='{"name": "Test Resource 2", "description": "Second test resource"}'
echo "   Request Body:"
formatted_create_data2=$(format_json "$CREATE_DATA2")
if [ ! -z "$formatted_create_data2" ]; then
    echo "$formatted_create_data2" | sed 's/^/      /'
else
    echo "      $CREATE_DATA2"
fi

CREATE_RESPONSE2=$(curl -s -w "\n%{http_code}" -X POST http://localhost:3000/api/resources \
    -H "Content-Type: application/json" \
    -d "$CREATE_DATA2" 2>/dev/null)
CREATE_HTTP_CODE2=$(echo "$CREATE_RESPONSE2" | tail -n1)
CREATE_BODY2=$(echo "$CREATE_RESPONSE2" | sed '$d')
RESOURCE_ID2=$(echo "$CREATE_BODY2" | grep -o '"id":[0-9]*' | grep -o '[0-9]*' | head -1)

echo "   Status Code: $CREATE_HTTP_CODE2"
if [ ! -z "$CREATE_BODY2" ]; then
    echo "   Response Body:"
    formatted_create2=$(format_json "$CREATE_BODY2")
    if [ ! -z "$formatted_create2" ]; then
        echo "$formatted_create2" | sed 's/^/      /'
    else
        echo "      $CREATE_BODY2"
    fi
fi

if [ "$CREATE_HTTP_CODE2" -eq 201 ] && [ ! -z "$RESOURCE_ID2" ]; then
    echo "   Result: ✅ PASSED (Resource ID: $RESOURCE_ID2)"
    TESTS_PASSED=$((TESTS_PASSED + 1))
else
    echo "   Result: ❌ FAILED"
    TESTS_FAILED=$((TESTS_FAILED + 1))
fi
echo ""

# Test 4: List resources
test_endpoint "List resources" "GET" "http://localhost:3000/api/resources"

# Test 5: Get specific resource
test_endpoint "Get resource by ID" "GET" "http://localhost:3000/api/resources/$RESOURCE_ID"

# Test 6: Update resource
UPDATE_DATA='{"name": "Updated Resource", "description": "Updated description"}'
test_endpoint "Update resource" "PUT" "http://localhost:3000/api/resources/$RESOURCE_ID" "$UPDATE_DATA"

# Test 7: Search resources
test_endpoint "Search resources" "GET" "http://localhost:3000/api/resources?search=Updated"

# Test 8: Pagination
test_endpoint "List with pagination" "GET" "http://localhost:3000/api/resources?limit=1&offset=0"

# Test 9: Validation error (empty name)
VALIDATION_DATA='{"name": ""}'
test_endpoint "Validation error (empty name)" "POST" "http://localhost:3000/api/resources" "$VALIDATION_DATA" 400

# Test 10: Not found error
test_endpoint "Not found error" "GET" "http://localhost:3000/api/resources/9999" "" 404

# Test 11: Delete resource
test_endpoint "Delete resource" "DELETE" "http://localhost:3000/api/resources/$RESOURCE_ID2" "" 204

# Test 12: Verify deletion
test_endpoint "Verify deletion" "GET" "http://localhost:3000/api/resources/$RESOURCE_ID2" "" 404

echo ""
echo "========================================="
echo "Test Results:"
echo "  ✅ Passed: $TESTS_PASSED"
echo "  ❌ Failed: $TESTS_FAILED"
echo "========================================="
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo "✅ All Problem 5 tests passed!"
    exit 0
else
    echo "❌ Some tests failed"
    exit 1
fi

