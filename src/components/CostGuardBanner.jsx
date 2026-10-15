import React, { useState } from 'react';
import { DollarSign, ShieldAlert, CheckCircle2, ChevronRight, Info, Zap } from 'lucide-react';

export default function CostGuardBanner({ onOpenArch }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="cost-guard-container">
      <div className="cost-guard-card">
        <div className="cost-guard-header">
          <div className="cost-status-badge">
            <CheckCircle2 size={16} className="text-emerald" />
            <span>Azure for Students ($100 Credit Protection Active)</span>
          </div>
          <div className="cost-metric-pills">
            <div className="metric-pill">
              <span className="pill-label">Est. Monthly Cost:</span>
              <strong className="pill-val text-emerald">$0.00 / mo</strong>
            </div>
            <div className="metric-pill">
              <span className="pill-label">Budget Guard Limit:</span>
              <strong className="pill-val text-cyan">$10.00 / mo</strong>
            </div>
            <div className="metric-pill">
              <span className="pill-label">Credit Longevity:</span>
              <strong className="pill-val text-purple">Full 12 Months</strong>
            </div>
          </div>
          <button 
            className="cost-toggle-btn" 
            onClick={() => setCollapsed(!collapsed)}
            aria-label="Toggle Cost Breakdown"
          >
            {collapsed ? 'View Rules' : 'Hide Rules'}
          </button>
        </div>

        {!collapsed && (
          <div className="cost-guard-details animate-fade-in">
            <div className="cost-guard-rule">
              <div className="rule-icon-box">
                <Zap size={16} className="text-cyan" />
              </div>
              <div className="rule-text">
                <strong>Static Web Apps + Functions (Free SKU)</strong>
                <p>100 GB Bandwidth & zero idle charges. No $30/mo always-on VMs.</p>
              </div>
            </div>

            <div className="cost-guard-rule">
              <div className="rule-icon-box">
                <ShieldAlert size={16} className="text-emerald" />
              </div>
              <div className="rule-text">
                <strong>Cosmos DB Free-Tier (1,000 RU/s & 25 GB)</strong>
                <p>Partitioned by <code>/courseCode</code> for minimal single-partition query costs.</p>
              </div>
            </div>

            <div className="cost-guard-rule">
              <div className="rule-icon-box">
                <DollarSign size={16} className="text-amber" />
              </div>
              <div className="rule-text">
                <strong>Valet Key Direct-to-Blob Uploads</strong>
                <p>Direct SAS PUTs bypass backend CPU/RAM; enforced 15 MB limit protects storage.</p>
              </div>
            </div>

            <button className="cost-inspect-link" onClick={onOpenArch}>
              <span>Full Flow Diagram</span>
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
