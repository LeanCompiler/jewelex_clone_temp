#!/bin/bash
set -euo pipefail
trap 'error "Script aborted unexpectedly."' ERR

### — CONFIG —###
APP_NAME="lead_data_collection"
APP_DIR="/home/deploy/${APP_NAME}"
DEPLOYMENT_PACKAGE="/home/deploy/deployment_package"
NGINX_CONF="${APP_DIR}/nginx/default.conf"
SSL_DIR="/etc/ssl/upload_jewelex_biz_1"
CERT_PATH="${SSL_DIR}/upload.jewelex.biz.fullchain.crt"
KEY_PATH="${SSL_DIR}/upload_jewelex_biz_1.key"

# ensure persistent dirs exist
mkdir -p "${APP_DIR}/logs" "${APP_DIR}/data/uploads"

# rotate log for this update
LOG_FILE="${APP_DIR}/logs/update-$(date +%F_%T).log"
exec > >(tee -a "${LOG_FILE}") 2>&1

### — OUTPUT/ERROR HELPERS —###
log()   { echo -e "[$(date +'%Y-%m-%d %H:%M:%S')]   \033[0;32m$1\033[0m"; }
warn()  { echo -e "[$(date +'%Y-%m-%d %H:%M:%S')] \033[1;33mWARNING:\033[0m $1"; }
error() { echo -e "[$(date +'%Y-%m-%d %H:%M:%S')]   \033[0;31mERROR:\033[0m $1"; exit 1; }

### — PRE-CHECKS —###
[ -d "${APP_DIR}" ] || error "Application directory ${APP_DIR} does not exist."

log "Starting update for ${APP_NAME}"
log "Syncing new files → ${APP_DIR} (excluding logs & data)"

# rsync the package into place, excluding persistent dirs
rsync -a --delete \
  --exclude='logs' \
  --exclude='data' \
  "${DEPLOYMENT_PACKAGE}/" \
  "${APP_DIR}/"

# enforce permissions so deploy user owns everything
log "Fixing file ownership to deploy:deploy"
sudo chown -R deploy:deploy "${APP_DIR}"

### — DEPLOY STEPS —###

# 1) Server dependencies
if [ -d "${APP_DIR}/server" ]; then
  log "Installing server dependencies"
  cd "${APP_DIR}/server"
  npm ci || error "npm ci failed"
else
  warn "No server folder found at ${APP_DIR}/server"
fi

# 2) PM2 reload
log "Reloading application via PM2"
cd "${APP_DIR}"
if pm2 reload ecosystem.config.js; then
  log "PM2 reload succeeded"
else
  warn "PM2 reload failed; doing full restart"
  pm2 delete "${APP_NAME}" || true
  pm2 start ecosystem.config.js || error "PM2 start failed"
fi

# 3) NGINX update + reload (if config is available)
if [ -f "$NGINX_CONF" ]; then
  log "Deploying updated NGINX config"
  sudo cp "$NGINX_CONF" /etc/nginx/sites-available/${APP_NAME}
  sudo ln -sf /etc/nginx/sites-available/${APP_NAME} /etc/nginx/sites-enabled/
  sudo rm -f /etc/nginx/sites-enabled/default

  # Check if SSL cert and key exist before reload
  if [ -f "$CERT_PATH" ] && [ -f "$KEY_PATH" ]; then
    log "Testing NGINX configuration"
    sudo nginx -t || error "NGINX config test failed"

    log "Reloading NGINX"
    sudo systemctl reload nginx || error "Failed to reload NGINX"
  else
    warn "SSL cert or key not found in ${SSL_DIR}; skipping NGINX reload"
  fi
else
  warn "No NGINX config found at ${NGINX_CONF}; skipping NGINX reload"
fi

log "Update completed successfully"
exit 0
