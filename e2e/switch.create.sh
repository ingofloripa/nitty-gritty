#!/bin/sh

DATA="{ \
  \"ip\": \"$(shuf -i 0-255 -n 1).$(shuf -i 0-255 -n 1).$(shuf -i 0-255 -n 1).$(shuf -i 0-255 -n 1)\", \
  \"description\": \"layer 3 switch mod. $(shuf -i 1-999 -n 1)\", \
  \"latitude\": $(shuf -i 0-360 -n 1), \
  \"longitude\": $(shuf -i 0-360 -n 1), \
  \"numOfPorts\": $(shuf -i 1-3 -n 1) \
}"

curl -i -X POST 'http://localhost:3000/switch' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --data-raw "${DATA}"

echo ""