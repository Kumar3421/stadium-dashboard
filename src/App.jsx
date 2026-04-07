import { useState, useEffect, useCallback, useRef } from 'react';
import {
  LayoutDashboard,
  Map as MapIcon,
  Users,
  Settings,
  AlertTriangle,
  Activity,
  Zap,
  Timer,
  ShieldAlert,
  TrendingDown,
  TrendingUp,
  Radio,
  Wifi,
  Bell,
  CheckCircle,
  X,
  BarChart3,
  ArrowUpRight,
  Clock,
  MapPin,
  Shield,
  Eye,
  Volume2,
  Moon,
  Globe,
} from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  SIMULATED DATA                                                      */
/* ------------------------------------------------------------------ */

const INITIAL_ALERTS = [
  {
    id: 1,
    type: 'critical',
    title: 'Gate C Congestion',
    body: 'Density at Gate C exceeding 85% capacity. AI recommends opening auxiliary corridor C-2.',
    time: '12s ago',
  },
  {
    id: 2,
    type: 'warning',
    title: 'Concession Surge — Sec 112',
    body: 'Predicted 40% demand spike following recent touchdown. Float-staff dispatched.',
    time: '1m ago',
  },
  {
    id: 3,
    type: 'info',
    title: 'Restroom Availability',
    body: 'Level 2 North restrooms cleared. Average queue dropped to 2 min.',
    time: '3m ago',
  },
  {
    id: 4,
    type: 'warning',
    title: 'Corridor B Flow',
    body: 'Flow rate at 78% of safe threshold. Monitoring for next 5 minutes.',
    time: '5m ago',
  },
];

const ZONE_DATA_INIT = [
  { name: 'Gate A', capacity: 42, status: 'normal' },
  { name: 'Gate B', capacity: 67, status: 'caution' },
  { name: 'Gate C', capacity: 91, status: 'alert' },
  { name: 'Gate D', capacity: 35, status: 'normal' },
  { name: 'Concourse N', capacity: 58, status: 'normal' },
  { name: 'Concourse S', capacity: 73, status: 'caution' },
];

/* ------------------------------------------------------------------ */
/*  HELPER                                                              */
/* ------------------------------------------------------------------ */
function rand(min, max) {
  return Math.random() * (max - min) + min;
}

/* ------------------------------------------------------------------ */
/*  TOAST NOTIFICATION                                                  */
/* ------------------------------------------------------------------ */
const TOAST_DURATION = 2500;
const TOAST_FADE = 400;

