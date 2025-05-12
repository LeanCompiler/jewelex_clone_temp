#!/bin/bash
set -euo pipefail
trap 'error "Script aborted unexpectedly."' ERR

### — CONFIG —###
APP_NAME="lead_data_collection"
APP_DIR="/home/deploy/${APP_NAME}"
DEPLOYMENT_PACKAGE="/home/deploy/deployment_package"

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

# 2) PM2 reload (zero-downtime), fallback to full restart
log "Reloading application via PM2"
cd "${APP_DIR}"
if pm2 reload ecosystem.config.js; then
  log "PM2 reload succeeded"
else
  warn "PM2 reload failed; doing full restart"
  pm2 delete "${APP_NAME}" || true
  pm2 start ecosystem.config.js || error "PM2 start failed"
fi

log "Update completed successfully"
exit 0
