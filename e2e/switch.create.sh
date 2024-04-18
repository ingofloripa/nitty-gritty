#!/bin/sh

DATA="{ \
  \"ip\": \"8.8.8.$(shuf -i 1-30 -n 1)\", \
  \"description\": \"l3 switch mod. $(shuf -i 1-10 -n 1)\", \
  \"latitude\": $(shuf -i 0-360 -n 1), \
  \"longitude\": $(shuf -i 0-360 -n 1), \
  \"numOfPorts\": $(shuf -i 1-3 -n 1) \
}"

echo ${DATA}

curl -i -X POST 'http://localhost:3000/switch' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data-raw "${DATA}"

echo ""