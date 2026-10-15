# Script Experience Benin 2026

Trip site for the Lagos → Cotonou trip, 23–27 November 2026: itinerary, transport options, accommodation, requirements, payment plan and a vote on the transport options.

Built with React, Vite and Framer Motion.

```bash
npm install
npm run dev      # local dev server
npm run build    # single-file build in dist/index.html
```

## Voting

Votes are stored through the Claude artifact database, so the shared tally only works on the Claude-hosted page. When this site is opened anywhere else (for example GitHub Pages or Vercel), voting runs in solo mode and picks are saved on that device only. To share votes on other hosts, replace `useVotes` in `src/hooks.js` with a call to a hosted database.
