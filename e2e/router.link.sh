#!/bin/sh

ROUTER_ID=$1
CORE_ROUTER_ID=$2

curl -i -X POST "http://localhost:3000/router/${ROUTER_ID}/to/${CORE_ROUTER_ID}" \
  --header 'Accept: application/json'

echo ""