#!/bin/bash
echo "Starting build process..."

# Install server dependencies
echo "Installing server dependencies..."
npm install

# Install client dependencies and build
echo "Installing client dependencies..."
cd client_admin
npm install

echo "Building React app..."
npm run build

echo "Build completed successfully!"
cd ..
