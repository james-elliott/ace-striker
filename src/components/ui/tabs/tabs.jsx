"use client";

import Link from "next/link";
import './tabs.css';
import { usePathname } from "next/navigation";

export default function Tabs({ links }) {
  const pathname = usePathname();

  return (
    <nav className="tabs">
      {links.length > 0 ? links.map((link, index) => {
        return <Link
          key={'link'+index}
          href={link.href}
          className={pathname === link.href ? 'active' : ''}
        >
          {link.content}
        </Link>;
      }) : null }
    </nav>
  );
}