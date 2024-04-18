#!/bin/sh

L3SWITCH_ID=$1

DATA="{ \
  \"name\": \"$(shuf -i 1-10 -n 1)\", \
  \"ip\": \"10.0.0.$(shuf -i 1-10 -n 1)\", \
  \"cidr\":$(shuf -i 8-31 -n 1)
}"

curl -i -X POST "http://localhost:3000/network/to/${L3SWITCH_ID}" \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data-raw "${DATA}"

echo ""