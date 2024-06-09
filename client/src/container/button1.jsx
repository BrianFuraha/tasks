import React from 'react'

export default function button1({ label, onClick }) {
  return (
    <button
      className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
      onClick={onClick}
    >
      {label}
    </button>
  );
}
