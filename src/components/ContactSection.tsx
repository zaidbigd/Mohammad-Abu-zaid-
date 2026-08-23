import React, { useState } from 'react';
import {
  Mail,
  Phone,
  Building,
  Radio,
  Send,
  CheckCircle2,
  AlertOctagon,
  Copy,
  ChevronDown,
  ChevronUp,
  Shield,
  HelpCircle,
  Clock,
  Sparkles,
  Server,
} from 'lucide-react';

export const ContactSection: React.FC = () => {
  // Form State
  const [formData, setFormData] = useState({
    agencyName: '',
    contactName: '',
    email: '',
    role: 'Emergency Manager',
    incidentTier: 'Tier 2: Regional Emergency',
    deploymentMode: 'Cloud API & Web GIS',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<null | {
    ticketId: string;
    timestamp: string;
    agency: string;
    tier: string;
  }>(null);
  const [copiedTicket, setCopiedTicket] = useState(false);

  // FAQ Accordion State
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agencyName || !formData.email || !formData.message) {
      alert('Please fill out the Agency Name, Contact Email, and Inquiry Message.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const generatedTicket = {
        ticketId: `DISPATCH-${Math.floor(100000 + Math.random() * 900000)}`,
        timestamp: new Date().toISOString(),
        agency: formData.agencyName,
        tier: formData.incidentTier,
      };
      setSubmissionSuccess(generatedTicket);
      setIsSubmitting(false);
    }, 900);
  };

  const handleCopyTicket = () => {
    if (submissionSuccess) {
      navigator.clipboard.writeText(
        `Transmission Ref: ${submissionSuccess.ticketId}\nAgency: ${submissionSuccess.agency}\nTier: ${submissionSuccess.tier}\nTimestamp: ${submissionSuccess.timestamp}`
      );
      setCopiedTicket(true);
      setTimeout(() => setCopiedTicket(false), 2000);
    }
  };

  const faqs = [
    {
      q: 'Can CrisisMatrix AI operate in air-gapped emergency operations centers (EOCs)?',
      a: 'Yes. CrisisMatrix AI architecture is engineered to deploy either via secure cloud APIs or on-premise air-gapped infrastructure using containerized local multi-agent weights with zero external telemetry leakage.',
    },
    {
      q: 'How does the system ensure safety and prevent AI hallucinations during triage?',
      a: 'We use a collaborative 6-agent arbitration loop with deterministic schema validation. The Decision Agent actively penalizes single-agent anomalies, runs sanity checks on resource counts, and enforces fallback baseline rules.',
    },
    {
      q: 'How does the D3.js Risk Heatmap calculate danger scores?',
      a: 'The D3 heatmap calculates continuous 2D Gaussian density fields across geographic centroids, dynamically weighting base hazard type, population density exposure, road impassability, and active Risk Agent findings on a 0.0 to 10.0 danger scale.',
    },
    {
      q: 'Can we ingest custom live drone feeds and CAD (Computer-Aided Dispatch) JSON?',
      a: 'Yes. The Coordinator Agent exposes standardized REST/WebSocket ingestion endpoints accepting CAP (Common Alerting Protocol), GeoJSON polygons, and real-time CAD dispatch queues.',
    },
  ];

  return (
    <section id="contact" className="py-20 bg-[#0C1017] border-t border-slate-800 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-mono font-semibold uppercase tracking-wider mb-4">
            <Radio className="w-3.5 h-3.5" />
            Operations & Technical Inquiries
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Connect with the CrisisMatrix Operations Team
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400">
            Request an emergency deployment sandbox, schedule an agency briefing, or connect your municipal dispatch CAD system.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Interactive Contact Form */}
          <div className="lg:col-span-7 bg-[#151B26] border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl">
            {submissionSuccess ? (
              <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-base font-bold text-white">
                      Transmission Confirmed & Logged
                    </h4>
                    <p className="text-xs text-slate-300 mt-1">
                      Your dispatch request has been routed to the CrisisMatrix Emergency Operations Engineering Team.
                    </p>
                  </div>
                </div>

                {/* Simulated Transmission Receipt */}
                <div className="bg-[#0A0E14] rounded-xl p-5 border border-slate-800 font-mono text-xs space-y-3">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-slate-400">
                    <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
                      <Shield className="w-3.5 h-3.5" />
                      DISPATCH RECEIPT
                    </span>
                    <span className="text-slate-400">{submissionSuccess.timestamp.slice(0, 19)} UTC</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-[11px]">
                    <div>
                      <span className="text-slate-500">Tracking Reference:</span>
                      <div className="text-amber-400 font-bold text-sm">{submissionSuccess.ticketId}</div>
                    </div>
                    <div>
                      <span className="text-slate-500">Agency:</span>
                      <div className="text-white font-bold">{submissionSuccess.agency}</div>
                    </div>
                    <div>
                      <span className="text-slate-500">Emergency Tier:</span>
                      <div className="text-red-400 font-semibold">{submissionSuccess.tier}</div>
                    </div>
                    <div>
                      <span className="text-slate-500">System Status:</span>
                      <div className="text-emerald-400 font-bold">DISPATCHED TO ON-CALL ENGINEER</div>
                    </div>
                  </div>

                  <button
                    onClick={handleCopyTicket}
                    className="w-full mt-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg flex items-center justify-center gap-2 text-xs font-bold transition border border-slate-700"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedTicket ? 'Copied to Clipboard!' : 'Copy Dispatch Receipt'}</span>
                  </button>
                </div>

                <button
                  onClick={() => {
                    setSubmissionSuccess(null);
                    setFormData({
                      agencyName: '',
                      contactName: '',
                      email: '',
                      role: 'Emergency Manager',
                      incidentTier: 'Tier 2: Regional Emergency',
                      deploymentMode: 'Cloud API & Web GIS',
                      message: '',
                    });
                  }}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-xs uppercase transition"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-700/60">
                  <span className="text-xs font-mono font-bold text-white uppercase flex items-center gap-2">
                    <Building className="w-4 h-4 text-blue-400" />
                    Agency & Technical Inquiry Form
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                    Live Channel Open
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">
                      Agency / Organization *
                    </label>
                    <input
                      type="text"
                      name="agencyName"
                      value={formData.agencyName}
                      onChange={handleInputChange}
                      placeholder="e.g. Metro Emergency Management Agency"
                      required
                      className="w-full px-3 py-2 rounded-lg bg-[#0A0E14] border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">
                      Contact Official Name
                    </label>
                    <input
                      type="text"
                      name="contactName"
                      value={formData.contactName}
                      onChange={handleInputChange}
                      placeholder="e.g. Director Sarah Chen"
                      className="w-full px-3 py-2 rounded-lg bg-[#0A0E14] border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">
                      Official Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="s.chen@metro-emergency.gov"
                      required
                      className="w-full px-3 py-2 rounded-lg bg-[#0A0E14] border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">
                      Deployment Environment
                    </label>
                    <select
                      name="deploymentMode"
                      value={formData.deploymentMode}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded-lg bg-[#0A0E14] border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                    >
                      <option value="Cloud API & Web GIS">Cloud API & Web GIS</option>
                      <option value="Air-gapped On-Premise EOC">Air-gapped On-Premise EOC</option>
                      <option value="Mobile Command Vehicle Unit">Mobile Command Vehicle Unit</option>
                      <option value="Academic / Research Evaluation">Academic / Research Evaluation</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Inquiry / Operational Requirements *
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Describe your emergency jurisdiction, anticipated disaster scenarios, GIS formats, or integration needs..."
                    required
                    className="w-full px-3 py-2 rounded-lg bg-[#0A0E14] border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-blue-500 resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs uppercase transition shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Transmitting Telemetry...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Transmit Dispatch Inquiry</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Direct Comms & FAQ Accordion */}
          <div className="lg:col-span-5 space-y-6">
            {/* Quick Contact Cards */}
            <div className="bg-[#151B26] border border-slate-700/80 rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-bold font-mono text-white uppercase tracking-wider flex items-center gap-2">
                <Server className="w-4 h-4 text-cyan-400" />
                Emergency Operations Support
              </h3>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-[#0A0E14] rounded-lg border border-slate-800 flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-slate-400 font-mono text-[10px]">Operations Desk</div>
                    <div className="text-white font-semibold">ops@crisismatrix.ai</div>
                  </div>
                </div>

                <div className="p-3 bg-[#0A0E14] rounded-lg border border-slate-800 flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
                    <Radio className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-slate-400 font-mono text-[10px]">Direct Response Hotline</div>
                    <div className="text-white font-semibold">+1 (800) 555-CRISIS</div>
                  </div>
                </div>

                <div className="p-3 bg-[#0A0E14] rounded-lg border border-slate-800 flex items-center gap-3">
                  <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-slate-400 font-mono text-[10px]">Availability</div>
                    <div className="text-white font-semibold">24/7/365 Standby Monitoring</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Technical FAQ Accordion */}
            <div className="bg-[#151B26] border border-slate-700/80 rounded-2xl p-6 space-y-4">
              <h3 className="text-sm font-bold font-mono text-white uppercase tracking-wider flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-indigo-400" />
                Frequently Asked Questions
              </h3>

              <div className="space-y-2">
                {faqs.map((faq, i) => {
                  const isOpen = expandedFaq === i;
                  return (
                    <div
                      key={i}
                      className="border border-slate-800 rounded-lg overflow-hidden transition-all bg-[#0A0E14]"
                    >
                      <button
                        onClick={() => setExpandedFaq(isOpen ? null : i)}
                        className="w-full px-3.5 py-2.5 text-left flex items-center justify-between text-xs font-semibold text-slate-200 hover:text-white"
                      >
                        <span className="pr-2">{faq.q}</span>
                        {isOpen ? (
                          <ChevronUp className="w-4 h-4 text-blue-400 shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                        )}
                      </button>
                      {isOpen && (
                        <div className="px-3.5 pb-3 text-[11px] text-slate-400 leading-relaxed border-t border-slate-800/80 pt-2">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
