"use client";

import { useEffect, useState } from 'react';

export function useScrollSpy(ids: string[], offset = 150) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    if (ids.length === 0) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY + offset;

      let currentActiveId = '';
      
      for (let i = 0; i < ids.length; i++) {
        const id = ids[i];
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            currentActiveId = id;
          }
        }
      }

      // Check if user has scrolled near bottom
      const scrolledToBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 60;
      if (scrolledToBottom && ids.length > 0) {
        currentActiveId = ids[ids.length - 1];
      }

      if (currentActiveId && currentActiveId !== activeId) {
        setActiveId(currentActiveId);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial check
    setTimeout(handleScroll, 100);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [ids, offset, activeId]);

  return activeId;
}
