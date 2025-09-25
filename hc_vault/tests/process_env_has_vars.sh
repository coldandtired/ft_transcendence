#!/bin/bash

# inspect PID 1 (node process)
docker compose exec app sh -lc '
  tr "\0" "\n" </proc/1/environ | egrep "^(JWT_SECRET|SECRET_KEY)=" || { echo "Missing expected env in PID 1"; exit 1; }
'

