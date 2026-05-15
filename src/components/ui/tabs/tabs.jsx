"use client";

import React from 'react';
import './tabs.css';
import { usePathname } from "next/navigation";

export default function Tabs({ children }) {
  const pathname = usePathname();
  let links = [];

  if (children?.length > 0) {
    for(let child of children) {
      if (child.props?.href && child.props.href === pathname) {
        let newLink = React.cloneElement(child, {
          className: child.props.className ? `${child.props.className} ${'active'}` : 'active', key: child.key
        });
        links.push(newLink);
      } else {
        links.push(child);
      }
    }
  } else {
    links = children;
  }

  return (
    <nav className="tabs">
      {links}
    </nav>
  );
}