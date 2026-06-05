'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header({ title }) {
  const pathname = usePathname();

  const subItems = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Twin', href: '/twin' },
    { name: 'AI Advice', href: '/recommendations' },
    { name: 'Analytics', href: '/analytics' }
  ];

  return (
    <header className="flex justify-between items-center px-margin-page h-16 w-full max-w-[1440px] mx-auto sticky top-0 z-40 bg-surface/70 backdrop-blur-3xl border-b border-outline-variant/30">
      <div className="flex items-center space-x-6">
        <h2 className="font-headline-md text-headline-md font-bold text-primary">{title || 'Dashboard'}</h2>
        <nav className="hidden lg:flex space-x-4">
          {subItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`font-body-md text-body-md transition-colors ${
                  isActive
                    ? 'text-primary border-b-2 border-primary pb-1 font-bold'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative hidden sm:block">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
          <input
            className="bg-surface-container-low border-none rounded-full pl-10 pr-4 py-1.5 text-body-md w-64 focus:ring-2 focus:ring-primary/20"
            placeholder="Search insights..."
            type="text"
          />
        </div>
        <button className="material-symbols-outlined text-on-surface-variant hover:bg-surface-container-high/50 p-2 rounded-lg transition-all cursor-pointer">
          notifications
        </button>
        <button className="material-symbols-outlined text-on-surface-variant hover:bg-surface-container-high/50 p-2 rounded-lg transition-all cursor-pointer">
          settings
        </button>
        <img
          alt="Administrator Profile"
          className="w-8 h-8 rounded-full border border-outline-variant"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDtUJHeOTO_7zYI_X9BG_TAFqaQWZ8LZrPIXoBjA3bq-4eyQwOKFaA6IBTVMT10fylTKGIEBqIWYrmiUr-NqA6fHfsGTUdNrvBAhoNmLgaeST4sGljngPCwVVBndvmXG3uq9tGkndVXL4D3WGwoevy-fg4YwUj9oGpLOLeFrDV4Zb7VFzrfT6nYdbduytK7q15kepD3GCj__uKmfjyZ0gCAvbDkTtbgdYbXrXClWJ48jbUIz8eqk8RluEQS9-GkWFfsIGBWVtaXds8"
        />
      </div>
    </header>
  );
}
