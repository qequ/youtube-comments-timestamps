# YouTube Comment Time Marker Extension

## Description

This browser extension enhances the YouTube viewing experience by allowing users to easily navigate through a video based on time markers extracted from the video's comments. It adds functionality to jump to specific timestamps mentioned in comments, and provides buttons for quick navigation between these markers.

## How It Works

- **Time Marker Parsing**: When a user clicks on a YouTube comment that contains time markers (e.g., "0:00 Intro, 5:00 Chapter 1, 10:00 Conclusion"), the extension parses these markers and converts them into an array of seconds.
- **Navigation Buttons**: Two buttons, "Previous" and "Next," are added to the bottom left of the YouTube page. These buttons allow the user to navigate backward and forward through the parsed time markers.

## Installation and Loading Locally

To load and use the extension locally in your browser, follow these steps:

- git clone this repository
- Open your browser and navigate to `chrome://extensions/`
- Open your browser and navigate to the extensions page (e.g., chrome://extensions in Google Chrome).
- Enable "Developer mode" (usually a toggle in the top right corner).
- Click on "Load unpacked" and select the folder where your content.js and manifest.json files are located.

## Usage
- Navigate to a YouTube video.
- Click on a comment containing time markers to load them into the extension.
- Use the "Previous" and "Next" buttons to navigate through the video based on these time markers.

## Notes

- The extension is designed for use with YouTube and may not work if YouTube changes its layout or class names.
- The extension currently works best with full page reloads and may need additional logic for single-page application behaviors (like YouTube's dynamic content loading).

## TODO

- [ ] Replace buttons for key shortcuts.
- [ ] handle correctly when reloading page.