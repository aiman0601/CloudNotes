import React, { useState } from 'react';
import { X, Layers, DollarSign, Database, HardDrive, ShieldCheck, Cpu, ArrowRight, Code, AlertTriangle } from 'lucide-react';

export default function ArchitectureModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('diagram');

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog glass-panel arch-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className="modal-icon-wrap bg-blue-tint">
              <Layers size={22} className="text-cyan" />
            </div>
            <div>
              <h2>Azure Serverless Zero-Dollar Architecture</h2>
              <p>Designed for Azure for Students ($100 Credit Longevity Strategy)</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Tab navigation */}
        <div className="arch-tabs">
          <button 
            className={`arch-tab-btn ${activeTab === 'diagram' ? 'active' : ''}`}
            onClick={() => setActiveTab('diagram')}
          >
            Data Flow (Valet Key)
          </button>
          <button 
            className={`arch-tab-btn ${activeTab === 'costs' ? 'active' : ''}`}
            onClick={() => setActiveTab('costs')}
          >
            Cost Breakdown ($0–$2/mo)
          </button>
          <button 
            className={`arch-tab-btn ${activeTab === 'schema' ? 'active' : ''}`}
            onClick={() => setActiveTab('schema')}
          >
            Cosmos DB Schema
          </button>
          <button 
            className={`arch-tab-btn ${activeTab === 'guardrails' ? 'active' : ''}`}
            onClick={() => setActiveTab('guardrails')}
          >
            Credit Protection Rules
          </button>
        </div>

        <div className="arch-content-body">
          {/* TAB 1: DATA FLOW */}
          {activeTab === 'diagram' && (
            <div className="diagram-view animate-fade-in">
              <div className="flow-steps-grid">
                <div className="flow-card">
                  <div className="flow-step-num">Step 1</div>
                  <div className="flow-icon-wrap"><Cpu size={20} className="text-cyan" /></div>
                  <h4>Static Web App UI</h4>
                  <p>React Vite frontend on Azure SWA Free Tier (100 GB bandwidth included).</p>
                </div>

                <div className="flow-connector"><ArrowRight size={18} /></div>

                <div className="flow-card">
                  <div className="flow-step-num">Step 2</div>
                  <div className="flow-icon-wrap"><Cpu size={20} className="text-purple" /></div>
                  <h4>Azure Functions API</h4>
                  <p>Serverless endpoint issues 5-min temporary SAS write token via <code>@azure/storage-blob</code>.</p>
                </div>

                <div className="flow-connector"><ArrowRight size={18} /></div>

                <div className="flow-card highlight-card">
                  <div className="flow-step-num">Step 3 (Valet Key)</div>
                  <div className="flow-icon-wrap"><HardDrive size={20} className="text-emerald" /></div>
                  <h4>Azure Blob Storage</h4>
                  <p>Browser uploads PDF directly to Blob container. API uses 0 KB bandwidth/RAM.</p>
                </div>

                <div className="flow-connector"><ArrowRight size={18} /></div>

                <div className="flow-card">
                  <div className="flow-step-num">Step 4</div>
                  <div className="flow-icon-wrap"><Database size={20} className="text-amber" /></div>
                  <h4>Cosmos DB NoSQL</h4>
                  <p>Metadata saved to <code>/courseCode</code> partition at 1,000 RU/s Free Tier.</p>
                </div>
              </div>

              <div className="arch-callout">
                <strong>Why the Valet Key Pattern matters:</strong> Routing a 15 MB PDF through a standard Node.js server consumes memory, CPU execution time, and can easily overwhelm small Free-Tier instances. Direct SAS upload completely bypasses the backend compute!
              </div>
            </div>
          )}

          {/* TAB 2: COST MATRIX */}
          {activeTab === 'costs' && (
            <div className="costs-view animate-fade-in">
              <table className="arch-table">
                <thead>
                  <tr>
                    <th>Azure Layer</th>
                    <th>Selected SKU / Tier</th>
                    <th>Monthly Free Allowance</th>
                    <th>Cost Impact ($100 Credit)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Frontend + API</strong></td>
                    <td>Azure Static Web Apps (Free)</td>
                    <td>100 GB Bandwidth, SSL, 2 Domains</td>
                    <td><span className="badge badge-green">$0.00 / mo</span></td>
                  </tr>
                  <tr>
                    <td><strong>User Auth</strong></td>
                    <td>Static Web Apps Auth / Entra</td>
                    <td>50,000 Monthly Active Users</td>
                    <td><span className="badge badge-green">$0.00 / mo</span></td>
                  </tr>
                  <tr>
                    <td><strong>Database</strong></td>
                    <td>Cosmos DB NoSQL (Free Tier)</td>
                    <td>1,000 RU/s throughput + 25 GB Storage</td>
                    <td><span className="badge badge-green">$0.00 / mo</span></td>
                  </tr>
                  <tr>
                    <td><strong>File Storage</strong></td>
                    <td>Azure Blob Storage (Hot LRS)</td>
                    <td>First 5 GB free (then ~$0.02 / GB)</td>
                    <td><span className="badge badge-blue">~$0.10 - $0.40 / mo</span></td>
                  </tr>
                  <tr>
                    <td><strong>Search / AI</strong></td>
                    <td>Azure AI Search (Free Tier F0)</td>
                    <td>3 Indexes, 50 MB Vector/Doc Index</td>
                    <td><span className="badge badge-green">$0.00 / mo</span></td>
                  </tr>
                </tbody>
              </table>

              <div className="credit-projection-banner">
                <ShieldCheck size={20} className="text-emerald" />
                <div>
                  <strong>Projection:</strong> At ~$0.20/month, the $100 student credit will easily cover the entire 12-month period with over $95 remaining!
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SCHEMA */}
          {activeTab === 'schema' && (
            <div className="schema-view animate-fade-in">
              <p className="schema-desc">
                Partition Key: <code>/courseCode</code> ensures queries for any course (e.g., <code>CS301</code>) hit a single partition, consuming minimal Request Units (RU/s).
              </p>
              <pre className="code-block">
{`{
  "id": "note_98234",
  "courseCode": "CS301",
  "title": "Operating Systems - Deadlocks & Semaphores Complete Notes",
  "description": "Handwritten lecture notes covering Unit 3 with solved numericals.",
  "semester": 5,
  "department": "Computer Science",
  "fileType": "application/pdf",
  "fileSizeKB": 3420,
  "blobPath": "cs301/2026/note_98234_deadlocks.pdf",
  "uploadedBy": {
    "userId": "stu_1042",
    "name": "Aarav Sharma"
  },
  "tags": ["deadlocks", "semaphores", "midterm-prep"],
  "upvotes": 42,
  "downloads": 189,
  "createdAt": "2026-10-15T10:30:00Z"
}`}
              </pre>
            </div>
          )}

          {/* TAB 4: GUARDRAILS */}
          {activeTab === 'guardrails' && (
            <div className="guardrails-view animate-fade-in">
              <div className="guardrail-item">
                <AlertTriangle size={18} className="text-rose" />
                <div>
                  <h4>Never provision Always-On App Service Plans (B1/S1)</h4>
                  <p>A B1 Basic Plan bills ~$13/month continuously even if zero students visit the site. Static Web Apps scale to zero at $0.</p>
                </div>
              </div>

              <div className="guardrail-item">
                <AlertTriangle size={18} className="text-rose" />
                <div>
                  <h4>Set Budget Alerts at $10 with 50% ($5) & 80% ($8) triggers</h4>
                  <p>Configure this immediately in Cost Management to ensure no accidental resource consumes your credit silently.</p>
                </div>
              </div>

              <div className="guardrail-item">
                <AlertTriangle size={18} className="text-rose" />
                <div>
                  <h4>Cap File Uploads to 15 MB</h4>
                  <p>Prevents students from uploading multi-gigabyte video or ISO files which would inflate Blob Storage storage costs.</p>
                </div>
              </div>

              <div className="guardrail-item">
                <AlertTriangle size={18} className="text-rose" />
                <div>
                  <h4>Enable "Apply Free Tier Discount" on Cosmos DB</h4>
                  <p>Azure grants ONE free-tier Cosmos DB per subscription. Ensure this toggle is explicitly applied during creation.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
