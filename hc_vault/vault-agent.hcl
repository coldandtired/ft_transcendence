vault {
  address = "http://vault:8200"
}

auto_auth {
  method "token_file" {
    config = { token_file_path = "/vault/token" }
  }
  sink "file" {
    config = { path = "/vault/leased-token" }
  }
}

template {
  source      = "/vault/config/.env.ctmpl"
  destination = "/secrets/app.env"
  perms       = "0444"
  command     = "chmod 0755 /secrets && chown 1001:1001 /secrets/app.env"
}
