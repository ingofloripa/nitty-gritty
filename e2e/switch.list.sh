#!/bin/sh

curl -i -X GET 'http://localhost:3000/switch' \
  --header 'Accept: application/json'

echo ""