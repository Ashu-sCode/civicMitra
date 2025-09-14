import { getAllReports, deleteReport } from './idb'

export async function flushQueue() {
  try {
    const queue = await getAllReports()
    for (const item of queue) {
      try {
        const res = await fetch('/api/reports', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item)
        })
        if (res.ok) {
          await deleteReport(item.id)
          console.log('Synced item', item.id)
        }
      } catch (err) {
        // still offline or server error — keep item
        console.log('Sync attempt failed for item', item.id)
      }
    }
  } catch (err) {
    console.log('flushQueue error', err)
  }
}
