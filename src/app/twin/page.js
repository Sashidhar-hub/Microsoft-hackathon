'use client';

import { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

const BUILDINGS = [
  {
    id: 'engineering',
    name: 'Engineering Block',
    shortName: 'Engineering',
    load: 84,
    efficiency: 42,
    status: 'Critical',
    statusColor: 'text-error border-error/30 bg-error-container/80',
    dotColor: 'bg-error',
    icon: 'factory',
    advice: 'HVAC System Failure in Wing B. Cooling demands are operating at maximum load due to stuck dampeners.',
    position: 'top-20 left-40 w-48 h-64'
  },
  {
    id: 'datacenter',
    name: 'Data Center',
    shortName: 'Data Center',
    load: 12,
    efficiency: 98,
    status: 'Optimal',
    statusColor: 'text-secondary border-secondary/30 bg-secondary-container/80',
    dotColor: 'bg-secondary',
    icon: 'dns',
    advice: 'Cooling recycling system active. Geothermal cold water loop operating at 95% efficiency. Recommendation: Continue standard baseline.',
    position: 'top-60 right-60 w-32 h-32'
  },
  {
    id: 'mainhall',
    name: 'University Main Hall',
    shortName: 'Main Hall',
    load: 45,
    efficiency: 67,
    status: 'Moderate',
    statusColor: 'text-tertiary border-tertiary-container/30 bg-tertiary-fixed/80',
    dotColor: 'bg-tertiary-container',
    icon: 'apartment',
    advice: 'Peak occupancy detected. Dimming schedule ready to initiate in corridors to offset cooling loads.',
    position: 'bottom-20 left-60 w-56 h-40'
  },
  {
    id: 'biotech',
    name: 'Bio-Research Lab',
    shortName: 'Research Lab',
    load: 22,
    efficiency: 92,
    status: 'Optimal',
    statusColor: 'text-secondary border-secondary/30 bg-secondary-container/80',
    dotColor: 'bg-secondary',
    icon: 'biotech',
    advice: 'Solar array providing 60% of total electrical load. Smart shading windows active. Optimal conditions.',
    position: 'top-80 left-20 w-40 h-40'
  }
];

export default function TwinPage() {
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [optimizationApplied, setOptimizationApplied] = useState({});

  const handleSelectBuilding = (building) => {
    setSelectedBuilding(building);
  };

  const handleApplyOptimization = (id, name) => {
    setOptimizationApplied(prev => ({ ...prev, [id]: true }));
    setTimeout(() => {
      alert(`Applied Auto-Optimization parameters to the ${name}!`);
    }, 100);
  };

  return (
    <div className="min-h-screen flex text-on-surface bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen relative">
        {/* Top Header */}
        <Header title="Digital Twin" />

        {/* Digital Twin Interface */}
        <div className="flex-grow flex flex-col xl:flex-row overflow-hidden relative">
          
          {/* Map Stage */}
          <div className="flex-grow bg-surface-dim relative overflow-hidden flex items-center justify-center p-gutter min-h-[500px]">
            {/* Floating Info Overlay */}
            <div className="absolute top-8 left-8 z-10 flex flex-col gap-4 pointer-events-auto">
              <div className="acrylic-card p-4 rounded-xl border border-outline-variant/30 shadow-lg bg-white/80">
                <h2 className="font-headline-md text-headline-md font-bold text-primary mb-3">Live Campus Engine</h2>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-secondary"></span>
                    <span className="text-xs font-semibold text-on-surface-variant">High Efficiency</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-tertiary-container"></span>
                    <span className="text-xs font-semibold text-on-surface-variant">Moderate</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-error"></span>
                    <span className="text-xs font-semibold text-on-surface-variant">Critical</span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <button className="acrylic-card p-3 rounded-lg border border-outline-variant/30 shadow hover:bg-white transition-all active:scale-95 material-symbols-outlined cursor-pointer bg-white/80">add</button>
                <button className="acrylic-card p-3 rounded-lg border border-outline-variant/30 shadow hover:bg-white transition-all active:scale-95 material-symbols-outlined cursor-pointer bg-white/80">remove</button>
                <button className="acrylic-card p-3 rounded-lg border border-outline-variant/30 shadow hover:bg-white transition-all active:scale-95 material-symbols-outlined cursor-pointer bg-white/80">3d_rotation</button>
                <button className="acrylic-card p-3 rounded-lg border border-outline-variant/30 shadow hover:bg-white transition-all active:scale-95 material-symbols-outlined cursor-pointer bg-white/80">my_location</button>
              </div>
            </div>

            {/* Digital Twin Map isometric view */}
            <div className="map-container relative w-[800px] h-[600px] flex items-center justify-center">
              <div className="isometric-view relative w-full h-full flex items-center justify-center">
                {/* Ground Grid */}
                <div className="absolute w-[1000px] h-[1000px] border border-primary/20 bg-primary/5 rounded-[40px]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(0,95,170,0.1) 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
                
                {/* Render Buildings */}
                {BUILDINGS.map((b) => {
                  const isSelected = selectedBuilding?.id === b.id;
                  return (
                    <div
                      key={b.id}
                      onClick={() => handleSelectBuilding(b)}
                      className={`building absolute ${b.position} rounded-xl shadow-[20px_20px_60px_rgba(0,0,0,0.1)] group border-2 ${
                        b.id === 'engineering' ? 'bg-error-container/85 border-error' :
                        b.id === 'datacenter' ? 'bg-secondary-container/85 border-secondary' :
                        b.id === 'mainhall' ? 'bg-tertiary-fixed/85 border-tertiary-container' :
                        'bg-secondary-container/85 border-secondary'
                      } ${isSelected ? 'ring-4 ring-primary translate-z-4 scale-105' : ''}`}
                    >
                      <div className="building-label absolute -top-12 -left-4 acrylic-card px-4 py-2 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity border border-outline-variant/30 whitespace-nowrap z-20 bg-white">
                        <div className={`font-bold text-xs ${
                          b.status === 'Critical' ? 'text-error' :
                          b.status === 'Optimal' ? 'text-secondary' :
                          'text-tertiary'
                        }`}>{b.name}</div>
                        <div className="text-on-surface-variant text-[10px] font-semibold">Efficiency: {b.efficiency}%</div>
                      </div>
                      
                      <div className={`absolute inset-x-2 top-2 h-1 rounded energy-pulse ${
                        b.status === 'Critical' ? 'bg-error/30' :
                        b.status === 'Optimal' ? 'bg-secondary/30' :
                        'bg-tertiary-container/30'
                      }`}></div>
                      
                      <div className={`flex flex-col items-center justify-center h-full opacity-45 ${
                        b.status === 'Critical' ? 'text-error' :
                        b.status === 'Optimal' ? 'text-secondary' :
                        'text-tertiary'
                      }`}>
                        <span className="material-symbols-outlined text-[48px]">{b.icon}</span>
                        <span className="text-[10px] font-extrabold uppercase tracking-widest mt-1">{b.shortName}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Info Overlay */}
            <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end pointer-events-none">
              <div className="acrylic-card p-4 rounded-xl border border-outline-variant/30 shadow-lg pointer-events-auto max-w-sm bg-white/80">
                <div className="flex items-center gap-3 mb-2 text-primary">
                  <span className="material-symbols-outlined">info</span>
                  <span className="font-bold text-body-lg">Campus Live Feed</span>
                </div>
                <p className="text-body-md text-on-surface-variant leading-relaxed">
                  Grid frequency stable at 50.02 Hz. Total campus carbon offset: 12.4 Tons today.
                </p>
              </div>
            </div>
          </div>

          {/* Details Side Panel */}
          <aside className="w-full xl:w-96 bg-surface-container-lowest border-t xl:border-t-0 xl:border-l border-outline-variant/30 flex flex-col p-6 overflow-y-auto animate-in slide-in-from-right duration-500">
            {selectedBuilding ? (
              <div className="flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="font-headline-lg text-headline-lg font-bold text-primary mb-1">{selectedBuilding.name}</h3>
                    <p className="text-body-md text-on-surface-variant">Status: <span className="font-bold">{selectedBuilding.status}</span></p>
                  </div>
                  <button 
                    onClick={() => setSelectedBuilding(null)}
                    className="material-symbols-outlined text-outline hover:text-on-surface transition-colors cursor-pointer"
                  >
                    close
                  </button>
                </div>

                {/* Telemetry KPIs */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/20">
                    <div className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">Real-time Load</div>
                    <div className="font-headline-md text-headline-md font-bold text-on-background">{selectedBuilding.load} kW</div>
                  </div>
                  <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/20">
                    <div className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">Efficiency</div>
                    <div className="font-headline-md text-headline-md font-bold text-on-background">{selectedBuilding.efficiency}%</div>
                  </div>
                </div>

                {/* Energy Chart visualization */}
                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-bold text-body-lg text-on-background">Energy Consumption (24h)</h4>
                    <span className="text-xs font-bold text-primary hover:underline cursor-pointer">View Details</span>
                  </div>
                  <div className="w-full h-40 bg-surface-container-highest/30 rounded-xl relative overflow-hidden border border-outline-variant/20 flex items-end gap-1 px-4 py-4">
                    <div className="flex-grow bg-primary/20 h-[40%] rounded-t-sm"></div>
                    <div className="flex-grow bg-primary/20 h-[55%] rounded-t-sm"></div>
                    <div className="flex-grow bg-primary/20 h-[70%] rounded-t-sm"></div>
                    <div className="flex-grow bg-primary/20 h-[65%] rounded-t-sm"></div>
                    <div className="flex-grow bg-primary h-[90%] rounded-t-sm"></div>
                    <div className="flex-grow bg-primary/20 h-[75%] rounded-t-sm"></div>
                    <div className="flex-grow bg-primary/20 h-[60%] rounded-t-sm"></div>
                    <div className="flex-grow bg-primary/20 h-[50%] rounded-t-sm"></div>
                  </div>
                </div>

                {/* AI Diagnostics Advice Panel */}
                <div className="bg-primary/5 border border-primary/20 p-5 rounded-2xl mb-8 flex-grow">
                  <div className="flex items-center gap-3 mb-3 text-primary">
                    <span className="material-symbols-outlined">auto_awesome</span>
                    <h4 className="font-bold text-body-lg">AI Recommendation</h4>
                  </div>
                  <p className="text-body-md text-on-surface mb-6 leading-relaxed">
                    {selectedBuilding.advice}
                  </p>
                  
                  <button 
                    onClick={() => handleApplyOptimization(selectedBuilding.id, selectedBuilding.name)}
                    disabled={optimizationApplied[selectedBuilding.id]}
                    className={`w-full py-2.5 rounded-lg font-bold transition-all active:scale-95 cursor-pointer text-sm ${
                      optimizationApplied[selectedBuilding.id]
                        ? 'bg-secondary text-white'
                        : 'bg-primary text-on-primary hover:opacity-90'
                    }`}
                  >
                    {optimizationApplied[selectedBuilding.id] ? 'Optimization Active' : 'Apply Auto-Optimization'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col justify-center items-center text-center py-20 text-on-surface-variant">
                <span className="material-symbols-outlined text-[64px] text-outline-variant/60 mb-4 animate-bounce">domain</span>
                <h3 className="font-headline-md text-body-lg font-bold text-on-background">Select Building</h3>
                <p className="text-body-md text-on-surface-variant max-w-xs mt-2 leading-relaxed">
                  Select any building on the 3D map to view live telemetry, connected IoT devices, and AI diagnostics recommendations.
                </p>
              </div>
            )}

            {/* Connected IoT Assets Feed */}
            {selectedBuilding && (
              <div className="space-y-4 border-t border-outline-variant/30 pt-6">
                <h4 className="font-bold text-body-lg text-on-background">Connected IoT Assets</h4>
                <div className="flex items-center justify-between p-3 bg-surface-container-low rounded-lg border border-outline-variant/10 shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-on-surface-variant text-base">ac_unit</span>
                    <span className="text-body-md text-sm font-medium text-on-surface">Smart HVAC Unit-01</span>
                  </div>
                  <div className="w-3.5 h-3.5 rounded-full bg-secondary"></div>
                </div>
                <div className="flex items-center justify-between p-3 bg-surface-container-low rounded-lg border border-outline-variant/10 shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-on-surface-variant text-base">lightbulb</span>
                    <span className="text-body-md text-sm font-medium text-on-surface">Lutron Lighting Grid</span>
                  </div>
                  <div className="w-3.5 h-3.5 rounded-full bg-secondary"></div>
                </div>
                <div className="flex items-center justify-between p-3 bg-surface-container-low rounded-lg border border-outline-variant/10 shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-on-surface-variant text-base">sensors</span>
                    <span className="text-body-md text-sm font-medium text-on-surface">Occupancy Sensor Hub</span>
                  </div>
                  <div className="w-3.5 h-3.5 rounded-full bg-secondary"></div>
                </div>
              </div>
            )}
          </aside>
        </div>

        {/* Footer Area */}
        <Footer />
      </main>
    </div>
  );
}
