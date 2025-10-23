import React from 'react';

export default function Input({ className = '', ...props }) {
  return (
    <input
      className={`w-full rounded-md border px-3 py-2 outline-none focus:ring focus:ring-blue-200 ${className}`}
      {...props}
    />
  );
}

