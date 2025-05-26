#!/bin/bash
set -euo pipefail
trap 'echo "[ERROR] SSL install failed" >&2; exit 1' ERR

### --- CONFIG --- ###
APP_NAME="lead_data_collection"
APP_DIR="/home/deploy/${APP_NAME}"
SSL_SOURCE_DIR="/home/deploy/deployment_package/ssl"

# SSL file names (inside SSL_SOURCE_DIR)
CRT_FILE="i.jewelex.biz.crt"
KEY_FILE="i_jewelex_biz_1.key"
BUNDLE_FILE="i.jewelex.biz.ca-bundle"
FULLCHAIN_FILE="i.jewelex.biz.fullchain.crt"

# Target directory for installed certs
SSL_TARGET_DIR="/etc/ssl/i_jewelex_biz_1"

### --- LOGGING --- ###
log()   { echo -e "[\033[0;32mINFO\033[0m] $1"; }
warn()  { echo -e "[\033[1;33mWARN\033[0m] $1"; }
error() { echo -e "[\033[0;31mERROR\033[0m] $1"; exit 1; }

### --- EXECUTION --- ###
log "Installing SSL certificate for ${APP_NAME}"

# Ensure target dir exists
sudo mkdir -p "$SSL_TARGET_DIR"
sudo chmod 700 "$SSL_TARGET_DIR"

# Copy individual cert and key
log "Copying cert, key, and bundle to $SSL_TARGET_DIR"
sudo cp "${SSL_SOURCE_DIR}/${CRT_FILE}" "${SSL_TARGET_DIR}/"
sudo cp "${SSL_SOURCE_DIR}/${KEY_FILE}" "${SSL_TARGET_DIR}/"
sudo cp "${SSL_SOURCE_DIR}/${BUNDLE_FILE}" "${SSL_TARGET_DIR}/"

# Create fullchain cert
log "Creating fullchain certificate"
sudo sh -c "cat '${SSL_TARGET_DIR}/${CRT_FILE}'; echo; cat '${SSL_TARGET_DIR}/${BUNDLE_FILE}'" | sudo tee "${SSL_TARGET_DIR}/${FULLCHAIN_FILE}" > /dev/null

# Set correct permissions
log "Setting permissions"
[ -f "${SSL_TARGET_DIR}/${KEY_FILE}" ] && sudo chmod 600 "${SSL_TARGET_DIR}/${KEY_FILE}"
[ -f "${SSL_TARGET_DIR}/${CRT_FILE}" ] && sudo chmod 644 "${SSL_TARGET_DIR}/${CRT_FILE}"
[ -f "${SSL_TARGET_DIR}/${BUNDLE_FILE}" ] && sudo chmod 644 "${SSL_TARGET_DIR}/${BUNDLE_FILE}"
[ -f "${SSL_TARGET_DIR}/${FULLCHAIN_FILE}" ] && sudo chmod 644 "${SSL_TARGET_DIR}/${FULLCHAIN_FILE}"

# Test and reload nginx
log "Testing NGINX configuration"
sudo nginx -t

log "Reloading NGINX"
sudo systemctl reload nginx

log "SSL installation complete"
