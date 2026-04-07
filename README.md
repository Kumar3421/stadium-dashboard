# ⚡ StadiumSync — Smart Stadium Command Center

> **A real-time, AI-powered crowd intelligence dashboard designed to revolutionize the live event experience at large-scale sporting venues.**

![Dashboard Preview](https://img.shields.io/badge/Status-Live-00e68a?style=for-the-badge&logo=vercel) ![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react) ![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite)

---

## 🏟️ The Problem

Large-scale sporting venues struggle with:
- **Crowd congestion** at gates, concourses, and restrooms
- **Long wait times** at concession stands (avg. 15+ minutes during peaks)
- **Reactive (not proactive) incident management**
- **Lack of real-time visibility** across the entire venue
- **Poor coordination** between staff, security, and operations teams

## 💡 The Solution

**StadiumSync** is a Unified Command Center dashboard that transforms venue operations from *reactive* to *predictive*. It acts as a single pane of glass, aggregating IoT sensor data, computer vision metrics, and AI predictions into an actionable, real-time interface.

---

## ✨ Features

### 🎯 5 Interactive Dashboard Views

| View | Description |
|---|---|
| 🏠 **Overwatch** | Main command center with live KPI cards, interactive heatmap, AI alerts, and zone flow monitor |
| 🗺️ **Digital Twin** | Full venue model with sensor status, BLE/UWB/Wi-Fi health, and gate throughput metrics |
| 📊 **Crowd Metrics** | Deep analytics with zone capacity bar charts, flow summaries, and concession hotspot tracking |
| 🚨 **Alerts & Incidents** | Dedicated alert management with dismiss actions, severity breakdown, and activity feed |
| ⚙️ **Settings** | 9 functional toggle controls that dynamically alter dashboard behavior in real-time |

### 🔧 Functional Settings (All Working!)

| Setting | What It Controls |
|---|---|
| 🌑 Dark Mode | Switches entire UI between dark glassmorphic and light theme |
| 🗺️ Heatmap Overlay | Shows/hides crowd density blobs on the stadium map |
| ⏸️ Animate Data | Pauses/resumes live data simulation across all metrics |
| 🔔 Push Notifications | Suppresses or enables toast notification popups |
| 🔊 Alert Sounds | Toggle for audio alerts on critical events |
| ⚠️ Critical Override | Shows critical alerts even when notifications are off |
| 🔄 Auto Re-route | Automatically deploys crowd re-routes when a zone exceeds 85% |
| 🤖 Predictive Alerts | Enables/disables AI-generated pre-emption alerts panel |
| 👥 Staff Auto-dispatch | Auto-deploys standby staff to zones in alert status |

### 🎨 Design & UX

- 🌙 **Premium Dark + Light themes** with full CSS variable system
- ✨ **Glassmorphism** with backdrop blur, subtle borders
- 🎬 **Micro-animations** — fade-in, slide-in, pulse rings
- 📱 **Fully responsive** — sidebar collapses to horizontal nav on mobile
- 🔔 **Toast notifications** with auto-dismiss (2.5s), progress bar, and smooth fade-out
- 📊 **Live data simulation** updating every 3 seconds

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) v18+ installed

### Install & Run

```bash
# Clone the repository
git clone https://github.com/your-username/stadium-dashboard.git
cd stadium-dashboard

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 |
| Bundler | Vite 8 |
| Styling | Vanilla CSS (Glassmorphism + CSS Variables + Animations) |
| Icons | Lucide React |
| Typography | Space Grotesk + Inter (Google Fonts) |
| Deployment | Vercel / Netlify (pre-configured) |

---

## 📁 Project Structure

```
stadium-dashboard/
├── public/
│   └── favicon.svg           # Brand icon
├── src/
│   ├── App.jsx               # All views & components (~930 lines)
│   │   ├── Toast             # Auto-dismissing notification system
│   │   ├── StadiumSVG        # Interactive venue map
│   │   ├── HeatBlob          # Animated density indicators
│   │   ├── StatCard          # Live KPI cards
│   │   ├── AlertCard         # Dismissable alert cards
│   │   ├── Toggle            # Settings switch component
│   │   ├── OverwatchView     # Main dashboard
│   │   ├── DigitalTwinView   # Venue model + sensors
│   │   ├── CrowdMetricsView  # Deep analytics
│   │   ├── AlertsView        # Incident management
│   │   └── SettingsView      # Configuration panel
│   ├── index.css             # Complete design system (~1400 lines)
│   └── main.jsx              # React entry point
├── index.html                # HTML shell with SEO meta
├── vercel.json               # Vercel deployment config
├── netlify.toml              # Netlify deployment config
├── vite.config.js            # Vite configuration
└── package.json
```

---

## 🌐 Deployment

### Vercel (Recommended)
1. Push this repo to GitHub
2. Import the project at [vercel.com/new](https://vercel.com/new)
3. Vercel auto-detects Vite — click **Deploy**

### Netlify
1. Push this repo to GitHub
2. Import at [app.netlify.com](https://app.netlify.com)
3. Netlify reads `netlify.toml` automatically — click **Deploy**

---

## 🧠 System Architecture

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│  IoT Sensors     │────▶│  Edge Servers     │────▶│  AI Prediction   │
│  (CV, BLE, UWB)  │     │  (Video Analytics)│     │  Engine          │
└──────────────────┘     └──────────────────┘     └────────┬─────────┘
                                                           │
                                                           ▼
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│  Attendee App    │◀───▶│  Cloud Backend    │◀────│  Real-time Data  │
│  (React Native)  │     │  (WebSockets)     │     │  Lake            │
└──────────────────┘     └──────────────────┘     └────────┬─────────┘
                                                           │
                                                           ▼
                                                  ┌──────────────────┐
                                                  │  COMMAND CENTER  │
                                                  │  (This Project)  │
                                                  └──────────────────┘
```

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

**Built with ⚡ for the PromptWars Hackathon**
