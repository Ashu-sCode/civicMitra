import React from 'react'

export default function Landing({ onStart }) {
  return (
    <div className="max-w-xl mx-auto text-center space-y-6">
      <img src="/pwa-192x192.png" className="mx-auto w-24 h-24" alt="logo" />
      <h1 className="text-2xl font-heading">Hackathon MVP</h1>
      <p className="text-md">A lightweight, offline-ready app to report issues. Install for offline use.</p>
      <div className="flex justify-center gap-2">
        <button className="btn" onClick={onStart}>Get Started</button>
      </div>
      <p className="text-sm text-slate-500">Tip: Install the app for offline use.</p>
    </div>
  )
}
