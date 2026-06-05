'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: 'dashboard' },
    { name: 'Digital Twin', href: '/twin', icon: 'domain' },
    { name: 'AI Insights', href: '/recommendations', icon: 'psychology' },
    { name: 'Analytics', href: '/analytics', icon: 'leaderboard' },
    { name: 'Copilot', href: '/copilot', icon: 'smart_toy' }
  ];

  return (
    <aside className="hidden md:flex flex-col py-6 px-4 space-y-2 docked left-0 h-screen w-64 bg-surface-container-low/70 backdrop-blur-[30px] border-r border-outline-variant/20 shadow-xl fixed z-50">
      <div className="px-2 mb-8">
        <h1 className="font-headline-md text-headline-md font-bold text-primary">SmartCampus</h1>
        <p className="font-label-md text-label-md font-medium text-on-surface-variant">Efficiency Engine</p>
      </div>
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center px-3 py-2.5 rounded-lg font-label-md text-label-md font-medium transition-all duration-200 hover:translate-x-1 ${
                isActive
                  ? 'bg-primary-container/20 text-primary border-l-4 border-primary'
                  : 'text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              <span className="material-symbols-outlined mr-3">{item.icon}</span>
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="pt-4 mt-auto border-t border-outline-variant/20 space-y-1">
        <Link href="/recommendations">
          <button className="w-full bg-primary text-on-primary py-2.5 rounded-lg font-label-md text-label-md font-semibold mb-4 hover:opacity-90 active:scale-95 transition-all cursor-pointer">
            Optimize Now
          </button>
        </Link>
        <Link
          href="/dashboard"
          className={`flex items-center px-3 py-2 rounded-lg font-label-md text-label-md font-medium text-on-surface-variant hover:bg-surface-container transition-all`}
        >
          <span className="material-symbols-outlined mr-3">help</span>
          Support
        </Link>
        <Link
          href="/dashboard"
          className={`flex items-center px-3 py-2 rounded-lg font-label-md text-label-md font-medium text-on-surface-variant hover:bg-surface-container transition-all`}
        >
          <span className="material-symbols-outlined mr-3">account_circle</span>
          Account
        </Link>
        <Link
          href="/"
          className="flex items-center px-3 py-2 rounded-lg font-label-md text-label-md font-medium text-error hover:bg-error-container/20 transition-all mt-2"
        >
          <span className="material-symbols-outlined mr-3">logout</span>
          Sign Out
        </Link>
      </div>
    </aside>
  );
}
