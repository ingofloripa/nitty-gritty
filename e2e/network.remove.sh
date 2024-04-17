#!/bin/sh

NETWORK_NAME=$1
L3SWITCH_ID=$2

curl -i -X DELETE "http://localhost:3000/network/${NETWORK_NAME}/from/${L3SWITCH_ID}" \
  --header 'Accept: application/json'

echo ""