# Gas Fee Calculator

A simple Ethereum gas fee calculator built with HTML, CSS and JavaScript.

## How it works

The user enters:
- Gas Limit (default: 21,000)
- Gas Price (in Gwei)

The calculator updates the estimated transaction fee live.

Formula:

Gas Limit × Gas Price = Fee in Gwei

Fee in ETH = Fee in Gwei ÷ 1,000,000,000

## Run locally

Open `index.html` in a browser.

## Deploy on Netlify

1. Go to Netlify.
2. Choose **Add new project** → **Deploy manually**.
3. Upload this folder, or upload the ZIP contents.
4. Netlify will publish the site.

No backend or API is required.
