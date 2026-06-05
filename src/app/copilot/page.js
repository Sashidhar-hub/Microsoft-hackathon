'use client';

import { useState, useRef, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const INITIAL_MESSAGES = [
  {
    sender: 'ai',
    text: "I'm your AI Copilot for energy efficiency. I can analyze real-time data, suggest peak reduction strategies, and generate reports.",
    isGreeting: true
  },
  {
    sender: 'user',
    text: 'How can we reduce peak usage in the Science Complex this afternoon? The weather forecast shows a significant temperature spike.'
  },
  {
    sender: 'ai',
    text: 'Based on the 2 PM spike forecast and current Science Complex occupancy, I recommend a 3-step curtailment strategy. This could save approximately **12% in peak demand charges** ($1,450 projected).',
    strategies: [
      { id: 'A', name: 'Pre-cool Labs', text: 'Lower temps to 68°F between 10 AM - 12 PM before the peak hits.', savings: '-4.2 kW/h', color: 'primary' },
      { id: 'B', name: 'Lighting Dimming', text: 'Reduce non-essential common area lighting to 60% via IoT controller.', savings: '-1.8 kW/h', color: 'secondary' }
    ]
  }
];

export default function CopilotPage() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatCanvasRef = useRef(null);

  useEffect(() => {
    if (chatCanvasRef.current) {
      chatCanvasRef.current.scrollTop = chatCanvasRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = (textToSend) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    // Add user message
    const userMessage = { sender: 'user', text };
    setMessages(prev => [...prev, userMessage]);
    if (!textToSend) setInputText('');

    // Trigger AI response
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      let aiText = "I've logged that request. Let me gather the telemetry data and generate an action plan for you.";
      let strategies = null;

      const lowerText = text.toLowerCase();
      if (lowerText.includes('dorm a') || lowerText.includes('trends')) {
        aiText = "Here are the energy trends for **Dorm A (Residence Block)**. Usage has peaked between 6:00 PM and 9:00 PM due to student occupancy. I suggest deploying solar battery offsets during these hours.";
        strategies = [
          { id: 'D1', name: 'Battery Discharge', text: 'Deploy stored solar energy to offset residential spikes.', savings: '-8.5 kW/h', color: 'primary' },
          { id: 'D2', name: 'Laundry Lock', text: 'Restrict heavy appliance use in common laundry rooms past 6 PM.', savings: '-3.0 kW/h', color: 'secondary' }
        ];
      } else if (lowerText.includes('solar') || lowerText.includes('battery')) {
        aiText = "Solar battery levels are currently at **78% charge (420 kWh)**. Projected solar yield for the afternoon is high. Battery offset capability is fully optimal for peak-shaving at 2:00 PM.";
      } else if (lowerText.includes('report') || lowerText.includes('sustainability')) {
        aiText = "I have drafted the **Sustainability Report Draft for Q2 2026**. Key highlights: \n\n- Total Energy Consumed: 12.4 MWh \n- Carbon Saved: 8.5 Tons \n- Smart HVAC pre-cooling was active for 45 days. \n\nClick below to download the compiled PDF report.";
      } else if (lowerText.includes('attached csv') || lowerText.includes('.csv')) {
        aiText = "I have detected and processed the custom CSV data file you uploaded! \n\n- **Detected Columns:** building, load, status \n- **Rows Parsed:** 14 records \n- **Key Insight:** Science Wing B and Engineering Block represent 64% of total active load. I recommend applying auto-optimization to lower peak demands immediately.";
      }

      setMessages(prev => [...prev, { sender: 'ai', text: aiText, strategies }]);
    }, 1500);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      // Add user message in chat showing file upload
      setMessages(prev => [
        ...prev,
        { sender: 'user', text: `Uploaded CSV file: "${file.name}"` }
      ]);
      
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        const csvContent = event.target.result;
        
        try {
          const lines = csvContent.split(/\r?\n/).map(l => l.trim()).filter(l => l !== '');
          if (lines.length < 2) {
            setMessages(prev => [
              ...prev,
              {
                sender: 'ai',
                text: `⚠️ **Upload Error:** The CSV file \`${file.name}\` is empty or lacks data rows. Please ensure it has a header row followed by data records.`
              }
            ]);
            return;
          }

          // Detect delimiter
          const delimiter = lines[0].includes(';') ? ';' : ',';
          
          // Parse headers
          const headers = lines[0].split(delimiter).map(h => h.trim().replace(/^["']|["']$/g, ''));
          const lowerHeaders = headers.map(h => h.toLowerCase());

          // Parse data rows
          const rows = [];
          for (let i = 1; i < lines.length; i++) {
            const cols = lines[i].split(delimiter).map(c => c.trim().replace(/^["']|["']$/g, ''));
            if (cols.length === headers.length) {
              const rowObj = {};
              headers.forEach((h, index) => {
                rowObj[h.toLowerCase()] = cols[index];
              });
              rows.push(rowObj);
            }
          }

          if (rows.length === 0) {
            setMessages(prev => [
              ...prev,
              {
                sender: 'ai',
                text: `⚠️ **Parse Error:** Could not extract any rows from \`${file.name}\`. Check that it is a valid comma-separated or semicolon-separated table.`
              }
            ]);
            return;
          }

          // Dynamic Header Detection
          let labelIndex = 0;
          let numericIndex = 1;
          let statusIndex = -1;

          // 1. Label column search (Spatial or Temporal)
          const labelKeywords = ['building', 'room', 'location', 'facility', 'block', 'device', 'unit', 'sensor', 'id', 'name', 'period', 'month', 'date', 'time', 'year', 'timestamp', 'day', 'week'];
          const foundLabelIdx = lowerHeaders.findIndex(h => labelKeywords.some(keyword => h.includes(keyword)));
          if (foundLabelIdx !== -1) labelIndex = foundLabelIdx;

          // 2. Numeric column search
          const numericKeywords = ['load', 'peak', 'consumption', 'kw', 'mw', 'usage', 'power', 'value', 'metric', 'efficiency', 'eff', 'savings', 'saved', 'cost', 'amount', 'score'];
          const foundNumericIdx = lowerHeaders.findIndex(h => numericKeywords.some(keyword => h.includes(keyword)));
          if (foundNumericIdx !== -1 && foundNumericIdx !== labelIndex) {
            numericIndex = foundNumericIdx;
          } else {
            // Fallback: search for a column containing numbers
            for (let idx = 0; idx < headers.length; idx++) {
              if (idx === labelIndex) continue;
              const sampleValues = rows.slice(0, 5).map(r => r[lowerHeaders[idx]]);
              const numericCount = sampleValues.filter(val => {
                if (!val) return false;
                const cleaned = val.replace(/[\$%,\s]/g, '');
                return !isNaN(parseFloat(cleaned)) && isFinite(cleaned);
              }).length;
              if (numericCount >= sampleValues.length * 0.6) {
                numericIndex = idx;
                break;
              }
            }
          }

          // 3. Status column search
          const statusKeywords = ['status', 'state', 'mode', 'class', 'badge', 'alert', 'operational'];
          const foundStatusIdx = lowerHeaders.findIndex(h => statusKeywords.some(keyword => h.includes(keyword)));
          if (foundStatusIdx !== -1 && foundStatusIdx !== labelIndex && foundStatusIdx !== numericIndex) {
            statusIndex = foundStatusIdx;
          }

          const labelCol = lowerHeaders[labelIndex];
          const numericCol = lowerHeaders[numericIndex];
          const statusCol = statusIndex !== -1 ? lowerHeaders[statusIndex] : null;

          // Compute Metrics
          let totalValue = 0;
          let count = 0;
          let maxValue = -Infinity;
          let maxLabel = 'N/A';
          let minValue = Infinity;
          let minLabel = 'N/A';
          const statusCounts = {};

          rows.forEach(r => {
            const rawVal = r[numericCol] ? r[numericCol].replace(/[\$%,\s]/g, '') : '';
            const val = parseFloat(rawVal);
            const label = r[labelCol] || 'Unknown';
            const status = statusCol && r[statusCol] ? r[statusCol].trim() : null;

            if (!isNaN(val)) {
              totalValue += val;
              count++;
              if (val > maxValue) {
                maxValue = val;
                maxLabel = label;
              }
              if (val < minValue) {
                minValue = val;
                minLabel = label;
              }
            }

            if (status) {
              statusCounts[status] = (statusCounts[status] || 0) + 1;
            }
          });

          const avgValue = count > 0 ? totalValue / count : 0;
          const statusSummary = Object.entries(statusCounts)
            .map(([k, v]) => `\`${k}\`: ${v}`)
            .join(', ');

          // Formulate AI response dynamically based on dataset
          let text = `📊 **CSV File Successfully Analyzed!**\n\nI have parsed the custom dataset \`${file.name}\` and mapped the headers dynamically:\n\n- **Entity/Label Column:** \`${headers[labelIndex]}\`\n- **Primary Metric Column:** \`${headers[numericIndex]}\`${statusCol ? `\n- **Status/Operational Column:** \`${headers[statusIndex]}\`` : ''}\n- **Total Records:** ${rows.length} rows detected\n\n### 📈 Analytical Summary:\n- **Average value of \`${headers[numericIndex]}\`:** **${avgValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}**\n- **Highest Peak:** \`${maxLabel}\` with **${maxValue.toLocaleString()}**\n- **Lowest Load:** \`${minLabel}\` with **${minValue.toLocaleString()}**\n${statusSummary ? `- **Status Breakdown:** ${statusSummary}\n` : ''}`;

          // Generate dynamic smart strategies based on content
          let strategies = null;
          if (maxValue !== -Infinity) {
            strategies = [
              {
                id: 'AUTO-1',
                name: `Optimize ${maxLabel}`,
                text: `Target load curtailment or peak-shaving for the high-demand node "${maxLabel}" (peak of ${maxValue.toLocaleString()}).`,
                savings: `-${(maxValue * 0.15).toFixed(1)} kW/h`,
                color: 'primary'
              },
              {
                id: 'AUTO-2',
                name: `Baseline Offset`,
                text: `Deploy smart campus grid battery storage to offset the average load of ${avgValue.toFixed(1)} across all units.`,
                savings: `-${(avgValue * 0.10).toFixed(1)} kW/h`,
                color: 'secondary'
              }
            ];
          }

          setMessages(prev => [
            ...prev,
            {
              sender: 'ai',
              text: text,
              strategies: strategies
            }
          ]);

        } catch (err) {
          setMessages(prev => [
            ...prev,
            {
              sender: 'ai',
              text: `⚠️ **Processing Error:** An unexpected error occurred while parsing \`${file.name}\`: ${err.message}`
            }
          ]);
        }
      }, 1200);
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen flex text-on-surface bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen relative bg-surface-bright overflow-hidden">
        
        {/* Top Navbar */}
        <Header title="Copilot" />

        {/* Chat Layout */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Chat History Sidebar */}
          <div className="hidden xl:flex flex-col w-72 acrylic-sidebar border-r border-outline-variant/20 h-full p-6">
            <h3 className="font-headline-md text-body-lg font-semibold mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">history</span> Recent Chats
            </h3>
            
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3">
              <div className="p-3 bg-surface-container-lowest rounded-xl border border-outline-variant/30 cursor-pointer hover:border-primary transition-all shadow-sm">
                <p className="font-label-md text-label-md text-on-surface font-semibold truncate">HVAC Optimization Phase 2</p>
                <p className="text-xs text-on-surface-variant mt-1">2 hours ago</p>
              </div>
              <div className="p-3 bg-transparent rounded-xl border border-transparent cursor-pointer hover:bg-surface-container transition-all">
                <p className="font-label-md text-label-md text-on-surface-variant truncate">Lighting usage in Dorm A</p>
                <p className="text-xs text-on-surface-variant mt-1">Yesterday</p>
              </div>
              <div className="p-3 bg-transparent rounded-xl border border-transparent cursor-pointer hover:bg-surface-container transition-all">
                <p className="font-label-md text-label-md text-on-surface-variant truncate">Solar capacity report</p>
                <p className="text-xs text-on-surface-variant mt-1">Oct 12, 2024</p>
              </div>
            </div>
            
            <button className="mt-4 flex items-center justify-center gap-2 p-3 w-full border border-dashed border-outline rounded-xl text-on-surface-variant hover:text-primary hover:border-primary transition-all cursor-pointer bg-white/40">
              <span className="material-symbols-outlined text-sm">add</span>
              <span className="font-label-md text-label-md font-semibold">New Conversation</span>
            </button>
          </div>

          {/* Chat Canvas Area */}
          <div className="flex-grow flex flex-col relative">
            <div className="absolute top-0 left-0 w-80 h-80 bg-primary/5 rounded-full blur-[80px] pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-secondary/5 rounded-full blur-[80px] pointer-events-none"></div>

            {/* Message Display Canvas */}
            <div 
              ref={chatCanvasRef}
              className="flex-1 overflow-y-auto p-gutter custom-scrollbar space-y-8 max-w-4xl mx-auto w-full z-10"
            >
              {messages.map((m, idx) => (
                <div key={idx}>
                  {m.isGreeting ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="w-16 h-16 bg-primary-container text-white rounded-full flex items-center justify-center mb-4 shadow-xl">
                        <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
                      </div>
                      <h2 className="font-headline-xl text-headline-xl font-bold text-on-surface mb-2">How can I optimize your campus today?</h2>
                      <p className="font-body-md text-body-md text-on-surface-variant max-w-md">{m.text}</p>
                    </div>
                  ) : (
                    <div className={`flex items-start gap-4 ${m.sender === 'user' ? 'justify-end' : ''}`}>
                      {m.sender === 'ai' && (
                        <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-white shrink-0 shadow-sm">
                          <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
                        </div>
                      )}
                      
                      <div className="flex flex-col gap-4 max-w-xl">
                        <div className={`rounded-2xl rounded-tl-none px-5 py-4 shadow-sm border border-outline-variant/30 leading-relaxed text-body-md ${
                          m.sender === 'user' 
                            ? 'chat-bubble-user bg-primary text-white border-primary/20' 
                            : 'chat-bubble-ai bg-white text-on-surface'
                        }`}>
                          <p className="whitespace-pre-wrap">{m.text}</p>
                        </div>

                        {/* Rendering strategies if any are attached */}
                        {m.strategies && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {m.strategies.map((s) => (
                              <div 
                                key={s.id}
                                className={`bg-white p-4 rounded-xl border border-outline-variant/50 shadow-sm border-t-4 ${
                                  s.color === 'primary' ? 'border-t-primary' : 'border-t-secondary'
                                }`}
                              >
                                <div className="flex justify-between items-start mb-2">
                                  <span className={`text-xs font-bold uppercase tracking-wider ${
                                    s.color === 'primary' ? 'text-primary' : 'text-secondary'
                                  }`}>Strategy {s.id}</span>
                                  <span className={`material-symbols-outlined text-lg ${
                                    s.color === 'primary' ? 'text-primary' : 'text-secondary'
                                  }`}>
                                    {s.id === 'A' || s.id === 'D1' ? 'thermostat' : 'lightbulb'}
                                  </span>
                                </div>
                                <p className="font-body-md text-body-md font-bold text-on-surface">{s.name}</p>
                                <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">{s.text}</p>
                                <div className="mt-3 flex items-center text-secondary font-bold text-xs gap-1">
                                  <span className="material-symbols-outlined text-sm">trending_down</span> {s.savings}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {m.sender === 'user' && (
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white shrink-0 shadow-sm">
                          <span className="material-symbols-outlined text-sm">person</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-white shrink-0 shadow-sm">
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
                  </div>
                  <div className="chat-bubble-ai rounded-2xl rounded-tl-none px-5 py-3 shadow-sm border border-outline-variant/30 bg-white flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-on-surface-variant/40 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-on-surface-variant/40 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                    <span className="w-2 h-2 bg-on-surface-variant/40 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Zone */}
            <div className="p-gutter z-20">
              <div className="max-w-4xl mx-auto">
                
                {/* Suggested Prompts */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <button 
                    onClick={() => handleSend('Show energy trends for Dorm A')}
                    className="px-4 py-2 bg-surface-container rounded-full border border-outline-variant/30 text-on-surface-variant font-label-md text-label-md hover:border-primary hover:text-primary transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm text-primary">insights</span> Show energy trends for Dorm A
                  </button>
                  <button 
                    onClick={() => handleSend('Check solar battery levels')}
                    className="px-4 py-2 bg-surface-container rounded-full border border-outline-variant/30 text-on-surface-variant font-label-md text-label-md hover:border-primary hover:text-primary transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm text-secondary">bolt</span> Check solar battery levels
                  </button>
                  <button 
                    onClick={() => handleSend('Draft sustainability report')}
                    className="px-4 py-2 bg-surface-container rounded-full border border-outline-variant/30 text-on-surface-variant font-label-md text-label-md hover:border-primary hover:text-primary transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm text-tertiary">description</span> Draft sustainability report
                  </button>
                </div>

                {/* Main Input Box */}
                <div className="relative bg-white border border-outline-variant shadow-xl rounded-2xl overflow-hidden focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
                  <textarea 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    className="w-full p-4 pr-16 border-none focus:ring-0 resize-none font-body-md text-body-md h-24 focus:outline-none" 
                    placeholder="Ask SmartCampus Energy AI..."
                  />
                  
                  <div className="absolute bottom-3 left-4 flex gap-3 text-on-surface-variant">
                    <input 
                      type="file" 
                      accept=".csv" 
                      id="chat-csv-input" 
                      onChange={handleFileUpload} 
                      className="hidden" 
                    />
                    <label htmlFor="chat-csv-input" className="hover:text-primary transition-colors cursor-pointer">
                      <span className="material-symbols-outlined">attach_file</span>
                    </label>
                    <button className="hover:text-primary transition-colors cursor-pointer"><span className="material-symbols-outlined">mic</span></button>
                    <button className="hover:text-primary transition-colors cursor-pointer"><span className="material-symbols-outlined">image</span></button>
                  </div>
                  
                  <button 
                    onClick={() => handleSend()}
                    className="absolute bottom-3 right-4 bg-primary text-white p-2 rounded-xl shadow-lg hover:opacity-90 active:scale-95 transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined">send</span>
                  </button>
                </div>
                <p className="text-center text-[10px] text-on-surface-variant mt-3 font-semibold">
                  SmartCampus Copilot uses AI to assist; always verify critical operational data before execution.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Area */}
        <Footer />
      </main>
    </div>
  );
}
