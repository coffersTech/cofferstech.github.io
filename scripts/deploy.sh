#!/bin/bash

# Resolve the directory of the script
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Change to project root
cd "$PROJECT_ROOT" || exit 1

# Load environment variables from .env file
if [ -f .env ]; then
  # Use set -a to automatically export all variables
  set -a
  source .env
  set +a
else
  echo "Error: .env file not found in $PROJECT_ROOT. Please copy .env.example to .env and configure it."
  exit 1
fi

REQUIRED_VARS=("DEPLOY_USER" "DEPLOY_HOST" "DEPLOY_PATH")
for VAR in "${REQUIRED_VARS[@]}"; do
  if [ -z "${!VAR}" ]; then
    echo "Error: $VAR is not set in .env"
    exit 1
  fi
done

# Set default port if not set
DEPLOY_PORT=${DEPLOY_PORT:-22}

echo "Deploying to $DEPLOY_USER@$DEPLOY_HOST:$DEPLOY_PATH on port $DEPLOY_PORT..."

# Build the project
echo "Building project..."
npm run build

if [ $? -ne 0 ]; then
  echo "Build failed. Aborting deployment."
  exit 1
fi

# Deploy using rsync
# Deploy using rsync
echo "Syncing files from out/ directory..."
rsync -avz --delete -e "ssh -p $DEPLOY_PORT" "$@" ./out/ "$DEPLOY_USER@$DEPLOY_HOST:$DEPLOY_PATH"

if [ $? -eq 0 ]; then
  echo "Deployment successful!"
else
  echo "Deployment failed."
  exit 1
fi
