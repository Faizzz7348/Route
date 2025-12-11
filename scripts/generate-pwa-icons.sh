#!/bin/bash

# PWA Icon Generator Script
# This script creates PWA icons from the FamilyMart logo

echo "🎨 Generating PWA icons..."

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "⚠️  ImageMagick is not installed. Installing..."
    sudo apt-get update && sudo apt-get install -y imagemagick
fi

# Source image
SOURCE_IMG="/workspaces/Pfresh/client/public/assets/FamilyMart.png"
ASSETS_DIR="/workspaces/Pfresh/client/public/assets"

# Icon sizes needed for PWA
SIZES=(72 96 128 144 152 192 384 512)

# Generate icons
for size in "${SIZES[@]}"; do
    OUTPUT="${ASSETS_DIR}/icon-${size}x${size}.png"
    echo "  Creating ${size}x${size} icon..."
    convert "$SOURCE_IMG" -resize "${size}x${size}" -background white -gravity center -extent "${size}x${size}" "$OUTPUT"
done

echo "✅ PWA icons generated successfully!"
echo ""
echo "📱 Icons created:"
for size in "${SIZES[@]}"; do
    echo "  - icon-${size}x${size}.png"
done
