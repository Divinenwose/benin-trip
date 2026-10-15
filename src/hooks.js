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


const clean = (v) => String(v || '').trim().replace(/^["']+|["']+$/g, '').trim()
const SB_URL = clean(import.meta.env.VITE_SUPABASE_URL).replace(/\/+$/, '').replace(/\/rest\/v1$/, '')
const SB_KEY = clean(import.meta.env.VITE_SUPABASE_ANON_KEY)
export const sbConfigured = !!(SB_URL && SB_KEY)
const sbHeaders = { apikey: SB_KEY, Authorization: 'Bearer ' + SB_KEY, 'Content-Type': 'application/json' }

const voterToken = () => {
  try {
    let t = localStorage.getItem('benin26-voter')
    if (!t) {
      t = (crypto.randomUUID ? crypto.randomUUID() : String(Math.random()).slice(2) + Date.now()) + '-' + Math.random().toString(36).slice(2)
      localStorage.setItem('benin26-voter', t)
    }
    return t
  } catch { return null }
}
const sha256 = async (txt) => {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(txt))
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('')
}
const sbFetchVotes = async () => {
  const r = await fetch(SB_URL + '/rest/v1/votes?select=id,voter_hash,name,t1,t2,updated_at&order=updated_at.asc', { headers: sbHeaders })
  if (!r.ok) throw new Error('read ' + r.status + ' ' + (await r.text().catch(() => '')).slice(0, 180))
  return r.json()
}
const sbCast = async (token, b) => {
  const r = await fetch(SB_URL + '/rest/v1/rpc/cast_vote', {
    method: 'POST', headers: sbHeaders,
    body: JSON.stringify({ p_voter: token, p_name: b.name || '', p_t1: b.t1 || null, p_t2: b.t2 || null }),
  })
  if (!r.ok) throw new Error('write ' + r.status + ' ' + (await r.text().catch(() => '')).slice(0, 180))
}

// Votes: Claude artifact db when available, then Supabase when configured, else this device only.
export function useVotes() {
  const [mine, setMine] = useState(loadLocal)
  const [remote, setRemote] = useState([])
  const [mode, setMode] = useState('local') // local | shared
  const [err, setErr] = useState(null)
  const [errInfo, setErrInfo] = useState('')
  const [saved, setSaved] = useState(0)
  const ctx = useRef(null)
  const latest = useRef(mine)
  const timer = useRef(null)
  const chain = useRef(Promise.resolve())
  const seeded = useRef(false)
  const sb = useRef(null)

  useEffect(() => {
    let dead = false
    let unsub = () => {}
    ;(async () => {
      try {
        const c = window.claude
        let db = null, uid = null
        if (c && c.use) {
          const [d, user] = await Promise.all([c.use('db'), c.use('user')])
          uid = user ? await user.id() : null
          db = d
        }
        if (dead) return
        if ((!db || !uid) && sbConfigured) {
          const token = voterToken()
          const myHash = token && window.crypto && crypto.subtle ? await sha256(token) : null
          sb.current = { token, myHash }
          const load = async () => {
            try {
              const rows = await sbFetchVotes()
              if (dead) return
              setRemote(rows.map((r) => ({ ...r, id: r.id })))
              setMode('shared'); setErr(null); setErrInfo('')
              if (!seeded.current) {
                seeded.current = true
                const me = myHash && rows.find((r) => r.voter_hash === myHash)
                if (me && !hasVoted(latest.current)) {
                  const rest = { name: me.name || '', t1: me.t1 || null, t2: me.t2 || null }
                  latest.current = rest; setMine(rest); saveLocal(rest)
                }
              }
            } catch (e) { setErr('unavailable'); setErrInfo(String((e && e.message) || e)) }
          }
          await load()
          const iv = setInterval(() => { if (!document.hidden) load() }, 5000)
          unsub = () => clearInterval(iv)
          sb.current.reload = load
          return
        }
        if (!db || !uid) return
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
    if (sb.current && sb.current.token) {
      const snapshot = { ...latest.current }
      chain.current = chain.current
        .then(() => sbCast(sb.current.token, snapshot))
        .then(() => { setErr(null); setErrInfo(''); setSaved((n) => n + 1); return sb.current.reload && sb.current.reload() })
        .catch((e) => { setErr('unavailable'); setErrInfo(String((e && e.message) || e)) })
      return
    }
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
  const myHash = sb.current ? sb.current.myHash : null
  let ballots = remote.filter((r) => r.id !== uid && !(myHash && r.voter_hash === myHash))
  if (hasVoted(mine)) ballots = [...ballots, { id: uid || myHash || 'me', ...mine }]

  return { mine, update, ballots, mode, err, errInfo, saved }
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
