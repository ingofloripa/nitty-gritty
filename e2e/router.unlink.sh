#!/bin/sh

ROUTER_ID=$1
CORE_ROUTER_ID=$2

curl -i -X DELETE "http://localhost:3000/router/${ROUTER_ID}/from/${CORE_ROUTER_ID}" \
  --header 'Accept: application/json'

echo ""