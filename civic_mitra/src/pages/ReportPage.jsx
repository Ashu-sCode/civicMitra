import React, { useState } from 'react'
import { addReport, getAllReports } from '../lib/idb'

export default function ReportPage() {
  const [form, setForm] = useState({ name: '', phone: '', desc: '' })
  const [msg, setMsg] = useState('')

  async function submit(e) {
    e.preventDefault()
    setMsg('Submitting...')

    const payload = { ...form, createdAt: Date.now() }

    try {
      // Try server submit first (if you have an API)
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!res.ok) throw new Error('Server not reachable')
      setMsg('Submitted ✅')
      setForm({ name: '', phone: '', desc: '' })
    } catch (err) {
      // Fallback - save locally
      await addReport(payload)
      setMsg('Saved offline — will sync when online.')
      setForm({ name: '', phone: '', desc: '' })
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-3">Report Issue</h2>
      <form onSubmit={submit} className="space-y-3">
        <input className="input" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        <input className="input" placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
        <textarea className="textarea" placeholder="Describe the issue" value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })} />
        <div className="flex gap-2">
          <button className="btn" type="submit">Submit</button>
          <button type="button" className="px-4 py-2 border rounded" onClick={async () => {
            const all = await getAllReports()
            alert(JSON.stringify(all, null, 2))
          }}>View Local Queue</button>
        </div>
      </form>
      <p className="mt-2 text-sm text-slate-500">{msg}</p>
    </div>
  )
}
