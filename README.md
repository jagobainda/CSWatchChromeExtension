# Counter-Strike Stats Viewer - Chrome Extension

A Chrome extension that displays Counter-Strike statistics directly on Steam profiles, providing valuable information about players' performance from multiple sources.

## 🛠️ Installation

### From Chrome Web Store

[Install from Chrome Web Store](https://chromewebstore.google.com/detail/cswatch-stats-viewer/nklafihgaifhoahbfcfiaemfmpoplkch)

### Manual Installation (Developers)

1. Download or clone this repository:

    ```bash
    git clone https://github.com/jagobainda/CounterStrikeChromeExtension.git
    ```

2. Open Chrome and navigate to `chrome://extensions/`

3. Enable "Developer mode" in the top right corner

4. Click "Load unpacked"

5. Select the downloaded project folder

6. The extension will be ready to use!

## 🚀 Features

-   **Seamless Integration**: Displays CSRep statistics directly on Steam profiles
-   **Complete Information**: Visualizes key metrics like K/D ratio, reaction time, preaim, aim rating and more
-   **Risk Indicator**: Color-coded system that indicates player risk level
-   **Quick Copy**: Function to copy all statistics to clipboard
-   **Autoflag Detection**: Indicates if a player has been automatically flagged
-   **Direct Link**: Quick access to the complete profile on CSRep

## 📊 Displayed Metrics

The extension shows the following statistics:

-   **K/D Ratio**
-   **Time to Damage**
-   **Preaim Degree**
-   **Aim Rating**
-   **Win Rate**
-   **Risk Rate**

Each metric includes a color code that indicates:

-   🟢 Green: Normal performance/low risk
-   🟡 Yellow: Suspicious performance/medium risk
-   🟠 Orange: Very suspicious performance/high risk
-   🔴 Red: Extremely suspicious performance/very high risk

## 🎮 Usage

1. Navigate to any Steam profile (`steamcommunity.com/id/*` or `steamcommunity.com/profiles/*`)

2. The extension will automatically detect the profile and display Counter-Strike statistics if available

## 🔧 Development

### Project Structure

```
CSWatchChromeExtension/
├── manifest.json               # Extension configuration (Manifest V3)
├── src/
│   ├── popup.html              # Popup interface
│   └── scripts/
│       ├── steam-context.js    # Injects Steam ID into the page
│       ├── content.js          # Main content script (orchestrates all loaders)
│       ├── service-worker.js   # Handles external API/fetch requests
│       ├── sections/
│       │   ├── account-section.js   # Account section UI builder
│       │   ├── csrep-section.js     # CSRep section UI builder
│       │   ├── csstats-section.js   # CSStats section UI builder
│       │   └── faceit-section.js    # Faceit section UI builder
│       ├── parsers/
│       │   ├── csrep-parser.js      # CSRep response parser
│       │   └── csstats-parser.js    # CSStats HTML parser
│       ├── info-display/
│       │   ├── account-display.js   # Renders account info
│       │   ├── csrep-display.js     # Renders CSRep stats
│       │   ├── csstats-display.js   # Renders CSStats stats
│       │   └── faceit-display.js    # Renders Faceit stats
│       └── utils/
│           ├── clipboard-handler.js        # Copy-to-clipboard logic
│           ├── conditional-items-handler.js # Show/hide conditional UI elements
│           └── error-handler.js            # Error display helpers
│   └── styles/
│       ├── content.css         # Content script styles
│       ├── custom-classes.css  # Utility/custom classes
│       └── popup.css           # Popup styles
├── imgs/                       # Extension icons and rank images
│   ├── csgo/                   # CS:GO rank images
│   ├── faceit/                 # Faceit level SVGs
│   ├── premiere/               # CS2 Premier rank backgrounds
│   ├── logos/                  # Source logos (CSRep, CSStats, Faceit)
│   └── icons/                  # CS2 / CS:GO game icons
└── build.bat                   # Build script
```

### Technologies Used

-   **Manifest V3**: Latest version of the Chrome extension system
-   **Vanilla JavaScript**: No external dependencies
-   **CSS3**: Modern styles with Steam integration
-   **Chrome Extension APIs**: For complete browser integration

## 🤝 Contributing

Contributions are welcome. To contribute:

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🔒 Permissions

The extension requires the following permissions:

-   `*://steamcommunity.com/*`: To function on Steam Community pages
-   `*://shapi.jagoba.dev/*`: Proxy API for CSRep and Faceit data
-   `*://csstats.gg/*`: To scrape data from CSStats.gg

## ⚖️ License

This project is under the MIT license. See the [LICENSE](LICENSE) file for more details.

## 📞 Support

If you encounter any issues or have suggestions:

-   Report bugs or suggest improvements via [GitHub Issues](https://github.com/jagobainda/CSWatchChromeExtension/issues)
-   Contact the developer: [jagobainda](https://github.com/jagobainda)

## ⚠️ Disclaimer

This extension is not officially affiliated with Steam, Valve Corporation, Faceit, CSRep or CSStats.gg. It is an independent community project created to improve the user experience.

---

**Do you like the extension?** ⭐ Give the repository a star!
