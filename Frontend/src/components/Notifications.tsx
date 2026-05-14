'use client';

import { useState, useEffect } from 'react';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info' | 'error';
  message: string;
  timestamp: Date;
}

// Demo notifications
const DEMO_NOTIFICATIONS: Notification[] = [
  { id: '1', type: 'info', message: 'Welcome to Aegis! Check the documentation for getting started.', timestamp: new Date() },
  { id: '2', type: 'warning', message: 'GammaScam has been flagged for low success rate.', timestamp: new Date(Date.now() - 3600000) },
  { id: '3', type: 'success', message: 'AlphaTrader is now eligible for Gold badge!', timestamp: new Date(Date.now() - 7200000) },
];

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setNotifications(DEMO_NOTIFICATIONS);
  }, []);

  const unreadCount = notifications.filter(n => 
    Date.now() - n.timestamp.getTime() < 86400000
  ).length;

  function getIcon(type: string) {
    switch (type) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      default: return 'ℹ️';
    }
  }

  function formatTime(date: Date) {
    const diff = Date.now() - date.getTime();
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
  }

  return (
    <>
      <button className="notif-toggle" onClick={() => setIsOpen(!isOpen)}>
        🔔
        {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
      </button>

      {isOpen && (
        <div className="notif-panel">
          <div className="notif-header">
            <span>Notifications</span>
            <button onClick={() => setIsOpen(false)}>✕</button>
          </div>
          <div className="notif-list">
            {notifications.length === 0 ? (
              <p className="empty">No notifications</p>
            ) : (
              notifications.map(n => (
                <div key={n.id} className={`notif-item ${n.type}`}>
                  <span className="notif-icon">{getIcon(n.type)}</span>
                  <div className="notif-content">
                    <p>{n.message}</p>
                    <span className="notif-time">{formatTime(n.timestamp)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .notif-toggle {
          position: fixed;
          top: 20px;
          right: 120px;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          font-size: 18px;
          cursor: pointer;
          z-index: 999;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s;
        }
        .notif-toggle:hover { transform: scale(1.1); }
        .notif-toggle .badge {
          position: absolute;
          top: -4px;
          right: -4px;
          background: var(--danger);
          color: white;
          font-size: 10px;
          padding: 2px 6px;
          border-radius: 10px;
          font-weight: bold;
        }
        .notif-panel {
          position: fixed;
          top: 70px;
          right: 20px;
          width: 320px;
          max-height: 400px;
          background: var(--bg-primary);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          z-index: 999;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        }
        .notif-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          border-bottom: 1px solid var(--border-color);
          background: var(--bg-secondary);
        }
        .notif-header span { color: var(--text-primary); font-weight: 600; }
        .notif-header button { background: none; border: none; color: var(--text-muted); cursor: pointer; }
        .notif-list { max-height: 320px; overflow-y: auto; }
        .notif-item {
          display: flex;
          gap: 12px;
          padding: 12px 16px;
          border-bottom: 1px solid var(--border-color);
          transition: background 0.2s;
        }
        .notif-item:hover { background: var(--bg-secondary); }
        .notif-icon { font-size: 16px; }
        .notif-content { flex: 1; }
        .notif-content p { color: var(--text-primary); font-size: 13px; margin: 0 0 4px 0; }
        .notif-time { color: var(--text-muted); font-size: 11px; }
        .empty { padding: 40px; text-align: center; color: var(--text-muted); }
      `}</style>
    </>
  );
}