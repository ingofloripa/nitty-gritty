#!/bin/sh

curl -i -X GET 'http://localhost:3000/router' \
  --header 'Accept: application/json'

echo ""