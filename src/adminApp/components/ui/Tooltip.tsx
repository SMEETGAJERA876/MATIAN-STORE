import React, { useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface TooltipProps {
  label: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

/**
 * Custom-styled tooltip to replace the native `title` attribute.
 *
 * Two problems with native `title` tooltips this fixes:
 * 1. They're rendered by the OS/browser chrome, not the page, so they can't
 *    be restyled with CSS and render inconsistently depending on the user's
 *    OS theme, independent of this app's own light/dark mode.
 * 2. Even a custom CSS tooltip positioned with plain `absolute` gets clipped
 *    when any ancestor has `overflow-y-auto`/`hidden` (e.g. the sidebar's
 *    scrollable nav list) - per the CSS spec, setting overflow on one axis
 *    forces the other axis to clip too. Rendering through a portal into
 *    document.body escapes that entirely.
 *
 * Always styled the same dark-on-light-text way regardless of the app's
 * theme, so it's guaranteed readable in both.
 */
export const Tooltip: React.FC<TooltipProps> = ({ label, children, position = 'top', className = '' }) => {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLSpanElement>(null);

  const updatePosition = () => {
    const el = triggerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const gap = 8;
    let top = 0;
    let left = 0;
    switch (position) {
      case 'top':
        top = rect.top - gap;
        left = rect.left + rect.width / 2;
        break;
      case 'bottom':
        top = rect.bottom + gap;
        left = rect.left + rect.width / 2;
        break;
      case 'left':
        top = rect.top + rect.height / 2;
        left = rect.left - gap;
        break;
      case 'right':
        top = rect.top + rect.height / 2;
        left = rect.right + gap;
        break;
    }
    setCoords({ top, left });
  };

  const handleEnter = () => {
    updatePosition();
    setVisible(true);
  };

  const transformByPosition: Record<string, string> = {
    top: 'translate(-50%, -100%)',
    bottom: 'translate(-50%, 0)',
    left: 'translate(-100%, -50%)',
    right: 'translate(0, -50%)',
  };

  return (
    <span
      ref={triggerRef}
      className={`inline-flex ${className}`}
      onMouseEnter={handleEnter}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible &&
        typeof document !== 'undefined' &&
        createPortal(
          <span
            role="tooltip"
            style={{ position: 'fixed', top: coords.top, left: coords.left, transform: transformByPosition[position] }}
            className="pointer-events-none z-[9999] whitespace-nowrap rounded-lg bg-slate-900 px-2.5 py-1.5 text-[11px] font-semibold text-white shadow-lg ring-1 ring-white/10"
          >
            {label}
          </span>,
          document.body
        )}
    </span>
  );
};
