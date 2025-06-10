# Image Copy & Paste Extension for Canva

This Chrome extension enhances the image handling capabilities on Canva.com by providing seamless copy and paste functionality.

## Features

- **Image Copy**: Automatically copies images when clicked or dragged
- **Smart Paste**: Simulates Ctrl+V to paste copied images
- **Undo Support**: Includes Ctrl+Z simulation for undo operations
- **Cross-Origin Support**: Handles images from different domains securely

## How It Works

### Background Script (background.js)
- Monitors web requests to Canva.com
- Intercepts POST requests and logs request data
- Communicates with content script for request information

### Content Script (content.js)
- Main functionality implementation
- Handles user interactions:
  - Click events on images
  - Drag and drop operations
- Provides image processing:
  - Finds draggable parent elements
  - Extracts image URLs
  - Manages clipboard operations
- Implements keyboard event simulation (Ctrl+V, Ctrl+Z)

### Manifest (manifest.json)
- Defines extension permissions:
  - webRequest
  - tabs
  - activeTab
- Specifies host permissions for Canva.com
- Configures content script injection

### Temporary Script (temp.js)
- Contains utility function for image copying
- Handles blob conversion and clipboard operations

## Usage

1. Install the extension
2. Navigate to Canva.com
3. Click or drag images to automatically copy them
4. Images will be automatically pasted in the editor
5. Use Ctrl+Z to undo if needed

## Security

- Implements CORS handling for cross-origin images
- Validates image URLs and data
- Secure clipboard operations

## Technical Details

- Uses modern JavaScript features (async/await)
- Implements event delegation
- Handles various image formats (PNG, JPEG)
- Provides detailed console logging for debugging

