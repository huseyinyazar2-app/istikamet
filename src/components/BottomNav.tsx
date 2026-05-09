'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, BookHeart, Droplets, Settings, Info } from 'lucide-react';
import './components.css';

export default function BottomNav() {
  const pathname = usePathname();

  const links = [
    { href: '/', icon: Compass, label: 'Nefis Muhasebesi' },
    { href: '/rehber', icon: BookHeart, label: 'Rehber' },
    { href: '/arinma', icon: Droplets, label: 'Arınma' },
    { href: '/ayarlar', icon: Settings, label: 'Ayarlar' },
    { href: '/hakkinda', icon: Info, label: 'Hakkında' },
  ];

  return (
    <nav className="bottom-nav">
      {links.map((link) => {
        const Icon = link.icon;
        const isActive = pathname === link.href;
        return (
          <Link href={link.href} key={link.href} className={`nav-item ${isActive ? 'active' : ''}`}>
            <Icon size={24} />
            <span>{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
