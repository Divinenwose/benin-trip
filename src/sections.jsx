import React, { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import {
  Bus, Car, MapPin, CalendarDays, Moon, Home, Plane, Heart, Check, Copy, BedDouble, ShieldCheck, Zap,
  Smartphone, Banknote, BookUser, Syringe, PartyPopper, Waves, Landmark, Luggage, Sparkles, Users, ArrowRight, Clock, Utensils, Camera,
} from 'lucide-react'
import { Reveal, Counter, SectionHead, burstFrom } from './ui.jsx'
import { useCountdown, tally, hasVoted } from './hooks.js'
import {
  RATE, naira, cfa, TRIP_START, PAY_DEADLINE, BUDGET, ROOM_PP, LEG1, LEG2, combo, STOPS, OPTIONALS, DAYS, REQS, ACCOUNT,
} from './data.js'

const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

/* ───────────── HERO ───────────── */
const WORDS = ['Script', 'Experience', 'Benin', '2026']
export function Hero() {
  const t = useCountdown(TRIP_START)
  const { scrollY } = useScroll()
  const yA = useTransform(scrollY, [0, 700], [0, -90])
  const yB = useTransform(scrollY, [0, 700], [0, 60])
  const rot = useTransform(scrollY, [0, 700], [0, 40])
  return (
    <header className="hero" id="top">
      <div className="hero-inner">
        <div className="hero-copy">
          <motion.span className="route-chip" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            Lagos <ArrowRight size={14} /> Cotonou
          </motion.span>
          <h1>
            {WORDS.map((w, i) => (
              <span className="word-mask" key={w}>
                <motion.span className={'word ' + (i === 3 ? 'year' : '')} initial={{ y: '110%' }} animate={{ y: 0 }}
                  transition={{ delay: 0.25 + i * 0.12, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>{w}</motion.span>
              </span>
            ))}
          </h1>
          <motion.p className="hero-tag" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>A trip to remember.</motion.p>
          <motion.div className="hero-dates" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }}>
            <span><CalendarDays size={16} /> Mon 23 – Fri 27 November 2026</span>
            <span><Moon size={16} /> 5 days, 4 nights</span>
          </motion.div>
          <motion.div className="countdown" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.15 }} aria-label="Time until departure">
            {[['days', t.d], ['hrs', t.h], ['min', t.m], ['sec', t.s]].map(([l, v]) => (
              <div key={l} className="cd-box"><b>{String(v).padStart(2, '0')}</b><small>{l}</small></div>
            ))}
            <span className="cd-label">until we leave Lagos</span>
          </motion.div>
          <motion.div className="hero-cta" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3 }}>
            <button className="btn btn-yellow" onClick={() => go('vote')}><Sparkles size={18} /> Cast your vote</button>
            <button className="btn btn-ghost" onClick={() => go('days')}>See the plan</button>
          </motion.div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <motion.div className="art-green" style={{ y: yB }} initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }} />
          <motion.div className="art-red" style={{ y: yA }} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.9 }}>
            <svg viewBox="0 0 300 200" className="swoosh">
              {[0, 1, 2].map((i) => (
                <motion.path key={i} d={`M 40 ${110 + i * 26} Q 160 ${60 + i * 30} 280 ${130 + i * 24}`} fill="none"
                  stroke={['#12806a', '#1c6b6f', '#f1b95a'][i]} strokeWidth="5" strokeLinecap="round"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.9 + i * 0.25, duration: 1.4, ease: 'easeOut' }} />
              ))}
            </svg>
          </motion.div>
          <motion.div className="art-sun" style={{ rotate: rot }} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5, type: 'spring', stiffness: 120, damping: 12 }}>
            <div className="sun-float" />
          </motion.div>
          <motion.div className="art-flag" animate={{ rotate: [-4, 4, -4] }} transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}>
            <i /><span><b /><b /></span>
          </motion.div>
        </div>
      </div>
      <div className="ribbon" aria-hidden="true">
        <div className="ribbon-track">
          {[0, 1].map((k) => (
            <span key={k}>
              {['LAGOS → COTONOU', '23–27 NOV 2026', '5 DAYS · 4 NIGHTS', 'A TRIP TO REMEMBER', 'SCRIPT EXPERIENCE BENIN'].map((s) => (
                <em key={s + k}>{s}<i /></em>
              ))}
            </span>
          ))}
        </div>
      </div>
    </header>
  )
}