function Toast({ message, type, onClose }) {
  const [fading, setFading] = useState(false);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFading(true), TOAST_DURATION - TOAST_FADE);
    const removeTimer = setTimeout(() => onCloseRef.current(), TOAST_DURATION);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []); // empty deps — runs once on mount

  const iconMap = {
    success: <CheckCircle size={18} />,
    warning: <AlertTriangle size={18} />,
    info: <Zap size={18} />,
  };

  return (
    <div className={`toast toast--${type} ${fading ? 'toast--fading' : ''}`}>
      <div className="toast__icon">{iconMap[type]}</div>
      <span className="toast__message">{message}</span>
      <button className="toast__close" onClick={onClose}><X size={14} /></button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  STADIUM SVG                                                         */
/* ------------------------------------------------------------------ */
function StadiumSVG() {
  return (
    <svg viewBox="0 0 600 400" className="stadium-svg" aria-hidden="true">
      <ellipse cx="300" cy="200" rx="270" ry="170" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="2" />
      <ellipse cx="300" cy="200" rx="210" ry="130" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" strokeDasharray="6 4" />
      <rect x="195" y="135" width="210" height="130" rx="8" fill="rgba(0,230,138,0.06)" stroke="rgba(0,230,138,0.15)" strokeWidth="1" />
      <line x1="300" y1="135" x2="300" y2="265" stroke="rgba(0,230,138,0.12)" strokeWidth="1" />
      <circle cx="300" cy="200" r="22" fill="none" stroke="rgba(0,230,138,0.12)" strokeWidth="1" />
      <g fontFamily="Space Grotesk, sans-serif" fontSize="10" fill="rgba(255,255,255,0.25)" fontWeight="600" textAnchor="middle">
        <text x="300" y="22">GATE A</text>
        <text x="580" y="205">GATE B</text>
        <text x="300" y="393">GATE C</text>
        <text x="20" y="205">GATE D</text>
      </g>
      <g fontFamily="Space Grotesk, sans-serif" fontSize="8" fill="rgba(255,255,255,0.15)" letterSpacing="0.1em">
        <text x="180" y="70">SEC 101-108</text>
        <text x="390" y="70">SEC 109-116</text>
        <text x="390" y="345">SEC 117-124</text>
        <text x="165" y="345">SEC 125-132</text>
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  HEATBLOB                                                            */
/* ------------------------------------------------------------------ */
function HeatBlob({ x, y, size, level }) {
  const cls = level === 'high' ? 'heatblob--high' : level === 'mid' ? 'heatblob--mid' : 'heatblob--low';
  return (
    <div
      className={`heatblob ${cls}`}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        transform: 'translate(-50%, -50%)',
      }}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  STAT CARD                                                           */
/* ------------------------------------------------------------------ */
function StatCard({ label, value, unit, trend, trendDir, accent, icon: Icon, onClick }) {
  return (
    <div className={`stat-card stat-card--${accent} animate-in`} onClick={onClick} style={onClick ? { cursor: 'pointer' } : {}}>
      <div className="stat-card__header">
        <span className="stat-card__label">{label}</span>
        <div className={`stat-card__icon stat-card__icon--${accent}`}>
          <Icon size={18} />
        </div>
      </div>
      <div className="stat-card__value">{value}<span style={{ fontSize: '0.9rem', fontWeight: 400, color: 'var(--text-tertiary)', marginLeft: 4 }}>{unit}</span></div>
      {trend && (
        <div className={`stat-card__trend stat-card__trend--${trendDir}`}>
          {trendDir === 'down' ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
          {trend}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  ALERT CARD                                                          */
/* ------------------------------------------------------------------ */
function AlertCard({ type, title, body, time, onDismiss }) {
  return (
    <div className={`alert-card alert-card--${type}`}>
      <div className="alert-card__header">
        <span className="alert-card__title">{title}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="alert-card__time">{time}</span>
          {onDismiss && (
            <button className="alert-card__dismiss" onClick={onDismiss} title="Dismiss">
              <X size={14} />
            </button>
          )}
        </div>
      </div>
      <p className="alert-card__body">{body}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  TOGGLE SWITCH                                                       */
/* ------------------------------------------------------------------ */
function Toggle({ checked, onChange, label }) {
  return (
    <div className="toggle-row" onClick={() => onChange(!checked)}>
      <span className="toggle-label">{label}</span>
      <div className={`toggle ${checked ? 'toggle--on' : ''}`}>
        <div className="toggle__thumb" />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE VIEWS                                                          */
/* ------------------------------------------------------------------ */

/* --- OVERWATCH (main dashboard) --- */
function OverwatchView({ attendance, avgWait, incidents, staffActive, blobs, zones, alerts, onDismissAlert, onNavigate, showToast, settings }) {
  return (
    <>
      <div className="stats-bar">
        <StatCard label="Attendance" value={attendance.toLocaleString()} unit="/ 70,000" accent="cyan" icon={Users} trend={`${((attendance / 70000) * 100).toFixed(1)}% capacity`} trendDir="up" onClick={() => onNavigate('crowd')} />
        <StatCard label="Avg Wait Time" value={avgWait.toFixed(1)} unit="min" accent="green" icon={Timer} trend="↓ 12% vs last event" trendDir="down" />
        <StatCard label="Active Incidents" value={incidents} unit="" accent="magenta" icon={ShieldAlert} trend={incidents > 2 ? 'Elevated' : 'Normal'} trendDir={incidents > 2 ? 'up' : 'down'} onClick={() => onNavigate('alerts')} />
        <StatCard label="Staff Deployed" value={staffActive} unit="/ 180" accent="amber" icon={Radio} trend={`${180 - staffActive} on standby`} trendDir="down" />
      </div>

      <div className="main-grid">
        <div className="panel map-panel">
          <div className="panel__title">
            <Activity size={16} /> Real-Time Crowd Heatmap
          </div>
          <div className="map-legend">
            <span className="map-legend__item"><span className="map-legend__dot map-legend__dot--low" /> Low</span>
            <span className="map-legend__item"><span className="map-legend__dot map-legend__dot--mid" /> Medium</span>
            <span className="map-legend__item"><span className="map-legend__dot map-legend__dot--high" /> High</span>
          </div>
          <div className="map-canvas">
            <StadiumSVG />
            {settings.showHeatmap && blobs.map((b) => (
              <HeatBlob key={b.id} x={b.x} y={b.y} size={b.size} level={b.level} />
            ))}
            {!settings.showHeatmap && (
              <div className="empty-state" style={{ position: 'absolute', inset: 0, display: 'flex' }}>
                <Eye size={28} />
                <p>Heatmap overlay disabled</p>
                <span>Enable in Settings → Display</span>
              </div>
            )}
          </div>
        </div>

        <div className="right-col">
          {settings.predictiveAlerts && (
            <div className="panel">
              <div className="panel__title">
                <AlertTriangle size={16} /> AI Pre-emption Alerts
              </div>
              <div className="alert-list">
                {alerts.map((a) => (
                  <AlertCard key={a.id} type={a.type} title={a.title} body={a.body} time={a.time} onDismiss={() => onDismissAlert(a.id)} />
                ))}
                {alerts.length === 0 && (
                  <div className="empty-state">
                    <CheckCircle size={32} />
                    <p>All clear — no active alerts</p>
                  </div>
                )}
              </div>
            </div>
          )}
          {!settings.predictiveAlerts && (
            <div className="panel">
              <div className="panel__title"><AlertTriangle size={16} /> AI Pre-emption Alerts</div>
              <div className="empty-state">
                <AlertTriangle size={28} />
                <p>Predictive alerts disabled</p>
                <span>Enable in Settings → AI Engine</span>
              </div>
            </div>
          )}

          <div className="panel">
            <div className="panel__title">
              <Wifi size={16} /> Zone Flow Monitor
            </div>
            <table className="zone-table">
              <thead>
                <tr>
                  <th>Zone</th>
                  <th>Load</th>
                  <th>Capacity</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {zones.map((z) => (
                  <tr key={z.name}>
                    <td><span className="zone-name">{z.name}</span></td>
                    <td className="zone-bar-cell">
                      <div className="zone-bar">
                        <div
                          className={`zone-bar__fill zone-bar__fill--${z.status === 'alert' ? 'high' : z.status === 'caution' ? 'mid' : 'low'}`}
                          style={{ width: `${z.capacity}%` }}
                        />
                      </div>
                    </td>
                    <td style={{ fontVariantNumeric: 'tabular-nums' }}>{z.capacity}%</td>
                    <td>
                      <span className={`zone-status zone-status--${z.status}`}>
                        {z.status === 'alert' ? 'Alert' : z.status === 'caution' ? 'Caution' : 'Normal'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button className="btn-action btn-action--primary" id="btn-reroute" onClick={() => {
            showToast('Dynamic re-route deployed! AI is redirecting crowd flow via Gate A & D corridors.', 'success');
          }}>
            <Zap size={18} />
            Deploy Dynamic Re-route
          </button>
        </div>
      </div>
    </>
  );
}

/* --- DIGITAL TWIN --- */
function DigitalTwinView({ blobs, zones, settings }) {
  return (
    <>
      <div className="page-header">
        <div className="page-header__text">
          <h3>Digital Twin</h3>
          <p>Interactive 3D representation of the venue with live sensor overlay</p>
        </div>
      </div>

      <div className="twin-grid">
        <div className="panel map-panel" style={{ gridColumn: '1 / -1' }}>
          <div className="panel__title">
            <MapPin size={16} /> Stadium Overview — Live Sensor Feed
          </div>
          <div className="map-legend">
            <span className="map-legend__item"><span className="map-legend__dot map-legend__dot--low" /> Low Density</span>
            <span className="map-legend__item"><span className="map-legend__dot map-legend__dot--mid" /> Medium Density</span>
            <span className="map-legend__item"><span className="map-legend__dot map-legend__dot--high" /> High Density</span>
          </div>
          <div className="map-canvas map-canvas--large">
            <StadiumSVG />
            {settings.showHeatmap && blobs.map((b) => (
              <HeatBlob key={b.id} x={b.x} y={b.y} size={b.size} level={b.level} />
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel__title"><Eye size={16} /> Sensor Status</div>
          <div className="sensor-grid">
            {[
              { name: 'Cameras', count: 128, online: 126, color: 'cyan' },
              { name: 'BLE Beacons', count: 340, online: 338, color: 'green' },
              { name: 'UWB Anchors', count: 64, online: 64, color: 'amber' },
              { name: 'Wi-Fi APs', count: 96, online: 91, color: 'purple' },
            ].map((s) => (
              <div className="sensor-item" key={s.name}>
                <div className="sensor-item__header">
                  <span className="sensor-item__name">{s.name}</span>
                  <span className={`zone-status zone-status--normal`}>{s.online}/{s.count}</span>
                </div>
                <div className="zone-bar" style={{ marginTop: '0.5rem' }}>
                  <div className={`zone-bar__fill zone-bar__fill--low`} style={{ width: `${(s.online / s.count) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel__title"><Activity size={16} /> Gate Throughput (persons/min)</div>
          <div className="throughput-list">
            {zones.slice(0, 4).map((z) => (
              <div className="throughput-item" key={z.name}>
                <span className="zone-name">{z.name}</span>
                <div className="throughput-bar-wrapper">
                  <div className="throughput-bar">
                    <div className="throughput-bar__fill" style={{ width: `${z.capacity}%`, background: z.capacity > 80 ? 'var(--magenta)' : z.capacity > 60 ? 'var(--amber)' : 'var(--cyan)' }} />
                  </div>
                  <span className="throughput-value">{Math.round(z.capacity * 1.2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

/* --- CROWD METRICS --- */
function CrowdMetricsView({ attendance, avgWait, zones }) {
  const totalCapacity = zones.reduce((sum, z) => sum + z.capacity, 0);
  const avgCapacity = Math.round(totalCapacity / zones.length);
  const peakZone = zones.reduce((a, b) => a.capacity > b.capacity ? a : b);

  return (
    <>
      <div className="page-header">
        <div className="page-header__text">
          <h3>Crowd Metrics</h3>
          <p>Deep analytics on crowd flow, density patterns, and venue utilization</p>
        </div>
      </div>

      <div className="stats-bar">
        <StatCard label="Total Attendance" value={attendance.toLocaleString()} unit="/ 70,000" accent="cyan" icon={Users} trend={`${((attendance / 70000) * 100).toFixed(1)}% filled`} trendDir="up" />
        <StatCard label="Avg Zone Load" value={`${avgCapacity}%`} unit="" accent="amber" icon={BarChart3} trend={avgCapacity > 65 ? 'Above avg' : 'Healthy'} trendDir={avgCapacity > 65 ? 'up' : 'down'} />
        <StatCard label="Busiest Zone" value={peakZone.name} unit={`${peakZone.capacity}%`} accent="magenta" icon={ArrowUpRight} trend="Peak load" trendDir="up" />
        <StatCard label="Avg Wait" value={avgWait.toFixed(1)} unit="min" accent="green" icon={Clock} trend="↓ 12% vs avg" trendDir="down" />
      </div>

      <div className="metrics-grid">
        <div className="panel" style={{ gridColumn: '1 / -1' }}>
          <div className="panel__title"><BarChart3 size={16} /> Zone Capacity Breakdown</div>
          <div className="bar-chart">
            {zones.map((z) => (
              <div className="bar-chart__item" key={z.name}>
                <div className="bar-chart__bar-wrapper">
                  <div
                    className="bar-chart__bar"
                    style={{
                      height: `${z.capacity}%`,
                      background: z.capacity > 80 ? 'var(--magenta)' : z.capacity > 60 ? 'var(--amber)' : 'var(--cyan)',
                      boxShadow: `0 0 12px ${z.capacity > 80 ? 'rgba(255,45,111,0.4)' : z.capacity > 60 ? 'rgba(255,179,0,0.3)' : 'rgba(0,229,255,0.3)'}`,
                    }}
                  />
                </div>
                <span className="bar-chart__label">{z.name}</span>
                <span className="bar-chart__value">{z.capacity}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel__title"><Users size={16} /> Crowd Flow Summary</div>
          <div className="stat-group-vertical">
            <div className="stat-row">
              <span className="stat-row__label">Ingress Rate</span>
              <span className="stat-row__value" style={{ color: 'var(--cyan)' }}>+124 /min</span>
            </div>
            <div className="stat-row">
              <span className="stat-row__label">Egress Rate</span>
              <span className="stat-row__value" style={{ color: 'var(--amber)' }}>-38 /min</span>
            </div>
            <div className="stat-row">
              <span className="stat-row__label">Net Flow</span>
              <span className="stat-row__value" style={{ color: 'var(--green)' }}>+86 /min</span>
            </div>
            <div className="stat-row">
              <span className="stat-row__label">Dwell Time (avg)</span>
              <span className="stat-row__value">3h 22m</span>
            </div>
            <div className="stat-row">
              <span className="stat-row__label">Restroom Queue</span>
              <span className="stat-row__value" style={{ color: 'var(--green)' }}>1.8 min</span>
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="panel__title"><MapPin size={16} /> Concession Hotspots</div>
          <div className="stat-group-vertical">
            {[
              { name: 'Sec 112 Hot Dogs', wait: '6.2 min', trend: 'up' },
              { name: 'Sec 204 Pizza', wait: '3.1 min', trend: 'down' },
              { name: 'Sec 118 Beer', wait: '4.8 min', trend: 'up' },
              { name: 'Sec 301 Nachos', wait: '2.4 min', trend: 'down' },
              { name: 'Sec 105 Merch', wait: '1.2 min', trend: 'down' },
            ].map((c) => (
              <div className="stat-row" key={c.name}>
                <span className="stat-row__label">{c.name}</span>
                <span className="stat-row__value" style={{ color: c.trend === 'up' ? 'var(--magenta)' : 'var(--green)' }}>
                  {c.wait} {c.trend === 'up' ? '↑' : '↓'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

/* --- ALERTS --- */
function AlertsView({ alerts, onDismissAlert, showToast }) {
  return (
    <>
      <div className="page-header">
        <div className="page-header__text">
          <h3>Alerts & Incidents</h3>
          <p>AI-generated pre-emptions and active incident management</p>
        </div>
        <button className="btn-action btn-action--primary" style={{ width: 'auto', padding: '0.65rem 1.5rem' }} onClick={() => showToast('All alerts marked as reviewed.', 'info')}>
          <CheckCircle size={16} /> Mark All Reviewed
        </button>
      </div>

      <div className="alerts-full-grid">
        <div className="panel" style={{ gridColumn: '1 / -1' }}>
          <div className="panel__title"><Shield size={16} /> Active Pre-emption Alerts ({alerts.length})</div>
          <div className="alert-list alert-list--full">
            {alerts.map((a) => (
              <AlertCard key={a.id} type={a.type} title={a.title} body={a.body} time={a.time} onDismiss={() => onDismissAlert(a.id)} />
            ))}
            {alerts.length === 0 && (
              <div className="empty-state">
                <CheckCircle size={40} />
                <p>All clear — no active alerts</p>
                <span>The AI engine is continuously monitoring all zones</span>
              </div>
            )}
          </div>
        </div>

        <div className="panel">
          <div className="panel__title"><BarChart3 size={16} /> Alert Summary</div>
          <div className="stat-group-vertical">
            <div className="stat-row">
              <span className="stat-row__label">Critical</span>
              <span className="stat-row__value" style={{ color: 'var(--magenta)' }}>{alerts.filter(a => a.type === 'critical').length}</span>
            </div>
            <div className="stat-row">
              <span className="stat-row__label">Warning</span>
              <span className="stat-row__value" style={{ color: 'var(--amber)' }}>{alerts.filter(a => a.type === 'warning').length}</span>
            </div>
            <div className="stat-row">
              <span className="stat-row__label">Info</span>
              <span className="stat-row__value" style={{ color: 'var(--cyan)' }}>{alerts.filter(a => a.type === 'info').length}</span>
            </div>
            <div className="stat-row">
              <span className="stat-row__label">Resolved Today</span>
              <span className="stat-row__value" style={{ color: 'var(--green)' }}>12</span>
            </div>
          </div>
        </div>

        <div className="panel">
          <div className="panel__title"><Clock size={16} /> Recent Activity</div>
          <div className="activity-feed">
            {[
              { text: 'Gate C auxiliary corridor C-2 opened', time: '30s ago', color: 'var(--green)' },
              { text: 'Float-staff dispatched to Sec 112', time: '1m ago', color: 'var(--cyan)' },
              { text: 'Restroom queue alert cleared (L2 North)', time: '3m ago', color: 'var(--green)' },
              { text: 'AI flagged Corridor B flow anomaly', time: '5m ago', color: 'var(--amber)' },
              { text: 'Dynamic re-route deployed (Gate A)', time: '8m ago', color: 'var(--cyan)' },
            ].map((item, i) => (
              <div className="activity-item" key={i}>
                <div className="activity-item__dot" style={{ background: item.color }} />
                <div className="activity-item__content">
                  <span>{item.text}</span>
                  <small>{item.time}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

/* --- SETTINGS --- */
function SettingsView({ settings, onSettingChange, showToast }) {
  const handleToggle = (key, value) => {
    onSettingChange(key, value);
    const label = key.replace(/([A-Z])/g, ' $1').toLowerCase();
    showToast(`${label} ${value ? 'enabled' : 'disabled'}`, value ? 'success' : 'warning');
  };

  return (
    <>
      <div className="page-header">
        <div className="page-header__text">
          <h3>Settings</h3>
          <p>Configure your command center preferences — all changes apply instantly</p>
        </div>
      </div>

      <div className="settings-grid">
        <div className="panel">
          <div className="panel__title"><Eye size={16} /> Display</div>
          <Toggle checked={settings.darkMode} onChange={(v) => handleToggle('darkMode', v)} label="Dark Mode" />
          <div className="toggle-hint">Switch between dark and light dashboard themes</div>
          <Toggle checked={settings.showHeatmap} onChange={(v) => handleToggle('showHeatmap', v)} label="Show Heatmap Overlay" />
          <div className="toggle-hint">Toggle crowd density blobs on the stadium map</div>
          <Toggle checked={settings.animateData} onChange={(v) => handleToggle('animateData', v)} label="Animate Data Updates" />
          <div className="toggle-hint">Pause or resume live data simulation</div>
        </div>

        <div className="panel">
          <div className="panel__title"><Bell size={16} /> Notifications</div>
          <Toggle checked={settings.pushNotifications} onChange={(v) => handleToggle('pushNotifications', v)} label="Push Notifications" />
          <div className="toggle-hint">Show or suppress toast notification popups</div>
          <Toggle checked={settings.alertSounds} onChange={(v) => handleToggle('alertSounds', v)} label="Alert Sounds" />
          <div className="toggle-hint">Play an audio beep on new critical alerts</div>
          <Toggle checked={settings.criticalOverride} onChange={(v) => handleToggle('criticalOverride', v)} label="Critical Alert Override" />
          <div className="toggle-hint">Always show critical alerts even if notifications are off</div>
        </div>

        <div className="panel">
          <div className="panel__title"><Zap size={16} /> AI Engine</div>
          <Toggle checked={settings.autoReroute} onChange={(v) => handleToggle('autoReroute', v)} label="Auto Deploy Re-routes" />
          <div className="toggle-hint">Automatically deploy crowd re-routes when a zone exceeds 85%</div>
          <Toggle checked={settings.predictiveAlerts} onChange={(v) => handleToggle('predictiveAlerts', v)} label="Predictive Surge Alerts" />
          <div className="toggle-hint">Enable AI-generated pre-emption alerts</div>
          <Toggle checked={settings.staffAutoDispatch} onChange={(v) => handleToggle('staffAutoDispatch', v)} label="Staff Auto-dispatch" />
          <div className="toggle-hint">Automatically deploy standby staff to high-load zones</div>
        </div>

        <div className="panel">
          <div className="panel__title"><Globe size={16} /> System</div>
          <div className="stat-group-vertical">
            <div className="stat-row"><span className="stat-row__label">Version</span><span className="stat-row__value">v2.4.1</span></div>
            <div className="stat-row"><span className="stat-row__label">Uptime</span><span className="stat-row__value" style={{ color: 'var(--green)' }}>99.97%</span></div>
            <div className="stat-row"><span className="stat-row__label">API Latency</span><span className="stat-row__value">12ms</span></div>
            <div className="stat-row"><span className="stat-row__label">Data Freshness</span><span className="stat-row__value" style={{ color: settings.animateData ? 'var(--cyan)' : 'var(--amber)' }}>{settings.animateData ? 'Real-time' : 'Paused'}</span></div>
          </div>
        </div>
      </div>
    </>
  );
}


/* ================================================================== */
/*  MAIN APP                                                            */
/* ================================================================== */
export default function App() {
  const [activeNav, setActiveNav] = useState('overwatch');
  const [clock, setClock] = useState('');
  const [blobs, setBlobs] = useState([]);
  const [zones, setZones] = useState(ZONE_DATA_INIT);
  const [attendance, setAttendance] = useState(68402);
  const [avgWait, setAvgWait] = useState(4.2);
  const [incidents, setIncidents] = useState(3);
  const [staffActive, setStaffActive] = useState(142);
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [toasts, setToasts] = useState([]);

  /* --- Global settings state (persists across page navigation) --- */
  const [settings, setSettings] = useState({
    darkMode: true,
    showHeatmap: true,
    animateData: true,
    pushNotifications: true,
    alertSounds: false,
    criticalOverride: true,
    autoReroute: false,
    predictiveAlerts: true,
    staffAutoDispatch: true,
  });

  const updateSetting = useCallback((key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }, []);

  /* --- Apply dark/light mode to document --- */
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.darkMode ? 'dark' : 'light');
  }, [settings.darkMode]);

  /* --- Toast system (respects pushNotifications setting) --- */
  const showToast = useCallback((message, type = 'info', force = false) => {
    if (!force && !settings.pushNotifications && !(settings.criticalOverride && type === 'warning')) {
      return;
    }
    const id = Date.now();
    setToasts((prev) => {
      const updated = [...prev, { id, message, type }];
      return updated.length > 3 ? updated.slice(-3) : updated; // max 3 visible
    });
  }, [settings.pushNotifications, settings.criticalOverride]);

  // Settings page always forces toasts so user can see feedback
  const showSettingsToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => {
      const updated = [...prev, { id, message, type }];
      return updated.length > 3 ? updated.slice(-3) : updated;
    });
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  /* --- Dismiss alert --- */
  const dismissAlert = useCallback((id) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
    showToast('Alert dismissed', 'success');
  }, [showToast]);

  /* --- Clock tick --- */
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setClock(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  /* --- Generate heatmap blobs (only if showHeatmap is on) --- */
  const generateBlobs = useCallback(() => {
    const count = 22;
    const newBlobs = [];
    const clusters = [
      { cx: 50, cy: 8 },
      { cx: 92, cy: 50 },
      { cx: 50, cy: 92 },
      { cx: 8, cy: 50 },
      { cx: 35, cy: 30 },
      { cx: 65, cy: 70 },
    ];

    for (let i = 0; i < count; i++) {
      const cluster = clusters[Math.floor(Math.random() * clusters.length)];
      const x = cluster.cx + rand(-12, 12);
      const y = cluster.cy + rand(-10, 10);
      const r = Math.random();
      const level = r > 0.85 ? 'high' : r > 0.5 ? 'mid' : 'low';
      const size = `${rand(40, 80)}px`;
      newBlobs.push({ id: i, x: Math.max(2, Math.min(98, x)), y: Math.max(2, Math.min(98, y)), level, size });
    }
    setBlobs(newBlobs);
  }, []);

  useEffect(() => {
    generateBlobs();
    const id = setInterval(generateBlobs, 4000);
    return () => clearInterval(id);
  }, [generateBlobs]);

  /* --- Simulate live data changes (only if animateData is on) --- */
  useEffect(() => {
    if (!settings.animateData) return;

    const id = setInterval(() => {
      setAttendance((prev) => Math.min(70000, prev + Math.floor(rand(-5, 20))));
      setAvgWait((prev) => Math.max(1, +(prev + rand(-0.3, 0.2)).toFixed(1)));
      setIncidents((prev) => Math.max(0, prev + (Math.random() > 0.8 ? 1 : 0)));
      setStaffActive((prev) => Math.max(120, Math.min(160, prev + Math.floor(rand(-2, 3)))));
      setZones((prev) => {
        const newZones = prev.map((z) => {
          const cap = Math.max(10, Math.min(99, z.capacity + Math.floor(rand(-4, 5))));
          const status = cap > 80 ? 'alert' : cap > 60 ? 'caution' : 'normal';
          return { ...z, capacity: cap, status };
        });
        return newZones;
      });
    }, 3000);
    return () => clearInterval(id);
  }, [settings.animateData]);

  /* --- Auto re-route: when enabled, auto-deploy if any zone > 85% (with cooldown) --- */
  const lastRerouteRef = useRef(0);
  useEffect(() => {
    if (!settings.autoReroute) return;

    const now = Date.now();
    if (now - lastRerouteRef.current < 15000) return; // 15s cooldown

    const hotZone = zones.find((z) => z.capacity > 85);
    if (hotZone) {
      lastRerouteRef.current = now;
      showToast(`Auto re-route: ${hotZone.name} at ${hotZone.capacity}% — redirecting.`, 'warning');
    }
  }, [zones, settings.autoReroute, showToast]);

  /* --- Staff auto-dispatch: when enabled, auto-dispatch to alert zones --- */
  useEffect(() => {
    if (!settings.staffAutoDispatch) return;

    const alertZones = zones.filter((z) => z.status === 'alert');
    if (alertZones.length > 0) {
      setStaffActive((prev) => Math.min(160, prev + alertZones.length));
    }
  }, [zones, settings.staffAutoDispatch]);

  const navItems = [
    { key: 'overwatch', label: 'Overwatch', icon: LayoutDashboard },
    { key: 'digital-twin', label: 'Digital Twin', icon: MapIcon },
    { key: 'crowd', label: 'Crowd Metrics', icon: Users },
    { key: 'alerts', label: 'Alerts', icon: Bell },
  ];

  /* --- Page titles for topbar --- */
  const pageTitles = {
    overwatch: { title: 'Unified Command Center', sub: 'Real-time venue intelligence & AI-powered crowd orchestration' },
    'digital-twin': { title: 'Digital Twin', sub: 'Live 3D venue model with sensor overlay' },
    crowd: { title: 'Crowd Metrics', sub: 'Attendance analytics, flow rates, and zone utilization' },
    alerts: { title: 'Alerts & Incidents', sub: 'AI pre-emptions and real-time incident tracking' },
    settings: { title: 'Settings', sub: 'Command center configuration' },
  };

  const currentPage = pageTitles[activeNav] || pageTitles.overwatch;

  return (
    <div className={`app-shell ${!settings.darkMode ? 'theme-light' : ''}`}>
      {/* ---------- SIDEBAR ---------- */}
      <aside className="sidebar" role="navigation" aria-label="Main navigation">
        <div className="sidebar__brand">
          <div className="sidebar__brand-icon">
            <Zap size={20} />
          </div>
          <span className="sidebar__brand-name">StadiumSync</span>
        </div>

        <nav className="sidebar__nav">
          {navItems.map((item) => (
            <div
              key={item.key}
              className={`sidebar__link ${activeNav === item.key ? 'sidebar__link--active' : ''}`}
              onClick={() => setActiveNav(item.key)}
              role="button"
              tabIndex={0}
              id={`nav-${item.key}`}
              onKeyDown={(e) => e.key === 'Enter' && setActiveNav(item.key)}
            >
              <item.icon size={18} />
              {item.label}
              {item.key === 'alerts' && alerts.length > 0 && (
                <span className="nav-badge">{alerts.length}</span>
              )}
            </div>
          ))}

          <div className="sidebar__spacer" />

          <div
            className={`sidebar__link ${activeNav === 'settings' ? 'sidebar__link--active' : ''}`}
            onClick={() => setActiveNav('settings')}
            role="button"
            tabIndex={0}
            id="nav-settings"
            onKeyDown={(e) => e.key === 'Enter' && setActiveNav('settings')}
          >
            <Settings size={18} />
            Settings
          </div>
        </nav>

        <div className="sidebar__footer">
          <div className="sidebar__event-badge">
            <div className="sidebar__event-dot" />
            <div className="sidebar__event-info">
              <span className="sidebar__event-name">NFL Championship</span>
              <span className="sidebar__event-sub">MetLife Stadium · Q3 6:42</span>
            </div>
          </div>
        </div>
      </aside>

      {/* ---------- MAIN ---------- */}
      <main className="main" id="main-content" role="main" aria-label="Dashboard content">
        <div className="topbar">
          <div className="topbar__left">
            <h2>{currentPage.title}</h2>
            <p>{currentPage.sub}</p>
          </div>
          <div className="topbar__right">
            <div className="topbar__live">
              <div className="topbar__live-dot" />
              LIVE
            </div>
            <span className="topbar__clock">{clock}</span>
          </div>
        </div>

        <div className="content">
          {activeNav === 'overwatch' && (
            <OverwatchView
              attendance={attendance}
              avgWait={avgWait}
              incidents={incidents}
              staffActive={staffActive}
              blobs={blobs}
              zones={zones}
              alerts={alerts}
              onDismissAlert={dismissAlert}
              onNavigate={setActiveNav}
              showToast={showToast}
              settings={settings}
            />
          )}
          {activeNav === 'digital-twin' && <DigitalTwinView blobs={blobs} zones={zones} settings={settings} />}
          {activeNav === 'crowd' && <CrowdMetricsView attendance={attendance} avgWait={avgWait} zones={zones} />}
          {activeNav === 'alerts' && <AlertsView alerts={alerts} onDismissAlert={dismissAlert} showToast={showToast} />}
          {activeNav === 'settings' && <SettingsView settings={settings} onSettingChange={updateSetting} showToast={showSettingsToast} />}

          {/* Paused data indicator */}
          {!settings.animateData && (
            <div className="paused-banner">
              <Clock size={16} /> Live data simulation paused — enable in Settings
            </div>
          )}
        </div>
      </main>

      {/* ---------- TOAST NOTIFICATIONS ---------- */}
      <div className="toast-container" aria-live="polite" aria-atomic="false" role="status">
        {toasts.map((t) => (
          <Toast key={t.id} message={t.message} type={t.type} onClose={() => dismissToast(t.id)} />
        ))}
      </div>
    </div>
  );
}
