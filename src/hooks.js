import { useEffect, useRef, useState, useCallback } from 'react'

export function useCountdown(target) {
  const calc = () => {
    const d = Math.max(0, target.getTime() - Date.now())
    return { d: Math.floor(d / 864e5), h: Math.floor(d / 36e5) % 24, m: Math.floor(d / 6e4) % 60, s: Math.floor(d / 1e3) % 60, done: d === 0 }
  }
  const [t, setT] = useState(calc)
  useEffect(() => {
    const i = setInterval(() => setT(calc()), 1000)
    return () => clearInterval(i)
  }, [])
  return t
}

const LS = 'benin26-ballot'
const loadLocal = () => {
  try { return JSON.parse(localStorage.getItem(LS)) || {} } catch { return {} }
}
const saveLocal = (b) => { try { localStorage.setItem(LS, JSON.stringify(b)) } catch {} }

export const hasVoted = (b) => !!(b && (b.t1 || b.t2))

// Shared votes through the artifact db when available, local-only otherwise.
export function useVotes() {
  const [mine, setMine] = useState(loadLocal)
  const [remote, setRemote] = useState([])
  const [mode, setMode] = useState('local') // local | shared
  const [err, setErr] = useState(null)
  const [saved, setSaved] = useState(0)
  const ctx = useRef(null)
  const latest = useRef(mine)
  const timer = useRef(null)
  const chain = useRef(Promise.resolve())
  const seeded = useRef(false)

  useEffect(() => {
    let dead = false
    let unsub = () => {}
    ;(async () => {
      try {
        const c = window.claude
        if (!c || !c.use) return
        const [db, user] = await Promise.all([c.use('db'), c.use('user')])
        const uid = user ? await user.id() : null
        if (dead || !db || !uid) return
        ctx.current = { db, uid }
        unsub = db.collection('votes').onSnapshot(
          (snap) => {
            const rows = snap.docs.filter((d) => d.exists).map((d) => ({ id: d.id, ...(d.data() || {}) }))
            setRemote(rows)
            setMode('shared')
            if (!seeded.current) {
              seeded.current = true
              const me = rows.find((r) => r.id === uid)
              if (me && !hasVoted(latest.current)) {
                const { id, ...rest } = me
                latest.current = rest
                setMine(rest)
                saveLocal(rest)
              }
            }
          },
          (e) => setErr(e && e.code ? e.code : 'unavailable'),
        )
      } catch (e) { /* stay in local mode */ }
    })()
    return () => { dead = true; unsub() }
  }, [])

  const push = useCallback(() => {
    const c = ctx.current
    if (!c) return
    const ballot = { ...latest.current, at: Date.now() }
    chain.current = chain.current
      .then(() => c.db.doc('votes/' + c.uid).set(ballot))
      .then(() => { setErr(null); setSaved((n) => n + 1) })
      .catch((e) => setErr(e && e.code ? e.code : 'unavailable'))
  }, [])

  const update = useCallback((patch) => {
    const next = { ...latest.current, ...patch }
    latest.current = next
    setMine(next)
    saveLocal(next)
    clearTimeout(timer.current)
    timer.current = setTimeout(push, 450)
  }, [push])

  // Ballots shown to everyone: remote rows, with my own row replaced by my live copy.
  const uid = ctx.current ? ctx.current.uid : null
  let ballots = remote.filter((r) => r.id !== uid)
  if (hasVoted(mine)) ballots = [...ballots, { id: uid || 'me', ...mine }]

  return { mine, update, ballots, mode, err, saved }
}

export const tally = (ballots, pick) => {
  const out = {}
  let total = 0
  ballots.forEach((b) => {
    const v = pick(b)
    if (v) { out[v] = (out[v] || 0) + 1; total++ }
  })
  return { counts: out, total }
}
