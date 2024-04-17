#!/bin/sh

SWITCH_ID=$1
EDGE_ROUTER_ID=$2

curl -i -X DELETE "http://localhost:3000/switch/${SWITCH_ID}/from/${EDGE_ROUTER_ID}" \
  --header 'Accept: application/json'

echo ""