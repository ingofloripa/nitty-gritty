#!/bin/sh

ROUTER_ID=$1

curl -i -X GET "http://localhost:3000/router/${ROUTER_ID}" \
  --header 'Accept: application/json'

echo ""