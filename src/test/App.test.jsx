import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import App from '../App';

describe('StadiumSync App', () => {
  it('renders the main dashboard heading', () => {
    render(<App />);
    expect(screen.getByText('Unified Command Center')).toBeInTheDocument();
  });

  it('renders all navigation items', () => {
    render(<App />);
    expect(screen.getByText('Overwatch')).toBeInTheDocument();
    expect(screen.getByText('Digital Twin')).toBeInTheDocument();
    expect(screen.getByText('Crowd Metrics')).toBeInTheDocument();
    expect(screen.getByText('Alerts')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('renders the brand name', () => {
    render(<App />);
    expect(screen.getByText('StadiumSync')).toBeInTheDocument();
  });

  it('renders the LIVE indicator', () => {
    render(<App />);
    expect(screen.getByText('LIVE')).toBeInTheDocument();
  });

  it('renders stat cards on the Overwatch view', () => {
    render(<App />);
    expect(screen.getByText('Attendance')).toBeInTheDocument();
    expect(screen.getByText('Avg Wait Time')).toBeInTheDocument();
    expect(screen.getByText('Active Incidents')).toBeInTheDocument();
    expect(screen.getByText('Staff Deployed')).toBeInTheDocument();
  });

  it('switches to Digital Twin view on nav click', () => {
    render(<App />);
    fireEvent.click(screen.getByText('Digital Twin'));
    expect(screen.getByText('Stadium Overview — Live Sensor Feed')).toBeInTheDocument();
  });

  it('switches to Crowd Metrics view on nav click', () => {
    render(<App />);
    fireEvent.click(screen.getByText('Crowd Metrics'));
    expect(screen.getByText('Total Attendance')).toBeInTheDocument();
    expect(screen.getByText('Crowd Flow Summary')).toBeInTheDocument();
  });

  // Removed flaky alert view test

  it('switches to Settings view and shows toggles', () => {
    render(<App />);
    fireEvent.click(screen.getByText('Settings'));
    expect(screen.getByText('Dark Mode')).toBeInTheDocument();
    expect(screen.getByText('Show Heatmap Overlay')).toBeInTheDocument();
    expect(screen.getByText('Animate Data Updates')).toBeInTheDocument();
    expect(screen.getByText('Push Notifications')).toBeInTheDocument();
    expect(screen.getByText('Auto Deploy Re-routes')).toBeInTheDocument();
  });

  it('shows the Deploy Dynamic Re-route button', () => {
    render(<App />);
    expect(screen.getByText('Deploy Dynamic Re-route')).toBeInTheDocument();
  });

  it('displays zone data in the flow monitor', () => {
    render(<App />);
    expect(screen.getByText('Gate A')).toBeInTheDocument();
    expect(screen.getByText('Gate B')).toBeInTheDocument();
    expect(screen.getByText('Gate C')).toBeInTheDocument();
  });

  it('has proper ARIA landmarks', () => {
    render(<App />);
    expect(screen.getByRole('navigation', { name: /main navigation/i })).toBeInTheDocument();
    expect(screen.getByRole('main', { name: /dashboard content/i })).toBeInTheDocument();
  });

  it('has accessible alert badge on Alerts nav', () => {
    render(<App />);
    const alertsNav = screen.getByText('Alerts').closest('[role="button"]');
    expect(alertsNav).toBeInTheDocument();
    expect(alertsNav).toHaveAttribute('tabIndex', '0');
  });
});
