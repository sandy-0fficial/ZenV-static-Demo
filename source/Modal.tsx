import { useEffect, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';
export default function Modal({ title, children, onClose, className = '' }: { title: string; children: ReactNode; onClose: () => void; className?: string }) {
  const ref = useRef<HTMLDivElement>(null), close = useRef(onClose); close.current = onClose;
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null, old = document.body.style.overflow;
    document.body.style.overflow = 'hidden'; ref.current?.focus();
    function keydown(e: KeyboardEvent) {
      if (e.key === 'Escape') close.current();
      if (e.key !== 'Tab') return;
      const elements = Array.from(ref.current?.querySelectorAll<HTMLElement>('button:not(:disabled),a[href],input:not(:disabled),select:not(:disabled),textarea:not(:disabled),details > summary:first-of-type,[tabindex="0"]') || []).filter(el => el.getClientRects().length > 0);
      const first = elements[0], last = elements[elements.length - 1];
      if (!first) { e.preventDefault(); return; }
      if (e.shiftKey && (document.activeElement === first || document.activeElement === ref.current)) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && (document.activeElement === last || document.activeElement === ref.current)) { e.preventDefault(); first.focus(); }
    }
    document.addEventListener('keydown', keydown);
    return () => { document.body.style.overflow = old; document.removeEventListener('keydown', keydown); previous?.focus(); };
  }, []);
  return <div className={`modal-backdrop ${className}`} onMouseDown={e => { if (e.target === e.currentTarget) close.current(); }}><div className="modal" role="dialog" aria-modal="true" aria-label={title} ref={ref} tabIndex={-1}><button className="icon-button modal-close" aria-label={`Close ${title}`} onClick={() => close.current()}><X size={21}/></button>{children}</div></div>;
}
