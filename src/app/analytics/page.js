'use client';

import { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

// Default static data
const DEFAULT_KPI_LOG = [
  { period: 'Oct 2024', efficiency: '92.4%', savings: '+$4,200', status: 'Exceeded', statusClass: 'bg-secondary/10 text-secondary' },
  { period: 'Sep 2024', efficiency: '88.1%', savings: '+$3,150', status: 'Met Target', statusClass: 'bg-secondary/10 text-secondary' },
  { period: 'Aug 2024', efficiency: '76.3%', savings: '-$840', status: 'Maintenance', statusClass: 'bg-tertiary/10 text-tertiary' },
  { period: 'Jul 2024', efficiency: '90.2%', savings: '+$3,800', status: 'Met Target', statusClass: 'bg-secondary/10 text-secondary' }
];

const DEFAULT_BUILDINGS = [
  { name: 'Science Center (A1)', load: 420, percent: 85, badge: 'ACTIVE', badgeClass: 'bg-primary' },
  { name: 'Student Union (B2)', load: 310, percent: 65, badge: 'ACTIVE', badgeClass: 'bg-primary' },
  { name: 'Main Library (C4)', load: 150, percent: 35, badge: 'OPTIMIZED', badgeClass: 'bg-secondary' },
  { name: 'Engineering Lab (D1)', load: 580, percent: 95, badge: 'HIGH USAGE', badgeClass: 'bg-tertiary' }
];

export default function AnalyticsPage() {
  const [kpiLog, setKpiLog] = useState(DEFAULT_KPI_LOG);
  const [buildings, setBuildings] = useState(DEFAULT_BUILDINGS);
  const [summaryData, setSummaryData] = useState({
    totalConsumption: '1,420',
    renewable: '68.2',
    carbon: '342',
    costIndex: '0.14'
  });
  const [csvStatus, setCsvStatus] = useState(null);
  const [chartData, setChartData] = useState([40, 55, 65, 80, 70, 45, 35]);

  const handleCsvUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      parseCsv(text, file.name);
    };
    reader.readAsText(file);
  };

  const parseCsv = (text, fileName) => {
    try {
      const lines = text.split(/\r?\n/).map(l => l.trim()).filter(l => l !== '');
      if (lines.length < 2) {
        alert('CSV file is empty or missing data rows.');
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
        // Handle split by delimiter, cleaning quotes
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
        alert('Could not parse any rows. Ensure columns match the header structure.');
        return;
      }

      // Column Detection Heuristic
      let labelIndex = 0;
      let numericIndex = 1;
      let statusIndex = -1;

      // 1. Label column search (Spatial or Temporal)
      const labelKeywords = ['building', 'room', 'location', 'facility', 'block', 'device', 'unit', 'sensor', 'id', 'name', 'period', 'month', 'date', 'time', 'year', 'timestamp', 'day', 'week'];
      const foundLabelIdx = lowerHeaders.findIndex(h => labelKeywords.some(keyword => h.includes(keyword)));
      if (foundLabelIdx !== -1) {
        labelIndex = foundLabelIdx;
      }

      // 2. Numeric column search
      const numericKeywords = ['load', 'peak', 'consumption', 'kw', 'mw', 'usage', 'power', 'value', 'metric', 'efficiency', 'eff', 'savings', 'saved', 'cost', 'amount', 'score'];
      const foundNumericIdx = lowerHeaders.findIndex(h => numericKeywords.some(keyword => h.includes(keyword)));
      if (foundNumericIdx !== -1 && foundNumericIdx !== labelIndex) {
        numericIndex = foundNumericIdx;
      } else {
        // Find first column that is mostly numeric if keyword search fails
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
      } else if (headers.length > 2) {
        // Fallback status is the remaining column if any
        statusIndex = [0, 1, 2].find(idx => idx !== labelIndex && idx !== numericIndex) ?? -1;
      }

      const labelCol = lowerHeaders[labelIndex];
      const numericCol = lowerHeaders[numericIndex];
      const statusCol = statusIndex !== -1 ? lowerHeaders[statusIndex] : null;

      // Classify file type
      const isTemporal = labelCol.includes('period') || labelCol.includes('month') || labelCol.includes('date') || labelCol.includes('time') || labelCol.includes('timestamp') || labelCol.includes('year') || labelCol.includes('day') || labelCol.includes('week') || numericCol.includes('efficiency') || numericCol.includes('savings') || numericCol.includes('saved');

      if (!isTemporal) {
        // Process as Building Load / Spatial Telemetry
        const parsedBuildings = rows.map(r => {
          const name = r[labelCol] || 'Unknown Block';
          const rawVal = r[numericCol] ? r[numericCol].replace(/[\$%,\s]/g, '') : '100';
          const load = Math.round(parseFloat(rawVal) || 100);
          
          // Calculate arbitrary percentage (assume max 600 or compute from data)
          const maxVal = Math.max(...rows.map(row => {
            const val = row[numericCol] ? row[numericCol].replace(/[\$%,\s]/g, '') : '100';
            return parseFloat(val) || 100;
          }), 100);
          const percent = Math.min(Math.round((load / maxVal) * 100), 100);
          
          const status = statusCol && r[statusCol] ? r[statusCol] : (percent > 85 ? 'High Usage' : percent < 50 ? 'Optimized' : 'Active');
          let badgeClass = 'bg-primary';
          if (status.toLowerCase().includes('opti')) badgeClass = 'bg-secondary';
          if (status.toLowerCase().includes('high') || status.toLowerCase().includes('crit') || status.toLowerCase().includes('main')) badgeClass = 'bg-tertiary';
          
          return { name, load, percent, badge: status.toUpperCase(), badgeClass };
        });

        setBuildings(parsedBuildings);
        
        // Calculate new KPIs
        const totalLoad = parsedBuildings.reduce((sum, b) => sum + b.load, 0);
        const avgEfficiency = Math.round(parsedBuildings.reduce((sum, b) => sum + (100 - b.percent/2), 0) / parsedBuildings.length);
        
        setSummaryData(prev => ({
          ...prev,
          totalConsumption: totalLoad.toLocaleString(),
          renewable: avgEfficiency.toString()
        }));

        // Update chart simulation
        const newChart = parsedBuildings.slice(0, 7).map(b => b.percent);
        if (newChart.length > 0) setChartData(newChart);

        setCsvStatus({
          fileName,
          type: `Building Telemetry (Mapped "${headers[labelIndex]}" & "${headers[numericIndex]}")`,
          rows: rows.length,
          message: `Detected ${rows.length} records. Updated buildings list and KPI metrics.`
        });
      } else {
        // Process as Historical KPI Log
        const parsedKpiLog = rows.map(r => {
          const period = r[labelCol] || 'Unknown Period';
          let rawVal = r[numericCol] || '80';
          // Ensure it has % if it's efficiency, else add it
          let efficiency = rawVal;
          if (!efficiency.includes('%') && !isNaN(parseFloat(efficiency)) && parseFloat(efficiency) <= 100) {
            efficiency = `${parseFloat(efficiency).toFixed(1)}%`;
          } else if (!efficiency.includes('%')) {
            efficiency = `${efficiency}%`;
          }

          // Try to look for a savings column or estimate savings
          let savingsCol = lowerHeaders.find(h => h.includes('savings') || h.includes('saved') || h.includes('cost') || h.includes('reduction'));
          let savings = '$0';
          if (savingsCol && r[savingsCol]) {
            savings = r[savingsCol];
            if (!savings.startsWith('$') && !isNaN(parseFloat(savings))) {
              savings = `+$${parseFloat(savings).toLocaleString()}`;
            }
          } else {
            // Estimate savings based on efficiency
            const effNum = parseFloat(efficiency) || 80;
            const estimatedSavings = Math.round((effNum - 70) * 350);
            savings = estimatedSavings > 0 ? `+$${estimatedSavings.toLocaleString()}` : `-$${Math.abs(estimatedSavings).toLocaleString()}`;
          }

          const statusVal = statusCol && r[statusCol] ? r[statusCol] : (parseFloat(efficiency) >= 90 ? 'Exceeded' : parseFloat(efficiency) >= 80 ? 'Met Target' : 'Maintenance');
          let statusClass = 'bg-secondary/10 text-secondary';
          if (statusVal.toLowerCase().includes('exceed') || statusVal.toLowerCase().includes('opti')) statusClass = 'bg-secondary/10 text-secondary';
          if (statusVal.toLowerCase().includes('main') || statusVal.toLowerCase().includes('warn') || statusVal.toLowerCase().includes('crit') || statusVal.toLowerCase().includes('fail')) statusClass = 'bg-tertiary/10 text-tertiary';
          
          return { period, efficiency, savings, status: statusVal, statusClass };
        });

        setKpiLog(parsedKpiLog);

        // Update summary averages
        const avgEff = parsedKpiLog.reduce((sum, k) => sum + parseFloat(k.efficiency), 0) / parsedKpiLog.length;
        setSummaryData(prev => ({
          ...prev,
          renewable: avgEff.toFixed(1)
        }));

        // Update chart simulation
        const newChart = parsedKpiLog.slice(0, 7).map(k => parseFloat(k.efficiency) - 20);
        if (newChart.length > 0) setChartData(newChart);

        setCsvStatus({
          fileName,
          type: `Historical KPI Log (Mapped "${headers[labelIndex]}" & "${headers[numericIndex]}")`,
          rows: rows.length,
          message: `Detected ${rows.length} period records. Updated historical table and charts.`
        });
      }

    } catch (e) {
      alert(`Error parsing CSV: ${e.message}`);
    }
  };

  return (
    <div className="min-h-screen flex text-on-surface bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen relative">
        {/* Top Header */}
        <header className="flex justify-between items-center px-margin-page h-16 w-full max-w-[1440px] mx-auto bg-surface/70 backdrop-blur-3xl border-b border-outline-variant/30 shadow-sm sticky top-0 z-50">
          <div className="flex items-center gap-6">
            <h2 className="font-display-lg text-headline-md font-bold text-primary">Analytics</h2>
            <div className="hidden lg:flex items-center bg-surface-container-high/50 rounded-lg px-3 py-1.5 border border-outline-variant/30">
              <span className="material-symbols-outlined text-on-surface-variant mr-2">calendar_today</span>
              <select className="bg-transparent border-none text-body-md font-medium text-on-surface-variant focus:ring-0 cursor-pointer">
                <option>Last 30 Days</option>
                <option>Last 7 Days</option>
                <option>Year to Date</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-lg hover:bg-surface-container-high/50 transition-all cursor-pointer relative">
              <span className="material-symbols-outlined text-on-surface-variant">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full border-2 border-surface"></span>
            </button>
            <button className="p-2 rounded-lg hover:bg-surface-container-high/50 transition-all cursor-pointer">
              <span className="material-symbols-outlined text-on-surface-variant">settings</span>
            </button>
            <div className="h-8 w-[1px] bg-outline-variant/50 mx-1"></div>
            <div className="flex items-center gap-3 pl-2 cursor-pointer">
              <img
                alt="Administrator Profile"
                className="w-8 h-8 rounded-full object-cover border border-outline-variant/50"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDtUJHeOTO_7zYI_X9BG_TAFqaQWZ8LZrPIXoBjA3bq-4eyQwOKFaA6IBTVMT10fylTKGIEBqIWYrmiUr-NqA6fHfsGTUdNrvBAhoNmLgaeST4sGljngPCwVVBndvmXG3uq9tGkndVXL4D3WGwoevy-fg4YwUj9oGpLOLeFrDV4Zb7VFzrfT6nYdbduytK7q15kepD3GCj__uKmfjyZ0gCAvbDkTtbgdYbXrXClWJ48jbUIz8eqk8RluEQS9-GkWFfsIGBWVtaXds8"
              />
              <span className="hidden sm:block font-body-md font-semibold text-on-surface">Admin</span>
            </div>
          </div>
        </header>

        {/* Analytics Canvas */}
        <section className="p-margin-page max-w-[1440px] mx-auto w-full space-y-gutter z-10">
          
          {/* CSV File Upload Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
            <div className="lg:col-span-2 acrylic-card p-6 rounded-2xl border border-dashed border-outline-variant/50 hover:border-primary/50 transition-all flex flex-col md:flex-row items-center gap-6 bg-white/50">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0">
                <span className="material-symbols-outlined text-[40px]">upload_file</span>
              </div>
              <div className="flex-1 text-center md:text-left space-y-1">
                <h4 className="font-headline-md text-headline-md font-bold text-on-background">Detect Telemetry Data via CSV</h4>
                <p className="text-body-md text-on-surface-variant leading-relaxed">
                  Drag and drop or select a `.csv` file. The engine will automatically detect variables and update the entire dashboard.
                </p>
                <div className="text-xs text-primary/75 font-semibold pt-1">
                  Supports columns: <strong>Period, Efficiency, Savings, Status</strong> or <strong>Building, Load, Status</strong>.
                </div>
              </div>
              <div className="shrink-0">
                <input 
                  type="file" 
                  accept=".csv" 
                  id="csv-file-input" 
                  onChange={handleCsvUpload} 
                  className="hidden" 
                />
                <label 
                  htmlFor="csv-file-input" 
                  className="px-6 py-3 bg-primary text-on-primary font-bold rounded-lg cursor-pointer hover:opacity-90 transition-all text-sm shadow-sm inline-block"
                >
                  Choose CSV File
                </label>
              </div>
            </div>

            {/* CSV Processing Status */}
            <div className="acrylic-card p-6 rounded-2xl flex flex-col justify-center bg-white/50 border border-outline-variant/30">
              <h4 className="font-bold text-body-lg text-on-background mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary">analytics</span> Data Source
              </h4>
              {csvStatus ? (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-on-surface-variant">
                    File: <span className="text-primary font-bold">{csvStatus.fileName}</span>
                  </p>
                  <p className="text-xs font-semibold text-on-surface-variant">
                    Format Detected: <span className="text-secondary font-bold">{csvStatus.type}</span>
                  </p>
                  <p className="text-xs text-secondary font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">check_circle</span> {csvStatus.message}
                  </p>
                </div>
              ) : (
                <p className="text-body-md text-on-surface-variant italic">
                  No custom file uploaded. Showing default simulation data.
                </p>
              )}
            </div>
          </div>

          {/* Summary KPI Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
            {/* KPI Card 1 */}
            <div className="bg-surface-container-lowest p-card-padding rounded-xl border-t-4 border-primary shadow-sm hover:shadow-md transition-all group">
              <div className="flex justify-between items-start mb-4">
                <p className="font-label-md text-on-surface-variant">Total Consumption</p>
                <span className="material-symbols-outlined text-primary bg-primary/10 p-1.5 rounded-lg">bolt</span>
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <h3 className="text-headline-xl font-bold text-on-surface">{summaryData.totalConsumption}</h3>
                <span className="text-body-md text-on-surface-variant">MWh</span>
              </div>
              <div className="flex items-center gap-1 text-secondary font-medium text-body-md">
                <span className="material-symbols-outlined text-sm">trending_down</span>
                <span>12.4% vs last month</span>
              </div>
            </div>

            {/* KPI Card 2 */}
            <div className="bg-surface-container-lowest p-card-padding rounded-xl border-t-4 border-secondary shadow-sm hover:shadow-md transition-all group">
              <div className="flex justify-between items-start mb-4">
                <p className="font-label-md text-on-surface-variant">Renewable Usage</p>
                <span className="material-symbols-outlined text-secondary bg-secondary/10 p-1.5 rounded-lg">solar_power</span>
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <h3 className="text-headline-xl font-bold text-on-surface">{summaryData.renewable}</h3>
                <span className="text-body-md text-on-surface-variant">%</span>
              </div>
              <div className="flex items-center gap-1 text-secondary font-medium text-body-md">
                <span className="material-symbols-outlined text-sm">trending_up</span>
                <span>+5.1% improvement</span>
              </div>
            </div>

            {/* KPI Card 3 */}
            <div className="bg-surface-container-lowest p-card-padding rounded-xl border-t-4 border-tertiary shadow-sm hover:shadow-md transition-all group">
              <div className="flex justify-between items-start mb-4">
                <p className="font-label-md text-on-surface-variant">Carbon Emissions</p>
                <span className="material-symbols-outlined text-tertiary bg-tertiary/10 p-1.5 rounded-lg">co2</span>
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <h3 className="text-headline-xl font-bold text-on-surface">{summaryData.carbon}</h3>
                <span className="text-body-md text-on-surface-variant">tCO2e</span>
              </div>
              <div className="flex items-center gap-1 text-tertiary font-medium text-body-md">
                <span className="material-symbols-outlined text-sm">trending_up</span>
                <span>2.8% over target</span>
              </div>
            </div>

            {/* KPI Card 4 */}
            <div className="bg-surface-container-lowest p-card-padding rounded-xl border-t-4 border-primary-fixed-dim shadow-sm hover:shadow-md transition-all group">
              <div className="flex justify-between items-start mb-4">
                <p className="font-label-md text-on-surface-variant">Energy Cost Index</p>
                <span className="material-symbols-outlined text-primary bg-primary/10 p-1.5 rounded-lg">payments</span>
              </div>
              <div className="flex items-baseline gap-2 mb-2">
                <h3 className="text-headline-xl font-bold text-on-surface">${summaryData.costIndex}</h3>
                <span className="text-body-md text-on-surface-variant">per kWh</span>
              </div>
              <div className="flex items-center gap-1 text-secondary font-medium text-body-md">
                <span className="material-symbols-outlined text-sm">trending_down</span>
                <span>$0.02 optimized</span>
              </div>
            </div>
          </div>

          {/* Detailed Analysis Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
            
            {/* Main Trend Chart */}
            <div className="lg:col-span-2 bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm p-card-padding flex flex-col">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h4 className="font-headline-lg text-on-surface font-bold">Energy Consumption Trends</h4>
                  <p className="text-body-md text-on-surface-variant">Historical analysis vs AI-driven projections</p>
                </div>
                <div className="flex bg-surface-container-high rounded-full p-1">
                  <button className="px-4 py-1 text-label-md font-semibold bg-white shadow-sm rounded-full text-primary cursor-pointer">Daily</button>
                  <button className="px-4 py-1 text-label-md font-medium text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer">Weekly</button>
                  <button className="px-4 py-1 text-label-md font-medium text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer">Monthly</button>
                </div>
              </div>
              <div className="flex-grow min-h-[300px] relative">
                {/* Dynamically Sized Sparkline Bars */}
                <div className="absolute inset-0 flex items-end gap-4 overflow-hidden pb-8 px-2">
                  <div className="flex-grow flex items-end justify-between h-full border-b-2 border-outline-variant/20 relative">
                    {chartData.map((val, idx) => (
                      <div 
                        key={idx} 
                        style={{ height: `${val}%` }}
                        className="w-12 bg-primary/20 hover:bg-primary transition-all rounded-t-sm group relative cursor-pointer"
                      >
                        <div className="hidden group-hover:flex absolute -top-12 left-1/2 -translate-x-1/2 bg-on-background text-background p-2 rounded text-xs whitespace-nowrap z-10 shadow-lg">
                          Load: {Math.round(val * 5.8)} kW
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="absolute bottom-0 w-full flex justify-between text-label-md text-on-surface-variant/60 font-semibold">
                  <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                </div>
              </div>
            </div>

            {/* Carbon Circular Goal Progress */}
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm p-card-padding flex flex-col justify-between">
              <div>
                <h4 className="font-headline-lg text-on-surface font-bold">Carbon Impact</h4>
                <p className="text-body-md text-on-surface-variant">Progress toward Net Zero</p>
              </div>
              
              <div className="flex flex-col items-center justify-center py-4">
                <div className="relative w-48 h-48">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle className="text-outline-variant/10" cx="96" cy="96" fill="transparent" r="88" stroke="currentColor" strokeWidth="12"></circle>
                    <circle className="text-secondary transition-all duration-1000" cx="96" cy="96" fill="transparent" r="88" stroke="currentColor" strokeDasharray="553" strokeDashoffset={553 - (553 * 0.75)} strokeWidth="12"></circle>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-headline-xl font-bold text-on-surface">75%</span>
                    <span className="text-label-md text-on-surface-variant uppercase font-semibold">Goal Reached</span>
                  </div>
                </div>
                
                <div className="mt-8 w-full space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-secondary">park</span>
                      <span className="text-body-md text-on-surface">Tree Equivalent</span>
                    </div>
                    <span className="font-bold text-on-surface">12,402</span>
                  </div>
                  <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                    <div className="bg-secondary h-full w-[85%] rounded-full"></div>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary">directions_car</span>
                      <span className="text-body-md text-on-surface">Miles Reduced</span>
                    </div>
                    <span className="font-bold text-on-surface">1.2M</span>
                  </div>
                  <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                    <div className="bg-primary h-full w-[60%] rounded-full"></div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-secondary/5 rounded-xl border border-secondary/20 flex gap-4 mt-4">
                <span className="material-symbols-outlined text-secondary text-4xl">auto_awesome</span>
                <div>
                  <p className="text-label-md font-bold text-secondary uppercase">AI Insight</p>
                  <p className="text-body-md text-on-surface-variant text-xs">Improving HVAC uptime in Zone B will reach your goal 12 days earlier.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Building Wise Comparison & KPIs */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter">
            {/* Building Peak Load Comparison */}
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm p-card-padding">
              <div className="flex justify-between items-center mb-6">
                <h4 className="font-headline-lg text-on-surface font-bold">Building Comparison</h4>
                <button className="text-primary font-bold text-sm hover:underline cursor-pointer">Download Template</button>
              </div>
              <div className="space-y-6">
                {buildings.map((b, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-between text-body-md">
                      <span className="font-semibold text-on-surface">{b.name}</span>
                      <span className="text-on-surface-variant">{b.load} kW peak</span>
                    </div>
                    <div className="h-8 w-full flex bg-surface-container-high rounded-lg overflow-hidden group">
                      <div 
                        style={{ width: `${b.percent}%` }}
                        className={`${b.badgeClass} h-full flex items-center px-3 text-white text-[10px] font-extrabold transition-all group-hover:brightness-110`}
                      >
                        {b.badge}
                      </div>
                      <div className="flex-grow bg-primary-fixed-dim/20 opacity-50"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Historical KPI Log */}
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-sm p-card-padding">
              <h4 className="font-headline-lg text-on-surface mb-6 font-bold">Historical KPI Log</h4>
              <div className="overflow-hidden border border-outline-variant/20 rounded-lg">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-high/50 text-label-md text-on-surface-variant border-b border-outline-variant/30">
                      <th className="px-4 py-3 font-bold">PERIOD</th>
                      <th class="px-4 py-3 font-bold">EFFICIENCY</th>
                      <th className="px-4 py-3 font-bold">SAVINGS</th>
                      <th className="px-4 py-3 font-bold">STATUS</th>
                    </tr>
                  </thead>
                  <tbody className="text-body-md text-on-surface divide-y divide-outline-variant/10">
                    {kpiLog.map((log, idx) => (
                      <tr key={idx} className="hover:bg-surface-container-low transition-colors">
                        <td className="px-4 py-4">{log.period}</td>
                        <td className="px-4 py-4">{log.efficiency}</td>
                        <td className="px-4 py-4 text-secondary font-semibold">{log.savings}</td>
                        <td className="px-4 py-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${log.statusClass}`}>
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex justify-end">
                <button className="flex items-center gap-1 text-primary text-body-md font-semibold hover:gap-2 transition-all cursor-pointer">
                  <span>View Full History</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer Area */}
        <Footer />
      </main>
    </div>
  );
}
