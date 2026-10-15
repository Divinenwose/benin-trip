import React, { useEffect, useRef, useState } from 'react'
import { motion, animate, useInView } from 'framer-motion'

export const Reveal = ({ children, delay = 0, y = 28, className = '', as = 'div', ...rest }) => {
  const M = motion[as]
  return (
    <M className={className} initial={{ opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }} transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }} {...rest}>
      {children}
    </M>
  )
}

export function Counter({ to, prefix = '', suffix = '', duration = 1.6, format }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })
  const [v, setV] = useState(to)
  const first = useRef(true)
  useEffect(() => {
    if (!inView && first.current) { setV(0); return }
    first.current = false
    const c = animate(0, to, { duration, ease: 'easeOut', onUpdate: (x) => setV(x) })
    return () => c.stop()
  }, [inView, to])
  const n = Math.round(v)
  return <span ref={ref}>{prefix}{format ? format(n) : n.toLocaleString('en-NG')}{suffix}</span>
}

export const SectionHead = ({ kicker, title, children }) => (
  <Reveal className="sec-head">
    <span className="kicker">{kicker}</span>
    <h2>{title}</h2>
    {children && <p className="lede">{children}</p>}
  </Reveal>
)

const COLORS = ['#008751', '#fcd116', '#e8112d', '#ffffff']
export function burst(x, y, n = 18) {
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  for (let i = 0; i < n; i++) {
    const el = document.createElement('span')
    const s = 6 + Math.random() * 6
    Object.assign(el.style, {
      position: 'fixed', left: x + 'px', top: y + 'px', width: s + 'px', height: s * (Math.random() > 0.5 ? 1 : 0.5) + 'px',
      background: COLORS[i % COLORS.length], borderRadius: Math.random() > 0.5 ? '50%' : '2px', pointerEvents: 'none', zIndex: 9999,
    })
    document.body.appendChild(el)
    const a = Math.random() * Math.PI * 2
    const d = 50 + Math.random() * 90
    const anim = el.animate(
      [{ transform: 'translate(0,0) rotate(0)', opacity: 1 },
       { transform: `translate(${Math.cos(a) * d}px, ${Math.sin(a) * d + 60}px) rotate(${Math.random() * 540}deg)`, opacity: 0 }],
      { duration: 700 + Math.random() * 500, easing: 'cubic-bezier(.2,.7,.3,1)' })
    anim.onfinish = () => el.remove()
  }
}
export const burstFrom = (e) => {
  const r = e.currentTarget.getBoundingClientRect()
  burst(r.left + r.width / 2, r.top + r.height / 2)
}
