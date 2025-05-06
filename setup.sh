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

log "Setting up ${APP_NAME} application..."

# Create necessary directories
log "Creating necessary directories..."
mkdir -p ${APP_DIR}/logs
mkdir -p ${APP_DIR}/data/uploads

# Install dependencies for the server
log "Installing server dependencies..."
cd ${APP_DIR}/server
npm ci || error "Failed to install server dependencies"

# Configure Nginx
log "Configuring Nginx..."
if ! command -v nginx &> /dev/null; then
    error "Nginx is not installed. Please install it first."
fi

# Create Nginx configuration
sudo cp ${APP_DIR}/nginx/default.conf /etc/nginx/sites-available/${APP_NAME}
sudo ln -sf /etc/nginx/sites-available/${APP_NAME} /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Set proper permissions
log "Setting proper permissions..."
sudo chown -R deploy:deploy ${APP_DIR}
sudo chmod -R 755 ${APP_DIR}/client/dist
sudo chmod -R 755 ${APP_DIR}/data/uploads

# Test Nginx configuration
log "Testing Nginx configuration..."
sudo nginx -t || error "Nginx configuration test failed"
sudo systemctl reload nginx

# Install PM2 if not already installed
if ! command -v pm2 &> /dev/null; then
    log "Installing PM2..."
    npm install -g pm2 || error "Failed to install PM2"
    pm2 startup | tail -n 1 | bash || warn "Failed to setup PM2 startup script"
fi

# Start the application with PM2
log "Starting application with PM2..."
cd ${APP_DIR}
pm2 start ecosystem.config.js || error "Failed to start application with PM2"
pm2 save || warn "Failed to save PM2 configuration"

log "Setup completed successfully!"
log "Application should now be accessible at http://<your-server-ip>"
