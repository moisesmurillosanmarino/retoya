import React from 'react';

export default function Dialog({ open, onClose, title, children, footer }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-lg bg-white shadow-lg">
        <div className="border-b p-4 text-lg font-semibold">{title}</div>
        <div className="p-4">{children}</div>
        {footer ? <div className="border-t p-3">{footer}</div> : null}
        <button className="absolute right-4 top-3" onClick={onClose} aria-label="Close">
          ✕
        </button>
      </div>
    </div>
  );
}

