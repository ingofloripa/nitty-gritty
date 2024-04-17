#!/bin/sh

SWITCH_ID=$1

curl -i -X GET "http://localhost:3000/switch/${SWITCH_ID}" \
  --header 'Accept: application/json'

echo ""