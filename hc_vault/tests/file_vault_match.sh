#!/bin/bash

docker compose exec vault-agent sh -lc '
  VAULT_ADDR=http://vault:8200 VAULT_TOKEN=$(cat /vault/token) \
  vault kv get -field=env secret/app > /tmp/vault_env &&
  diff -u /tmp/vault_env /secrets/app.env
'
