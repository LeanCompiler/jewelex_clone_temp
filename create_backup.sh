#!/bin/bash
set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to display status messages
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
    exit 1
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

APP_NAME="lead_data_collection"
APP_DIR="/home/deploy/${APP_NAME}"
BACKUP_DIR="${APP_DIR}/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/backup_${TIMESTAMP}.tar.gz"

log "Creating backup of ${APP_NAME} application..."

# Create backup directory if it doesn't exist
mkdir -p ${BACKUP_DIR}

# Create backup archive
log "Creating backup archive..."
tar -czf ${BACKUP_FILE} \
    --exclude="${APP_DIR}/server/node_modules" \
    --exclude="${APP_DIR}/backups" \
    -C /home/deploy ${APP_NAME}

log "Backup created at ${BACKUP_FILE}"
