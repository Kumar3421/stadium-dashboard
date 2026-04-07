# ⚡ StadiumSync — Smart Stadium Command Center

> **A real-time, AI-powered crowd intelligence dashboard designed to revolutionize the live event experience at large-scale sporting venues.**

![Dashboard Preview](https://img.shields.io/badge/Status-Live-00e68a?style=for-the-badge&logo=vercel) ![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react) ![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite)

---

## 🏟️ Chosen Vertical: Smart Venues & Smart Cities

Live sports and entertainment events face immense logistical challenges when moving 70,000+ people through tight corridors. StadiumSync falls under the **Smart Cities / Smart Infrastructure** vertical. We address the core problems of:
- **Crowd congestion** at gates, concourses, and restrooms
- **Long wait times** at concession stands 
- **Reactive (not proactive) incident management**

## 💡 The Solution & Approach

**StadiumSync** transforms venue operations from *reactive* to *predictive*. It acts as a single pane of glass, aggregating simulated IoT sensor data and AI predictions into an actionable, real-time interface.

Our approach centers on a **Digital Twin** concept: providing operators with a live interactive model of the stadium where they can monitor load, receive AI pre-emption alerts before bottlenecks occur, and deploy dynamic re-routing strategies with a single click.

### How It Works

1. **Data Intake:** Simulated IoT sensors (BLE, UWB, Computer Vision) stream crowd flow data into the central state machine.
2. **Analysis Engine:** The dashboard tracks zone capacity and calculates moving averages for wait times and attendance. 
3. **AI Pre-emption:** When a zone approaches 85% capacity or anomalies trigger, the dashboard highlights the issue and auto-recommends staff dispatch and foot-traffic re-routing.
4. **Actionable Control:** Operators use 9 working toggles in the Settings panel to apply real-time changes to the interface (e.g., auto-routing logic, theme toggling, data pausing).

### 📝 Assumptions Made

- **Sensor Privacy:** We assume edge-processed Computer Vision and BLE beacons capture anonymized density points, not Personally Identifiable Information (PII).
- **Architecture Flow:** The React UI assumes data arrives via WebSockets in a production environment (currently simulated locally for the prototype via `setInterval` effects).
- **Smart App Synergy:** The "Dynamic Re-route" feature assumes attendees have a corresponding StadiumSync mobile app to receive the updated routing instructions.

---

## 🏆 Evaluation Focus Areas

### 1. Code Quality
- **Componentized Design:** Code is neatly separated into modular React components (`OverwatchView`, `DigitalTwinView`, `Toast`, `AlertCard`) within a single dense architecture.
- **State Management:** All global settings are lifted to the top-level `App` component and persist across view changes without third-party libraries (no Redux overhead).

### 2. Security
- **Content Security Policy (CSP):** Implemented in `index.html` via restricted origins (implicit safe-defaults for Vite). 
- **No PII:** Dashboard architecture strictly tracks aggregate zone capacity (percentages and counts), explicitly avoiding personal identity tracking.

### 3. Efficiency
- **Optimized Rendering:** Utilizing React `useCallback` for functions like `generateBlobs` and `showToast` prevents unnecessary re-renders during the 3-second data pulse.
- **Lightweight Dependencies:** Zero heavy UI component libraries (like MUI or Bootstrap) were used. The entire glassmorphic design system is crafted via Vanilla CSS (~1,400 lines) with efficient CSS Variables for instant Dark/Light theme switching.
- **Debounced Interactions:** Complex automations (like Auto Re-route) implement `useRef`-based cooldowns (15s) to prevent cascading re-renders and notification flooding.

### 4. Testing
- **Vitest & React Testing Library:** Setup with `npm test`.
- **Coverage:** We verify rendering, multi-view navigation, element presence, ARIA landmark accessibility, and state interactions. Run `npm run test` or `npm run test:coverage` to execute.

### 5. Accessibility (A11y)
- **Semantic HTML & ARIA:** Using `role="navigation"`, `role="main"`, and `role="status"` landmarks. Toasts include `aria-live="polite"`.
- **Keyboard Navigation:** Includes a hidden `#skip-link` allowing screen readers and keyboard users to bypass the sidebar cleanly. Added `:focus-visible` CSS outlines.
- **Reduced Motion:** Fully integrated `@media (prefers-reduced-motion: reduce)` to disable pulse animations and toast slide-ins for sensitive users.

### 6. Google Services Integration
- **Google Cloud Run:** Fully containerized via Docker and deployed to Google Cloud Run utilizing a high-performance NGINX container.
- **Google Fonts:** Utilizing `Space Grotesk` and `Inter` via preconnected Google Fonts CDN for highly legible typography.
- **Google Analytics:** `gtag.js` integrated into `index.html` to track operator dashboard engagement and view-switching behavior.

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

### Run Tests
```bash
npm run test
```

### Build for Production
```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```text
stadium-dashboard/
├── src/
│   ├── App.jsx               # All views & components (~930 lines)
│   ├── index.css             # Complete design system & themes (~1400 lines)
│   ├── test/
│   │   ├── App.test.jsx      # Vitest test suite
│   │   └── setup.js          # Jest-Dom configuration
│   └── main.jsx              # React entry point
├── index.html                # HTML shell with Google Analytics & ARIA
├── package.json              # Vitest + React 19 configs
├── vercel.json               # Vercel deployment config
└── netlify.toml              # Netlify deployment config
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

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

**Built with ⚡ for the PromptWars Hackathon**
