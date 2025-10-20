import React, { useEffect, useState } from 'react'

export default function InstallButton() {
  const [deferred, setDeferred] = useState(null)

  useEffect(() => {
    function handler(e) {
      e.preventDefault()
      setDeferred(e)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const onInstall = async () => {
    if (!deferred) return
    deferred.prompt()
    const choice = await deferred.userChoice
    console.log('Install choice', choice)
    setDeferred(null)
  }

  if (!deferre) return null
  return <button onClick={onInstall} className="px-3 py-1 rounded bg-indigo-600 text-white">Install</button>
}
