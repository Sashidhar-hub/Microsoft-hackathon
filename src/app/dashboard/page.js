'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

// Load chart dynamically to prevent hydration/window undefined issues
const EnergyChart = dynamic(() => import('../../components/EnergyChart'), { ssr: false });

export default function DashboardPage() {
  const [throttlingActive, setThrottlingActive] = useState(false);
  const [appliedSuggestions, setAppliedSuggestions] = useState({});
  const [prediction, setPrediction] = useState({
    nextPeakTime: '14:15 PM',
    alertLevel: 'Critical',
    confidenceScore: 89,
    reason: 'Predicted load exceeds cooling capacity by 12% in Block C.',
    source: 'Loading Azure AI Foundry prediction...'
  });

  useEffect(() => {
    fetch('/api/prediction')
      .then(res => res.json())
      .then(data => {
        setPrediction(data);
      })
      .catch(err => {
        console.error('Error fetching Azure AI prediction:', err);
      });
  }, []);

  const handleThrottling = () => {
    setThrottlingActive(true);
    setTimeout(() => {
      alert('Smart throttling initiated for Block C. Power demands are adjusted.');
    }, 100);
  };

  const handleApplySuggestion = (id, title) => {
    setAppliedSuggestions(prev => ({ ...prev, [id]: true }));
    setTimeout(() => {
      alert(`Applied optimization: ${title}`);
    }, 100);
  };

  return (
    <div className="min-h-screen flex text-on-surface bg-background">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen relative">
        {/* Floating background decorative circles */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-[100px] pointer-events-none"></div>

        {/* Top Header */}
        <Header title="Dashboard" />

        {/* Page Canvas */}
        <div className="flex-grow p-margin-page space-y-gutter max-w-[1440px] mx-auto w-full z-10">
          
          {/* Hero KPIs: Bento Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
            
            {/* KPI Card 1 */}
            <div className="acrylic-card p-card-padding rounded-xl border-t-4 border-t-primary">
              <div className="flex justify-between items-start mb-4">
                <span className="font-label-md text-label-md font-medium text-on-surface-variant">Total Energy Consumption</span>
                <span className="material-symbols-outlined text-primary">bolt</span>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="font-headline-xl text-headline-xl font-bold">4,282</span>
                <span className="font-body-md text-body-md text-on-surface-variant">kWh</span>
              </div>
              <div className="mt-4 flex items-center text-error">
                <span className="material-symbols-outlined text-sm mr-1">trending_up</span>
                <span className="font-label-md text-label-md font-semibold">+2.4% vs last week</span>
              </div>
            </div>

            {/* KPI Card 2 */}
            <div className="acrylic-card p-card-padding rounded-xl border-t-4 border-t-secondary">
              <div className="flex justify-between items-start mb-4">
                <span className="font-label-md text-label-md font-medium text-on-surface-variant">Energy Saved Today</span>
                <span className="material-symbols-outlined text-secondary">eco</span>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="font-headline-xl text-headline-xl font-bold">842</span>
                <span className="font-body-md text-body-md text-on-surface-variant">kWh</span>
              </div>
              <div className="mt-4 flex items-center text-secondary">
                <span className="material-symbols-outlined text-sm mr-1">check_circle</span>
                <span className="font-label-md text-label-md font-semibold">On track for daily goal</span>
              </div>
            </div>

            {/* KPI Card 3 */}
            <div className="acrylic-card p-card-padding rounded-xl border-t-4 border-t-tertiary">
              <div className="flex justify-between items-start mb-4">
                <span className="font-label-md text-label-md font-medium text-on-surface-variant">Carbon Reduction</span>
                <span className="material-symbols-outlined text-tertiary">co2</span>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="font-headline-xl text-headline-xl font-bold">1.2</span>
                <span className="font-body-md text-body-md text-on-surface-variant">Tons</span>
              </div>
              <div className="mt-4 flex items-center text-secondary">
                <span className="material-symbols-outlined text-sm mr-1">trending_down</span>
                <span className="font-label-md text-label-md font-semibold">15% decrease in footprint</span>
              </div>
            </div>

            {/* KPI Card 4 */}
            <div className="acrylic-card p-card-padding rounded-xl border-t-4 border-t-primary-fixed-dim">
              <div className="flex justify-between items-start mb-4">
                <span className="font-label-md text-label-md font-medium text-on-surface-variant">Sustainability Score</span>
                <span className="material-symbols-outlined text-primary">verified</span>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="font-headline-xl text-headline-xl font-bold">94</span>
                <span className="font-body-md text-body-md text-on-surface-variant">/ 100</span>
              </div>
              <div className="mt-4">
                <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                  <div className="bg-secondary h-full" style={{ width: '94%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Section: Chart and Prediction */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
            
            {/* Main Area Chart */}
            <div className="lg:col-span-2 acrylic-card p-card-padding rounded-xl">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="font-headline-md text-headline-md font-bold text-on-background">Energy Consumption Trends</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">Hourly load distribution vs predicted baseline</p>
                </div>
                <div className="flex bg-surface-container-low p-1 rounded-lg">
                  <button className="px-4 py-1.5 rounded-md bg-white shadow-sm font-label-md text-label-md font-semibold text-on-surface cursor-pointer">Day</button>
                  <button className="px-4 py-1.5 rounded-md font-label-md text-label-md text-on-surface-variant hover:text-on-surface cursor-pointer">Week</button>
                </div>
              </div>
              {/* Dynamic ApexCharts Component */}
              <EnergyChart />
            </div>

            {/* Peak Prediction Card */}
            <div className="flex flex-col space-y-gutter">
              <div className="acrylic-card p-card-padding rounded-xl flex-1 relative overflow-hidden group">
                {/* Background Glow Decoration */}
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-tertiary/10 rounded-full blur-3xl group-hover:bg-tertiary/20 transition-all"></div>
                
                <h3 className="font-headline-md text-headline-md font-bold text-on-background mb-2">Peak Usage Prediction</h3>
                <p className="font-body-md text-body-md text-on-surface-variant mb-6">
                  Next expected peak: <span className="font-bold text-on-surface">{prediction.nextPeakTime}</span>
                </p>
                
                <div className="space-y-4">
                  <div className={`p-4 rounded-lg border ${
                    prediction.alertLevel?.toLowerCase().includes('crit') || prediction.alertLevel?.toLowerCase().includes('high')
                      ? 'bg-error-container/20 border-error/10'
                      : 'bg-secondary/10 border-secondary/10'
                  }`}>
                    <div className="flex justify-between items-center mb-1">
                      <span className={`font-label-md text-label-md font-bold ${
                        prediction.alertLevel?.toLowerCase().includes('crit') || prediction.alertLevel?.toLowerCase().includes('high')
                          ? 'text-error'
                          : 'text-secondary'
                      }`}>Alert Level</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        prediction.alertLevel?.toLowerCase().includes('crit') || prediction.alertLevel?.toLowerCase().includes('high')
                          ? 'bg-error text-on-error'
                          : 'bg-secondary text-white'
                      }`}>{prediction.alertLevel}</span>
                    </div>
                    <p className="font-body-md text-body-md text-on-surface">{prediction.reason}</p>
                  </div>
                  
                  <button 
                    onClick={handleThrottling}
                    disabled={throttlingActive}
                    className={`w-full flex items-center justify-center space-x-2 py-3 rounded-lg font-label-md text-label-md font-semibold transition-all active:scale-95 cursor-pointer ${
                      throttlingActive 
                        ? 'bg-secondary text-on-secondary opacity-90' 
                        : 'bg-tertiary-container text-on-tertiary-container hover:brightness-110'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">bolt</span>
                    <span>{throttlingActive ? 'Throttling Active' : 'Initiate Smart Throttling'}</span>
                  </button>
                </div>
                
                <div className="mt-8">
                  <div className="flex justify-between text-label-md font-semibold mb-2">
                    <span>Confidence Score</span>
                    <span>{prediction.confidenceScore}%</span>
                  </div>
                  <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                    <div className="bg-tertiary h-full transition-all duration-500" style={{ width: `${prediction.confidenceScore}%` }}></div>
                  </div>
                  <p className="text-[10px] text-on-surface-variant font-medium text-right mt-2 italic">
                    Source: {prediction.source}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section: AI Insights and Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
            
            {/* AI Insights Section */}
            <div className="lg:col-span-2 acrylic-card p-card-padding rounded-xl">
              <div className="flex items-center space-x-3 mb-6">
                <span className="material-symbols-outlined text-primary p-2 bg-primary-fixed rounded-lg">psychology</span>
                <h3 className="font-headline-md text-headline-md font-bold text-on-background">AI Insights & Tips</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Tip 1 */}
                <div className="p-4 rounded-xl border border-outline-variant/30 hover:border-primary/30 transition-colors bg-surface-container-lowest">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>lightbulb</span>
                    <h4 className="font-body-lg text-body-lg font-bold text-on-background">Lighting Optimization</h4>
                  </div>
                  <p className="font-body-md text-body-md text-on-surface-variant mb-4">Dimming corridors in Science Wing by 20% can save ~45kWh today.</p>
                  <button 
                    onClick={() => handleApplySuggestion('lighting', 'Dimming corridors in Science Wing')}
                    disabled={appliedSuggestions['lighting']}
                    className="text-primary font-label-md text-label-md font-bold flex items-center hover:underline cursor-pointer disabled:text-secondary"
                  >
                    <span>{appliedSuggestions['lighting'] ? 'Suggestion Applied' : 'Apply Suggestion'}</span>
                    <span className="material-symbols-outlined text-sm ml-1">chevron_right</span>
                  </button>
                </div>

                {/* Tip 2 */}
                <div className="p-4 rounded-xl border border-outline-variant/30 hover:border-primary/30 transition-colors bg-surface-container-lowest">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>ac_unit</span>
                    <h4 className="font-body-lg text-body-lg font-bold text-on-background">HVAC Pre-cooling</h4>
                  </div>
                  <p className="font-body-md text-body-md text-on-surface-variant mb-4">Advance cooling in the Auditorium to 11:00 AM to avoid peak rates.</p>
                  <button 
                    onClick={() => handleApplySuggestion('hvac', 'HVAC precooling scheduled')}
                    disabled={appliedSuggestions['hvac']}
                    className="text-primary font-label-md text-label-md font-bold flex items-center hover:underline cursor-pointer disabled:text-secondary"
                  >
                    <span>{appliedSuggestions['hvac'] ? 'Pre-cooling Scheduled' : 'Schedule Task'}</span>
                    <span className="material-symbols-outlined text-sm ml-1">chevron_right</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Real-time Alerts Feed */}
            <div className="acrylic-card flex flex-col rounded-xl overflow-hidden">
              <div className="p-card-padding border-b border-outline-variant/20 p-6 flex justify-between items-center bg-surface-container-low/50">
                <h3 className="font-body-lg text-body-lg font-bold text-on-background">System Alerts</h3>
                <span className="px-2 py-0.5 bg-surface-container-high rounded-full font-label-md text-[10px] font-bold">3 New</span>
              </div>
              
              <div className="flex-grow p-4 space-y-3">
                {/* Alert 1 */}
                <div className="p-3 rounded-lg flex items-start space-x-3 bg-error-container/20 border-l-4 border-error">
                  <span className="material-symbols-outlined text-error mt-0.5">warning</span>
                  <div>
                    <p className="font-label-md text-label-md font-bold text-on-background">Unusual Surge</p>
                    <p className="text-[12px] text-on-surface-variant">Server Room B: 40% above baseline.</p>
                    <p className="text-[10px] text-on-surface-variant mt-1">2 mins ago</p>
                  </div>
                </div>

                {/* Alert 2 */}
                <div className="p-3 rounded-lg flex items-start space-x-3 hover:bg-surface-container/30 transition-colors">
                  <span className="material-symbols-outlined text-secondary mt-0.5">check_circle</span>
                  <div>
                    <p className="font-label-md text-label-md font-bold text-on-background">Daily Goal Reached</p>
                    <p className="text-[12px] text-on-surface-variant">Sustainability target met for the North Wing.</p>
                    <p className="text-[10px] text-on-surface-variant mt-1">45 mins ago</p>
                  </div>
                </div>

                {/* Alert 3 */}
                <div className="p-3 rounded-lg flex items-start space-x-3 hover:bg-surface-container/30 transition-colors border-l-4 border-primary">
                  <span className="material-symbols-outlined text-primary mt-0.5">info</span>
                  <div>
                    <p className="font-label-md text-label-md font-bold text-on-background">Firmware Update</p>
                    <p className="text-[12px] text-on-surface-variant">Smart Meter v2.4 successfully deployed.</p>
                    <p className="text-[10px] text-on-surface-variant mt-1">2 hours ago</p>
                  </div>
                </div>
              </div>

              <button className="p-4 text-center font-label-md text-label-md text-primary font-bold hover:bg-surface-container/30 border-t border-outline-variant/20 transition-colors cursor-pointer">
                View All Activity
              </button>
            </div>
          </div>
        </div>

        {/* Footer Area */}
        <Footer />
      </main>
    </div>
  );
}
