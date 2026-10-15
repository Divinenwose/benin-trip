import React, { useEffect, useState } from 'react'
import { MotionConfig, motion, useScroll, useSpring } from 'framer-motion'
import { Sun, Moon, Vote as VoteIcon } from 'lucide-react'
import { Hero, Glance, Transport, Requirements, Stay, Days, Explore, Vote, Payment, Footer } from './sections.jsx'
import { useVotes } from './hooks.js'

const LINKS = [['glance', 'Overview'], ['transport', 'Getting there'], ['packing', 'Pack'], ['stay', 'Stay'], ['days', 'Days'], ['explore', 'Explore'], ['vote', 'Vote bus'], ['pay', 'Pay']]

function useTheme() {
  const [theme, setTheme] = useState(() => { try { return localStorage.getItem('benin26-theme') } catch { return null } })
  useEffect(() => {
    const r = document.documentElement
    if (theme) r.setAttribute('data-theme', theme); else r.removeAttribute('data-theme')
    try { theme ? localStorage.setItem('benin26-theme', theme) : localStorage.removeItem('benin26-theme') } catch {}
  }, [theme])
  const isDark = theme ? theme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches
  return [isDark, () => setTheme(isDark ? 'light' : 'dark')]
}

export default function App() {
  const votes = useVotes()
  const [dark, flip] = useTheme()
  const [active, setActive] = useState('')
  const { scrollYProgress } = useScroll()
  const w = useSpring(scrollYProgress, { stiffness: 120, damping: 24 })
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: '-45% 0px -50% 0px' })
    LINKS.forEach(([id]) => { const el = document.getElementById(id); el && io.observe(el) })
    return () => io.disconnect()
  }, [])
  return (
    <MotionConfig reducedMotion="user">
      <motion.div className="progress" style={{ scaleX: w }} />
      <nav className="nav">
        <div className="nav-in">
          <button className="brand" onClick={() => document.getElementById('top')?.scrollIntoView({ behavior: 'smooth' })} aria-label="Back to the top">
            <span className="mini-flag"><i /><b /><b /></span><span className="brand-t">Script Benin 26</span>
          </button>
          <div className="nav-links">
            {LINKS.map(([id, l]) => (
              <button key={id} className={active === id ? 'on' : ''} onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })}>{l}</button>
            ))}
          </div>
          <button className="theme-btn" onClick={flip} aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}>{dark ? <Sun size={18} /> : <Moon size={18} />}</button>
        </div>
      </nav>
      <main>
        <Hero />
        <Glance />
        <Transport votes={votes} />
        <Requirements />
        <Stay />
        <Days />
        <Explore />
        <Vote votes={votes} />
        <Payment />
      </main>
      <Footer />
      <motion.button className="fab" onClick={() => document.getElementById('vote')?.scrollIntoView({ behavior: 'smooth' })}
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2, type: 'spring' }} whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }}>
        <VoteIcon size={18} /> Vote
      </motion.button>
    </MotionConfig>
  )
}