/* ───────────── GLANCE ───────────── */
export function Glance() {
  const items = [
    { icon: CalendarDays, k: 'Dates', v: 'Monday 23 – Friday 27 November 2026', c: 'green' },
    { icon: Clock, k: 'Duration', v: '5 days • 4 nights', c: 'yellow', big: true },
    { icon: Home, k: 'Base', v: 'Cotonou, Benin', c: 'red' },
    { icon: MapPin, k: 'Start', v: 'Lagos, Nigeria', c: 'navy' },
  ]
  return (
    <section className="sec" id="glance">
      <div className="wrap">
        <SectionHead kicker="Trip at a glance" title="The key details we are planning around" />
        <div className="glance-grid">
          {items.map((it, i) => (
            <Reveal key={it.k} delay={i * 0.08}>
              <motion.div className={'glance-card c-' + it.c} whileHover={{ y: -8, rotate: i % 2 ? 1 : -1 }} transition={{ type: 'spring', stiffness: 300 }}>
                <it.icon size={26} />
                <small>{it.k}</small>
                {it.big ? <strong><Counter to={5} /> days · <Counter to={4} /> nights</strong> : <strong>{it.v}</strong>}
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ───────────── TRANSPORT ───────────── */
const ROUTE = 'M 40 120 C 200 10, 330 20, 400 85 S 620 160, 760 55'
export function Transport({ votes }) {
  const [a, setA] = useState('hiace')
  const [b, setB] = useState('bus')
  const cheapest = 58200
  return (
    <section className="sec alt" id="transport">
      <div className="wrap">
        <SectionHead kicker="Getting there" title="Two legs, four ways to travel">
          Lagos to the border, then the border to our Airbnb. Pick one option from each leg and the per-person price follows. The group votes on the final pair further down.
        </SectionHead>

        <Reveal className="route-card">
          <div className="meet"><MapPin size={20} /><div><small>The meet-up point</small><strong>Alagomeji, Yaba</strong></div></div>
          <svg viewBox="0 0 800 190" className="route-svg" role="img" aria-label="Route from Alagomeji Yaba through the Seme border to the Airbnb in Cotonou">
            <path d={ROUTE} className="route-bg" />
            <motion.path d={ROUTE} className="route-line" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 2, ease: 'easeInOut' }} />
            {[[40, 120, 'Alagomeji, Yaba', 'Lagos', 'start', 38, 56], [400, 85, 'Seme border', 'Crossing', 'middle', 54, 73], [760, 55, 'Airbnb', 'Cotonou', 'end', -42, -24]].map(([x, y, l, s, anchor, d1, d2]) => (
              <g key={l}>
                <circle cx={x} cy={y} r="11" className="node" />
                <circle cx={x} cy={y} r="4" className="node-core" />
                <text x={x} y={y + d1} textAnchor={anchor} className="node-t">{l}</text>
                <text x={x} y={y + d2} textAnchor={anchor} className="node-s">{s}</text>
              </g>
            ))}
            <g>
              <circle r="9" className="traveler" />
              <circle r="16" className="traveler-halo" />
              <animateMotion dur="7s" repeatCount="indefinite" path={ROUTE} />
            </g>
          </svg>
        </Reveal>

        <div className="legs">
          <Reveal className="leg">
            <h3><Bus size={20} /> Leg 1 · Lagos to the border</h3>
            {LEG1.map((o) => (
              <div className="leg-opt" key={o.id}>
                <div><strong>{o.name}</strong><small>{naira(o.total)} round trip</small></div>
                <b>{naira(o.pp)}<small> per person</small></b>
              </div>
            ))}
          </Reveal>
          <Reveal className="leg" delay={0.1}>
            <h3><Car size={20} /> Leg 2 · Border to the Airbnb</h3>
            {LEG2.map((o) => (
              <div className="leg-opt" key={o.id}>
                <div><strong>{o.name}</strong><small>{cfa(o.totalCfa)} round trip ({naira(o.total)})</small></div>
                <b>{naira(o.pp)}<small> per person</small></b>
              </div>
            ))}
          </Reveal>
        </div>

        <Reveal className="matrix-wrap">
          <h3>Total transport per person</h3>
          <p className="muted">Tap a pair to see it add up.</p>
          <div className="matrix">
            {LEG1.map((x) => LEG2.map((y) => {
              const on = a === x.id && b === y.id
              const total = combo(x.id, y.id)
              return (
                <button key={x.id + y.id} className={'cell ' + (on ? 'on' : '')} onClick={() => { setA(x.id); setB(y.id) }} aria-pressed={on}>
                  <span>{x.name} + {y.name}</span>
                  <b>{naira(total)}</b>
                  {total === cheapest && <em>Lowest</em>}
                </button>
              )
            }))}
          </div>
          <div className="sum-line">
            <span>{LEG1.find((x) => x.id === a).name} {naira(LEG1.find((x) => x.id === a).pp)}</span>
            <span>+</span>
            <span>{LEG2.find((x) => x.id === b).name} {naira(LEG2.find((x) => x.id === b).pp)}</span>
            <span>=</span>
            <strong><Counter key={a + b} to={combo(a, b)} prefix="₦" duration={0.6} /></strong>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ───────────── REQUIREMENTS ───────────── */
const REQ_ICON = { passport: BookUser, yellow: Syringe, cash: Banknote, adapter: Zap, sim: Smartphone }
export function Requirements() {
  const [ticks, setTicks] = useState(() => { try { return JSON.parse(localStorage.getItem('benin26-ticks')) || {} } catch { return {} } })
  const [flip, setFlip] = useState(null)
  const toggle = (id) => setTicks((t) => {
    const n = { ...t, [id]: !t[id] }
    try { localStorage.setItem('benin26-ticks', JSON.stringify(n)) } catch {}
    return n
  })
  const done = REQS.filter((r) => ticks[r.id]).length
  return (
    <section className="sec" id="packing">
      <div className="wrap">
        <SectionHead kicker="Travel requirements" title="Five things to sort before 23 November">
          Tap a card to flip it for a tip. Tick each one off as you get it. Ticks stay on this device only.
        </SectionHead>
        <Reveal className="progress-row">
          <div className="bar"><motion.i animate={{ width: (done / REQS.length) * 100 + '%' }} /></div>
          <b>{done} of {REQS.length} ready</b>
        </Reveal>
        <div className="req-grid">
          {REQS.map((r, i) => {
            const Icon = REQ_ICON[r.id]
            const on = flip === r.id
            return (
              <Reveal key={r.id} delay={i * 0.07}>
                <div className={'flip ' + (on ? 'on' : '')}>
                  <button className="flip-inner" onClick={() => setFlip(on ? null : r.id)} aria-label={r.name + ': tap for tip'}>
                    <span className="face front">
                      {r.img ? <img src={r.img} alt="" loading="lazy" /> : <span className="sim-art"><Smartphone size={54} /><i /></span>}
                      <span className="face-name">{r.name}</span>
                    </span>
                    <span className="face back"><Icon size={30} /><b>{r.name}</b><span>{r.tip}</span></span>
                  </button>
                  <button className={'tick ' + (ticks[r.id] ? 'on' : '')} onClick={() => toggle(r.id)} aria-pressed={!!ticks[r.id]} aria-label={'Mark ' + r.name + ' as ready'}>
                    <Check size={16} />
                  </button>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ───────────── STAY ───────────── */
export function Stay() {
  const total = 2138500
  return (
    <section className="sec alt" id="stay">
      <div className="wrap">
        <SectionHead kicker="Accommodation" title="One Airbnb, five bedrooms, ten of us">
          Two people share each room for the four nights.
        </SectionHead>
        <div className="rooms">
          {[1, 2, 3, 4, 5].map((n) => (
            <Reveal key={n} delay={n * 0.07}>
              <motion.div className="room" whileHover={{ y: -6 }}>
                <small>Room {n}</small>
                <div className="beds"><BedDouble size={30} /><span><Users size={14} /> 2 people</span></div>
              </motion.div>
            </Reveal>
          ))}
        </div>

        <div className="stay-grid">
          <Reveal className="cost-card">
            <h3>Cost breakdown</h3>
            <dl>
              <div><dt>4 nights</dt><dd>{cfa(840000)} <small>({naira(1911000)})</small></dd></div>
              <div><dt>Service fee (refundable)</dt><dd>{cfa(100000)} <small>({naira(227500)})</small></dd></div>
              <div className="tot"><dt>Total cost</dt><dd>{naira(total)}</dd></div>
            </dl>
            <div className="split" aria-hidden="true">
              <motion.i className="s1" initial={{ width: 0 }} whileInView={{ width: (1911000 / total) * 100 + '%' }} viewport={{ once: true }} transition={{ duration: 1.2 }} />
              <motion.i className="s2" initial={{ width: 0 }} whileInView={{ width: (227500 / total) * 100 + '%' }} viewport={{ once: true }} transition={{ duration: 1.2, delay: 0.3 }} />
            </div>
            <div className="legend"><span><i className="s1" />Four nights</span><span><i className="s2" />Refundable fee</span></div>
          </Reveal>

          <Reveal className="pp-card" delay={0.1}>
            <small>Cost per person · 4 nights</small>
            <strong><Counter to={ROOM_PP} prefix="₦" duration={1.8} /></strong>
            <span>Total ÷ 10 people</span>
          </Reveal>

          <Reveal className="note-card" delay={0.15}>
            <h3><ShieldCheck size={20} /> Points to note</h3>
            <p><b>Refundable caution fee.</b> There is a refundable caution fee of ₦22,745 per person.</p>
            <p><b>Electricity.</b> The electricity bill is paid by us and depends on how much we use. It is calculated after the 4 days. The caution fee covers it, and whatever is left is refunded.</p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ───────────── DAYS ───────────── */
const BEAT_ICON = [Luggage, PartyPopper, Camera, Landmark, Plane]
export function Days() {
  const [i, setI] = useState(0)
  const d = DAYS[i]
  const Icon = BEAT_ICON[i]
  return (
    <section className="sec" id="days">
      <div className="wrap">
        <SectionHead kicker="Five-day overview" title="A balanced first draft for 23–27 November" />
        <Reveal className="day-tabs" role="tablist">
          {DAYS.map((x, k) => (
            <button key={x.n} role="tab" aria-selected={k === i} className={'day-tab ' + (k === i ? 'on' : '') + ' t-' + x.color} onClick={() => setI(k)}>
              <small>{x.dow}</small><b>{x.date}</b>
              {k === i && <motion.span layoutId="daydot" className="day-dot" />}
            </button>
          ))}
        </Reveal>
        <div className="day-panel-wrap">
          <AnimatePresence mode="wait">
            <motion.div key={d.n} className={'day-panel t-' + d.color} initial={{ opacity: 0, y: 24, rotateX: -8 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.4 }}>
              <div className="day-head">
                <span className="day-ic"><Icon size={30} /></span>
                <div>
                  <small>Day {d.n} · {d.dow} {d.date} November</small>
                  <h3>{d.title}</h3>
                </div>
                <span className="day-badge">{d.tag}</span>
              </div>
              <p>{d.text}</p>
              <ol className="beats">
                {d.beats.map((b, k) => (
                  <motion.li key={b} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + k * 0.08 }}>
                    <i /><span>{b}</span>
                  </motion.li>
                ))}
              </ol>
              <div className="day-nav">
                <button disabled={i === 0} onClick={() => setI(i - 1)}>Previous day</button>
                <button disabled={i === DAYS.length - 1} onClick={() => setI(i + 1)}>Next day</button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

/* ───────────── EXPLORE (gallery) ───────────── */
export function Explore() {
  const [f, setF] = useState('all')
  const list = STOPS.filter((s) => f === 'all' || (f === 'free' ? !s.cfa : !!s.cfa))
  return (
    <section className="sec alt" id="explore">
      <div className="wrap">
        <SectionHead kicker="Cotonou exploration" title="Where we are going">
          Eight stops on the list. Free ones cost nothing to enter, and two have a small entry fee paid in cash on the day.
        </SectionHead>
        <Reveal className="chips" role="tablist">
          {[['all', 'All eight'], ['free', 'Free entry'], ['paid', 'Paid entry']].map(([k, l]) => (
            <button key={k} role="tab" aria-selected={f === k} className={'chip ' + (f === k ? 'on' : '')} onClick={() => setF(k)}>{l}</button>
          ))}
        </Reveal>
        <motion.div layout className="stops">
          <AnimatePresence mode="popLayout">
            {list.map((s) => (
              <motion.article layout key={s.id} className="stop" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.35 }} whileHover={{ y: -8 }}>
                <div className="stop-img">
                  <img src={s.img} alt={s.name} loading="lazy" />
                  <span className={'price-pill ' + (s.cfa ? 'paid' : 'free')}>{s.cfa ? cfa(s.cfa) : 'Free'}</span>
                </div>
                <div className="stop-body">
                  <div className="stop-top">
                    <h3>{s.name}</h3>
                  </div>
                  <small>{[s.city, s.optional ? 'Optional' : null, s.cfa ? '≈ ' + naira(s.cfa * RATE) : null].filter(Boolean).join(' · ') || 'Entry free'}</small>
                  <p>{s.blurb}</p>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}

/* ───────────── VOTE ───────────── */
const leader = (counts, ids) => ids.reduce((best, id) => ((counts[id] || 0) > (counts[best] || 0) ? id : best), ids[0])
const who = (ballots, test) => {
  const names = ballots.filter(test).map((b) => (b.name || '').trim() || 'A traveller')
  return names
}

function Notice({ votes }) {
  if (votes.err === 'invalid_argument') return <p className="notice warn">Your vote is saved on this device, but this page only accepts shared votes from people with contributor access. Ask the organiser to share it with you as a contributor.</p>
  if (votes.err) return <p className="notice warn">The shared tally could not be reached just now. Your picks are saved on this device and will sync on your next change.</p>
  if (votes.mode === 'local') return <p className="notice">You are in solo mode: picks are saved on this device only. Open the shared link in Claude to count with everyone.</p>
  return <p className="notice ok"><i /> Live tally. Everyone's votes update here as they come in.</p>
}

function Option({ label, sub, price, count, total, on, onClick, icon: Icon }) {
  const pct = total ? Math.round((count / total) * 100) : 0
  return (
    <button className={'vopt ' + (on ? 'on' : '')} onClick={onClick} aria-pressed={on}>
      <motion.i className="vfill" initial={false} animate={{ width: pct + '%' }} transition={{ type: 'spring', stiffness: 90, damping: 18 }} />
      <span className="vic">{Icon && <Icon size={22} />}</span>
      <span className="vtxt"><b>{label}</b><small>{sub}</small></span>
      <span className="vnum"><b>{price}</b><small>{count} {count === 1 ? 'vote' : 'votes'} · {pct}%</small></span>
      <span className="vcheck"><Check size={16} /></span>
    </button>
  )
}

function Leg({ title, sub, options, field, votes, icon }) {
  const { counts, total } = tally(votes.ballots, (b) => b[field])
  const sel = votes.mine[field]
  return (
    <Reveal className="poll">
      <h3>{title}</h3>
      <p className="muted">{sub}</p>
      <div className="vopts">
        {options.map((o) => (
          <Option key={o.id} icon={icon} label={o.name} sub={o.seats} price={naira(o.pp) + ' pp'} count={counts[o.id] || 0} total={total} on={sel === o.id}
            onClick={(e) => { if (sel !== o.id) burstFrom(e); votes.update({ [field]: sel === o.id ? null : o.id }) }} />
        ))}
      </div>
    </Reveal>
  )
}


const LEG_NAME = { hiace: 'Hiace bus', coaster: 'Coaster bus', bus: 'Bus', car: 'Private car' }
function topOf(counts, opts) {
  const max = Math.max(0, ...opts.map((o) => counts[o.id] || 0))
  return { max, winners: max ? opts.filter((o) => (counts[o.id] || 0) === max) : [] }
}
function Winner({ title, opts, tl }) {
  const { max, winners } = topOf(tl.counts, opts)
  const tie = winners.length > 1
  return (
    <div className={'win-card ' + (winners.length ? '' : 'empty')}>
      <small>{title}</small>
      {winners.length === 0 ? <b>No votes yet</b> : <b>{tie ? 'Tie: ' + winners.map((w) => w.name).join(' and ') : winners[0].name}</b>}
      <span>{winners.length ? max + ' of ' + tl.total + (tl.total === 1 ? ' vote' : ' votes') : 'Be the first to vote'}</span>
    </div>
  )
}
function Results({ votes }) {
  const rows = votes.ballots.filter((b) => b.t1 || b.t2).slice().sort((a, b) => (a.at || 0) - (b.at || 0))
  const t1 = tally(rows, (b) => b.t1)
  const t2 = tally(rows, (b) => b.t2)
  const pairs = LEG1.flatMap((x) => LEG2.map((y) => ({ k: x.id + '+' + y.id, a: x, b: y, price: combo(x.id, y.id) })))
  const pc = tally(rows.filter((b) => b.t1 && b.t2), (b) => b.t1 + '+' + b.t2)
  const maxPair = Math.max(0, ...pairs.map((p) => pc.counts[p.k] || 0))
  const leaders = pairs.filter((p) => maxPair && (pc.counts[p.k] || 0) === maxPair)
  return (
    <Reveal className="results">
      <div className="res-head">
        <h3>All votes so far</h3>
        <small>{rows.length} {rows.length === 1 ? 'person' : 'people'} voted · updates live</small>
      </div>
      <div className="win-grid">
        <Winner title="Most picked · Lagos to border" opts={LEG1} tl={t1} />
        <Winner title="Most picked · Border to Airbnb" opts={LEG2} tl={t2} />
        <div className={'win-card price ' + (leaders.length === 1 ? '' : 'empty')}>
          <small>Most picked pair</small>
          {leaders.length === 0 ? <b>No complete pairs yet</b> : leaders.length === 1 ? <b>{naira(leaders[0].price)} per person</b> : <b>Tie between {leaders.length} pairs</b>}
          <span>{leaders.length === 1 ? leaders[0].a.name + ' + ' + leaders[0].b.name : leaders.length ? leaders.map((l) => l.a.name + ' + ' + l.b.name).join(' · ') : 'Needs someone to pick both legs'}</span>
        </div>
      </div>
      <h4>Pairs, ranked by votes</h4>
      <div className="pair-list">
        {pairs.slice().sort((x, y) => (pc.counts[y.k] || 0) - (pc.counts[x.k] || 0) || x.price - y.price).map((p) => {
          const n = pc.counts[p.k] || 0
          const pct = pc.total ? (n / pc.total) * 100 : 0
          return (
            <div key={p.k} className={'pair-row ' + (maxPair && n === maxPair ? 'top' : '')}>
              <motion.i initial={false} animate={{ width: pct + '%' }} transition={{ type: 'spring', stiffness: 90, damping: 18 }} />
              <span>{p.a.name} + {p.b.name}</span>
              <em>{naira(p.price)}</em>
              <b>{n} {n === 1 ? 'vote' : 'votes'}</b>
            </div>
          )
        })}
      </div>
      <h4>Who picked what</h4>
      {rows.length === 0 ? <p className="muted">Nobody has voted yet. Votes appear here the moment they are cast.</p> : (
        <div className="vtable-wrap">
          <table className="vtable">
            <thead><tr><th>Traveller</th><th>Lagos to border</th><th>Border to Airbnb</th><th>Their total</th></tr></thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.id + i}>
                  <td>{(r.name || '').trim() || 'Anonymous traveller'}</td>
                  <td>{LEG_NAME[r.t1] || '-'}</td>
                  <td>{LEG_NAME[r.t2] || '-'}</td>
                  <td>{r.t1 && r.t2 ? naira(combo(r.t1, r.t2)) : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Reveal>
  )
}

export function Vote({ votes }) {
  const { mine, ballots } = votes
  const t1 = tally(ballots, (b) => b.t1)
  const t2 = tally(ballots, (b) => b.t2)
  const lead1 = t1.total ? leader(t1.counts, LEG1.map((x) => x.id)) : null
  const lead2 = t2.total ? leader(t2.counts, LEG2.map((x) => x.id)) : null
  const pick1 = mine.t1 || lead1 || 'hiace'
  const pick2 = mine.t2 || lead2 || 'bus'
  const basis = mine.t1 || mine.t2 ? 'your picks' : lead1 || lead2 ? "the group's lead" : 'the lowest-cost options'
  const transport = combo(pick1, pick2)
  const sub = ROOM_PP + transport
  const left = BUDGET - sub
  const voters = ballots.filter(hasVoted).length
  const [name, setName] = useState(mine.name || '')
  useEffect(() => { if (mine.name && !name) setName(mine.name) }, [mine.name])
  useEffect(() => {
    if ((mine.name || '') === name.trim()) return
    const t = setTimeout(() => votes.update({ name: name.trim() }), 600)
    return () => clearTimeout(t)
  }, [name])

  return (
    <section className="sec vote-sec" id="vote">
      <div className="wrap">
        <SectionHead kicker="Your say" title="Vote on the transport">
          Pick one bus for Lagos to the border and one ride for the border to the Airbnb. The pair with the most votes sets the final transport price. Change your mind any time.
        </SectionHead>
        <Reveal className="vote-top">
          <label className="name-field" htmlFor="voter-name">
            <span>Your name (shown next to your picks)</span>
            <input id="voter-name" type="text" maxLength={24} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Ada" autoComplete="nickname" />
          </label>
          <div className="voters"><Users size={20} /><b><Counter to={voters} duration={0.8} /></b><small>{voters === 1 ? 'traveller has' : 'travellers have'} voted</small></div>
        </Reveal>
        <Notice votes={votes} />

        <div className="polls">
          <Leg title="Leg 1 · Lagos to the border" sub="Round trip. Pick the bus you want to ride." options={LEG1} field="t1" votes={votes} icon={Bus} />
          <Leg title="Leg 2 · Border to the Airbnb" sub="Round trip. Shared bus or a private car." options={LEG2} field="t2" votes={votes} icon={Car} />
        </div>

        <Results votes={votes} />

        <Reveal className="estimate">
          <div className="est-head">
            <h3>Your trip estimate</h3>
            <small>Based on {basis}</small>
          </div>
          <div className="est-rows">
            <div><span>Airbnb, 4 nights</span><b>{naira(ROOM_PP)}</b></div>
            <div><span>{LEG1.find((x) => x.id === pick1).name} + {LEG2.find((x) => x.id === pick2).name}</span><b>{naira(transport)}</b></div>
            <div className="line"><span>Accommodation and transport</span><b>{naira(sub)}</b></div>
            <div><span>Left in the ₦300,000 for passport stamping and miscellaneous</span><b className="pos">{naira(left)}</b></div>
          </div>
          <div className="meter" aria-hidden="true">
            <motion.i className="m1" initial={false} animate={{ width: (ROOM_PP / BUDGET) * 100 + '%' }} />
            <motion.i className="m2" initial={false} animate={{ width: (transport / BUDGET) * 100 + '%' }} />
          </div>
          <div className="legend"><span><i className="m1" />Airbnb</span><span><i className="m2" />Transport</span><span><i className="m3" />Left over</span></div>
        </Reveal>
      </div>
    </section>
  )
}

/* ───────────── PAYMENT ───────────── */
export function Payment() {
  const t = useCountdown(PAY_DEADLINE)
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try { await navigator.clipboard.writeText(ACCOUNT.number); setCopied(true); setTimeout(() => setCopied(false), 1800) } catch { const el = document.getElementById('acct-no'); if (el) { const r = document.createRange(); r.selectNodeContents(el); const s = getSelection(); s.removeAllRanges(); s.addRange(r) } }
  }
  const steps = [
    { k: 'Now', v: 'Start your part payment', c: 'green' },
    { k: '31 Oct', v: 'At least half (₦150,000) in', c: 'yellow' },
    { k: '23 Nov', v: 'We leave Lagos', c: 'red' },
  ]
  return (
    <section className="sec alt" id="pay">
      <div className="wrap">
        <SectionHead kicker="Payment plan" title="Total cost for the trip and payment plans" />
        <div className="pay-grid">
          <Reveal className="price-card">
            <small>Cost per person</small>
            <strong><Counter to={300000} prefix="₦" duration={2} /></strong>
            <ul>
              {['Transport', 'Accommodation', 'Stamping of passport', 'Miscellaneous'].map((x, k) => (
                <motion.li key={x} initial={{ opacity: 0, x: -14 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 + k * 0.1 }}>
                  <Check size={16} />{x}
                </motion.li>
              ))}
            </ul>
          </Reveal>
          <Reveal className="deadline-card" delay={0.1}>
            <small>Part payment deadline</small>
            <h3>At least half by 31 October</h3>
            <p>That secures the apartment. Half of ₦300,000 is ₦150,000.</p>
            <div className="dl-count">
              {t.done ? <b>Deadline passed</b> : <><b>{t.d}</b><span>days</span><b>{String(t.h).padStart(2, '0')}</b><span>hrs</span><b>{String(t.m).padStart(2, '0')}</b><span>min</span></>}
            </div>
          </Reveal>
        </div>

        <Reveal className="timeline">
          {steps.map((s, k) => (
            <motion.div key={s.k} className={'tl-step c-' + s.c} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: k * 0.15 }}>
              <i /><b>{s.k}</b><span>{s.v}</span>
            </motion.div>
          ))}
        </Reveal>

        <Reveal className="account">
          <div className="acct-ic"><Banknote size={28} /></div>
          <div className="acct-main">
            <small>Pay to this account</small>
            <strong id="acct-no">{ACCOUNT.number}</strong>
            <span>{ACCOUNT.name} · {ACCOUNT.bank}</span>
          </div>
          <button className="btn btn-yellow" onClick={copy}>{copied ? <><Check size={18} /> Copied</> : <><Copy size={18} /> Copy number</>}</button>
        </Reveal>
      </div>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="foot">
      <div className="wrap foot-in">
        <div className="foot-flag"><i /><span><b /><b /></span></div>
        <h2>Script Experience Benin 2026</h2>
        <p>A trip to remember.</p>
        <small>Lagos → Cotonou · 23–27 November 2026</small>
        <button className="btn btn-ghost" onClick={() => go('top')}>Back to the top</button>
      </div>
    </footer>
  )
}
