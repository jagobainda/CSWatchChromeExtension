# CSWatch Stats Viewer - Chrome Extension

A Chrome extension that displays CSWatch statistics directly on Steam profiles, providing valuable information about CS2 players' performance.

## 🛠️ Installation

### From Chrome Web Store

[Install from Chrome Web Store](https://chromewebstore.google.com/detail/cswatch-stats-viewer/nklafihgaifhoahbfcfiaemfmpoplkch)

### Manual Installation (Developers)

1. Download or clone this repository:

    ```bash
    git clone https://github.com/jagobainda/CSWatchChromeExtension.git
    ```

2. Open Chrome and navigate to `chrome://extensions/`

3. Enable "Developer mode" in the top right corner

4. Click "Load unpacked"

5. Select the downloaded project folder

6. The extension will be ready to use!

## 🚀 Features

-   **Seamless Integration**: Displays CSWatch statistics directly on Steam profiles
-   **Complete Information**: Visualizes key metrics like K/D ratio, reaction time, preaim, aim rating and more
-   **Risk Indicator**: Color-coded system that indicates player risk level
-   **Quick Copy**: Function to copy all statistics to clipboard
-   **Autoflag Detection**: Indicates if a player has been automatically flagged
-   **Direct Link**: Quick access to the complete profile on CSWatch

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

2. The extension will automatically detect the profile and display CSWatch statistics if available

3. Statistics will appear as a new section in the profile with the CSWatch logo

4. Click "Copy stats to clipboard" to copy all statistics

5. Click "CSWATCH.IN" to open the complete profile on CSWatch

## 🔧 Development

### Project Structure

```
CSWatchChromeExtension/
├── manifest.json          # Extension configuration
├── src/
│   ├── popup.html         # Popup interface
│   ├── scripts/
│   │   ├── content.js     # Main content script
│   │   ├── background.js  # Script to get Steam ID
│   │   ├── service-worker.js # Service worker for API calls
│   │   └── popup.js       # Popup logic
│   └── styles/
│       ├── content.css    # Content styles
│       ├── custom-classes.css # Custom classes
│       └── popup.css      # Popup styles
├── imgs/                  # Extension icons
└── build.bat             # Build script
```

### Technologies Used

-   **Manifest V3**: Latest version of Chrome extension system
-   **Vanilla JavaScript**: No external dependencies
-   **CSS3**: Modern styles with Steam integration
-   **Chrome Extension APIs**: For complete browser integration

### CSWatch API

The extension uses CSWatch's public API:

-   Endpoint: `https://cswatch.in/api/players/{steamId}`
-   No authentication required
-   Returns data in JSON format

## 🤝 Contributing

Contributions are welcome. To contribute:

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🔒 Permissions

The extension requires the following permissions:

-   `*://steamcommunity.com/*`: To function on Steam Community
-   `*://cswatch.in/api/*`: To get data from CSWatch API

## ⚖️ License

This project is under the MIT license. See the [LICENSE](LICENSE) file for more details.

## 📞 Support

If you encounter any issues or have suggestions:

-   You can report bugs or suggest improvements to the developer [jagobainda](https://github.com/jagobainda)
-   You can also join the [official CSWatch Discord](https://discord.gg/EDwBUzU95p)

## ⚠️ Disclaimer

This extension is not officially affiliated with Steam or Valve Corporation. It is an independent project created by the community to improve the user experience.

---

**Do you like the extension?** ⭐ Give the repository a star!
