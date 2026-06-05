'use client';

import { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const RECOMMENDATIONS = [
  {
    id: 1,
    title: 'Optimize HVAC in Engineering Building',
    priority: 'CRITICAL',
    priorityClass: 'bg-error-container text-on-error-container',
    icon: 'hvac',
    iconClass: 'bg-primary-fixed text-primary',
    description: 'Predicted occupancy drop in Wing B from 14:00 - 18:00. Recommend reducing fan speed by 15%.',
    savings: '14.2 MWh',
    reduction: '$3,240.00'
  },
  {
    id: 2,
    title: 'Adaptive Lighting: Library North Wing',
    priority: 'MODERATE',
    priorityClass: 'bg-surface-container-highest text-on-surface-variant',
    icon: 'light_mode',
    iconClass: 'bg-tertiary-fixed text-tertiary',
    description: 'High ambient light levels detected. Dimming smart fixtures to 40% will maintain LUX standards while saving power.',
    savings: '4.8 MWh',
    reduction: '$890.00'
  },
  {
    id: 3,
    title: 'EV Station Load Balancing',
    priority: 'LOW PRIORITY',
    priorityClass: 'bg-surface-container-highest text-on-surface-variant',
    icon: 'ev_station',
    iconClass: 'bg-secondary-fixed-dim/20 text-secondary',
    description: 'Shift non-priority vehicle charging to off-peak hours (22:00 - 04:00) to leverage lower utility rates.',
    savings: '18.5 MWh',
    reduction: '$4,120.00'
  }
];

export default function RecommendationsPage() {
  const [executedActions, setExecutedActions] = useState({});

  const handleAction = (id, title) => {
    setExecutedActions(prev => ({ ...prev, [id]: true }));
    setTimeout(() => {
      alert(`Automated execution triggered: ${title}`);
    }, 100);
  };

  return (
    <div className="min-h-screen flex text-on-surface bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen relative">
        {/* Decorative background gradients */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-[100px] pointer-events-none"></div>

        {/* Top Header */}
        <Header title="AI Advice" />

        {/* Content Area */}
        <div className="flex-grow p-margin-page space-y-gutter max-w-[1440px] mx-auto w-full z-10">
          
          {/* Hero / Status Section */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
            <div className="lg:col-span-2 space-y-4">
              <h2 className="font-headline-xl text-headline-xl font-bold text-on-background">Predictive Optimization Engine</h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
                AI has identified 6 new opportunities to reduce carbon footprint and operational costs across the North Campus. 
                Review and approve automated actions below to execute immediate efficiency gains.
              </p>
            </div>
            
            <div className="acrylic-card p-6 rounded-xl flex flex-col justify-center border-t-4 border-t-secondary bg-white/50">
              <div className="flex items-center justify-between mb-2">
                <span className="font-label-md text-label-md text-secondary font-bold uppercase tracking-wider">Estimated Monthly Impact</span>
                <span className="material-symbols-outlined text-secondary">trending_down</span>
              </div>
              <div className="text-4xl font-extrabold text-on-surface">$12,450.00</div>
              <div className="font-body-md text-body-md text-on-surface-variant mt-1">Potential cost reduction this month</div>
            </div>
          </section>

          {/* Recommendation List */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-headline-lg text-headline-lg font-bold text-on-background">Active Recommendations</h3>
              <div className="flex gap-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold">
                  6 ACTIONS READY
                </span>
                <button className="flex items-center gap-1 font-label-md text-label-md text-primary font-semibold px-2 py-1 hover:bg-primary-container/10 rounded transition-colors cursor-pointer">
                  <span className="material-symbols-outlined text-sm">filter_list</span>
                  Filter
                </button>
              </div>
            </div>

            {/* Recommendation Cards */}
            <div className="grid grid-cols-1 gap-4">
              {RECOMMENDATIONS.map((r) => {
                const isExecuted = executedActions[r.id];
                return (
                  <div key={r.id} className="acrylic-card rounded-xl p-6 flex flex-col md:flex-row gap-6 items-start md:items-center bg-white/50">
                    <div className={`h-14 w-14 rounded-full flex items-center justify-center shrink-0 ${r.iconClass}`}>
                      <span className="material-symbols-outlined text-3xl">{r.icon}</span>
                    </div>
                    
                    <div className="flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-headline-md text-headline-md font-bold text-on-surface">{r.title}</h4>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${r.priorityClass}`}>{r.priority}</span>
                      </div>
                      <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">{r.description}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-1 gap-x-8 md:gap-y-1 text-left md:text-right shrink-0">
                      <div className="flex flex-col">
                        <span className="font-label-md text-[10px] text-on-surface-variant uppercase font-semibold">Savings</span>
                        <span className="font-headline-md text-secondary font-extrabold">{r.savings}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-label-md text-[10px] text-on-surface-variant uppercase font-semibold">Cost Reduction</span>
                        <span className="font-headline-md font-extrabold text-primary">{r.reduction}</span>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => handleAction(r.id, r.title)}
                      disabled={isExecuted}
                      className={`w-full md:w-auto px-6 py-3 font-semibold rounded-lg active:scale-95 transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer ${
                        isExecuted
                          ? 'bg-secondary text-white'
                          : 'bg-primary text-on-primary hover:opacity-90'
                      }`}
                    >
                      <span className="material-symbols-outlined text-lg">{isExecuted ? 'check' : 'bolt'}</span>
                      <span>{isExecuted ? 'Approved & Executing' : 'Automated Action'}</span>
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Bento cards bottom layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="acrylic-card rounded-xl p-6 flex flex-col justify-between border-l-4 border-primary bg-white/50">
                <div>
                  <h4 className="font-headline-md text-headline-md font-bold text-on-surface mb-2">Server Room Thermal Margin</h4>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                    Increase setpoint by 2°F in Data Center West. Thermal safety metrics remain within green zone.
                  </p>
                </div>
                <div className="flex items-center justify-between mt-6 border-t border-outline-variant/20 pt-4">
                  <div className="flex flex-col">
                    <span className="font-label-md text-[10px] text-on-surface-variant uppercase font-semibold">Est. Monthly</span>
                    <span className="text-xl font-extrabold text-primary">$1,850.00</span>
                  </div>
                  <button 
                    onClick={() => handleAction('thermal', 'Server Room setpoint increase')}
                    disabled={executedActions['thermal']}
                    className={`px-4 py-2 text-xs font-bold rounded-lg cursor-pointer ${
                      executedActions['thermal'] ? 'bg-secondary text-white' : 'bg-primary text-on-primary hover:opacity-95'
                    }`}
                  >
                    {executedActions['thermal'] ? 'Approved' : 'Approve'}
                  </button>
                </div>
              </div>

              <div className="acrylic-card rounded-xl p-6 flex flex-col justify-between border-l-4 border-secondary bg-white/50">
                <div>
                  <h4 className="font-headline-md text-headline-md font-bold text-on-surface mb-2">Solar Battery Peak Shaving</h4>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                    Discharge active solar batteries into the campus grid during the peak pricing hours of 14:00 - 16:00.
                  </p>
                </div>
                <div className="flex items-center justify-between mt-6 border-t border-outline-variant/20 pt-4">
                  <div className="flex flex-col">
                    <span className="font-label-md text-[10px] text-on-surface-variant uppercase font-semibold">Est. Monthly</span>
                    <span className="text-xl font-extrabold text-secondary">$2,180.00</span>
                  </div>
                  <button 
                    onClick={() => handleAction('solar', 'Solar Battery Shaving')}
                    disabled={executedActions['solar']}
                    className={`px-4 py-2 text-xs font-bold rounded-lg cursor-pointer ${
                      executedActions['solar'] ? 'bg-secondary text-white' : 'bg-primary text-on-primary hover:opacity-95'
                    }`}
                  >
                    {executedActions['solar'] ? 'Approved' : 'Approve'}
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <Footer />
      </main>
    </div>
  );
}
