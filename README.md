# Google Clone Project

This project is a pixel-perfect clone of Google's image search interface for the web, built with React.js and Capacitor.js. It replicates core features and functionality of the Google app, including text search, image search, and Google Lens capabilities.

## Features

### Google App Homepage
- Sign-in functionality
- Mobile-optimized interface
- Search bar with icons and interactive elements
- Real-time feed display

### Text Search
- Fully functional search bar with voice input support
- Microphone integration for voice-to-text functionality

### Google Lens Search and Results Page
- Camera access for real-time image search
- Image upload from gallery
- Detailed search results with visual information

## Tech Stack

- **Frontend Framework:** React.js
- **Mobile Integration:** Capacitor.js
- **Styling:** CSS Modules
- **Configuration:** package.json
- **Version Control:** Git

## Project Structure

```
google-clone/
├── dist/                    # Build output
├── node_modules/            # Dependencies
├── public/                  # Static assets
├── src/
│   ├── assets/              # Images, icons, etc.
│   ├── components/
│   │   ├── common-components/
│   │   │   ├── GoogleFeed.jsx
│   │   │   ├── GoogleFeed.module.css
│   │   │   ├── HeaderBar.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── SearchBar.module.css
│   │   │   ├── SignIn.jsx
│   │   │   ├── SignIn.module.css
│   │   │   ├── GoogleLens.jsx
│   │   │   └── GoogleLens.module.css
│   │   ├── Home.jsx
│   │   ├── Home.css
│   │   ├── SerchResult.jsx
│   │   └── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── .env                     # Environment variables
├── .gitignore
├── capacitor.config.json    # Capacitor configuration
├── eslint.config.js         # ESLint configuration
├── index.html               # Entry HTML file
├── package-lock.json        # Dependency lock file
├── package.json             # Project metadata and dependencies
└── README.md                # Project documentation
```

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/anujarathi29/shoppinAssignment-web-ui.git
   cd google-clone
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. To build for production:
   ```bash
   npm run build
   ```

## Capacitor Setup

1. Install Capacitor:
   ```bash
   npm install @capacitor/core @capacitor/cli
   ```

2. Initialize Capacitor:
   ```bash
   npx cap init
   ```


## Camera and Microphone Integration

This project uses Capacitor.js for native device features like camera and microphone access. To implement these features:

1. Install the required plugins:
   ```bash
   npm install @capacitor/camera @capacitor/microphone
   ```

2. Sync your project:
   ```bash
   npx cap sync
   ```

## Troubleshooting Resources

If you encounter issues with Capacitor.js, especially regarding camera and microphone usage, refer to these helpful resources:

- [Capacitor Camera Plugin Documentation](https://capacitorjs.com/docs/apis/camera)
- [Capacitor Camera Preview](https://github.com/capacitor-community/camera-preview)
- [Capacitor Plugin Guide](https://capacitorjs.com/docs/plugins)
- [Capacitor Community Plugins](https://github.com/capacitor-community)
- [Capacitor Documentation Hub](https://capacitorjs.com/docs)
- [Image Processing with JavaScript](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Pixel_manipulation_with_canvas)


