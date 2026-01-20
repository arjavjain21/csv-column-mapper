#!/bin/bash

# Script to create a private GitHub repository backup
# Usage: ./create_github_backup.sh [GITHUB_TOKEN] [REPO_NAME]

set -e

GITHUB_USER="arjavjain21"
REPO_NAME="${2:-csv-column-mapper-backup}"
GITHUB_TOKEN="${1:-${GITHUB_TOKEN}}"

if [ -z "$GITHUB_TOKEN" ]; then
    echo "Error: GitHub token is required"
    echo "Usage: $0 <GITHUB_TOKEN> [REPO_NAME]"
    echo "Or set GITHUB_TOKEN environment variable"
    exit 1
fi

echo "Creating private repository: $GITHUB_USER/$REPO_NAME"

# Create the repository using GitHub API
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/user/repos \
  -d "{
    \"name\": \"$REPO_NAME\",
    \"private\": true,
    \"description\": \"Backup of CSV Column Mapper application\",
    \"auto_init\": false
  }")

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | sed '$d')

if [ "$HTTP_CODE" -eq 201 ]; then
    echo "✓ Repository created successfully!"
elif [ "$HTTP_CODE" -eq 422 ]; then
    echo "Repository already exists or name is invalid. Continuing..."
elif [ "$HTTP_CODE" -eq 401 ]; then
    echo "Error: Authentication failed. Please check your token."
    exit 1
else
    echo "Error: Failed to create repository (HTTP $HTTP_CODE)"
    echo "Response: $BODY"
    exit 1
fi

# Add remote (remove existing backup remote if present)
cd "$(dirname "$0")"
if git remote | grep -q "^backup$"; then
    echo "Removing existing backup remote..."
    git remote remove backup
fi

echo "Adding backup remote..."
git remote add backup "https://${GITHUB_TOKEN}@github.com/${GITHUB_USER}/${REPO_NAME}.git"

echo "Pushing to backup repository..."
git push backup main --force || git push backup main

echo "✓ Backup complete!"
echo "Repository URL: https://github.com/${GITHUB_USER}/${REPO_NAME}"

# Clean up: remove token from remote URL for security
git remote set-url backup "https://github.com/${GITHUB_USER}/${REPO_NAME}.git"

echo ""
echo "Note: To push future updates, use: git push backup main"
