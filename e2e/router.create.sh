#!/bin/sh

TYPE=$1 # core | edge
COUNTRY=$2 # AU | BR | JP | DE | NG | US

DATA="{ \
  \"type\": \"${TYPE}\", \
  \"ip\": \"8.8.8.$(shuf -i 1-30 -n 1)\", \
  \"description\": \"${TYPE} router mod. $(shuf -i 1-10 -n 1)\", \
  \"latitude\": $(shuf -i 0-360 -n 1), \
  \"longitude\": $(shuf -i 0-360 -n 1), \
  \"country\": \"${COUNTRY}\", \
  \"numOfPorts\": $(shuf -i 1-3 -n 1) \
}"

echo $DATA

curl -i -X POST 'http://localhost:3000/router' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data-raw "${DATA}"

echo ""