#!/bin/sh

ROUTER_ID=$1

curl -i -X DELETE "http://localhost:3000/ROUTER_ID/${ROUTER_ID}" \
  --header 'Accept: application/json'

echo ""