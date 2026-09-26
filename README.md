# Chop the Check

Snap the bill, share a table code, and everyone claims their own dishes from their own phone. Totals include each person's share of tax and tip, and friends can pay the host by Revolut.

## Setup

1. Open `index.html` and find the block marked **PASTE YOUR FIREBASE CONFIG HERE**.
2. Replace it with the config from Firebase → Project settings → Your apps → Config.
3. In Firebase → Realtime Database → Rules, publish:

```json
{ "rules": { "rooms": { "$code": { ".read": true, ".write": true } } } }
```

4. Upload every file (including the `icons` folder) to this repo and turn on GitHub Pages (Settings → Pages → Deploy from branch → `main` / root).

## How it works

Each table lives at `rooms/<CODE>` in a Firebase Realtime Database. Every phone at the table listens to that room and updates instantly when anyone claims a dish, changes the tip or marks themselves as paid.

## Installing on a phone

Chop the Check is a Progressive Web App. On Android, open it in Chrome and tap **Install the app**. On iPhone, open it in Safari, tap Share, then **Add to Home Screen**. It then opens full screen with its own icon.

## Files

- `index.html` is the app
- `manifest.webmanifest` gives phones the app's name, colours and icon
- `sw.js` lets it install and open quickly
- `ste-logo.png` is the Spectrum Tech Engine banner
- `icons/` holds the home-screen icons
