#!/bin/sh

SWITCH_ID=$1
EDGE_ROUTER=$2

curl -i -X POST "http://localhost:3000/switch/${SWITCH_ID}/to/${EDGE_ROUTER_ID}" \
  --header 'Accept: application/json'

echo ""