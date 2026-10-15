# Script Experience Benin 2026

Trip site for the Lagos → Cotonou trip, 23–27 November 2026: itinerary, transport options, accommodation, requirements, payment plan and a vote on the transport options.

Built with React, Vite and Framer Motion.

```bash
npm install
npm run dev      # local dev server
npm run build    # single-file build in dist/index.html
```

## Voting

Votes are shared through whichever backend is available:

1. The Claude-hosted page uses the Claude artifact database.
2. Anywhere else (Vercel, GitHub Pages, local) the site uses Supabase when it is configured.
3. With neither, voting runs in solo mode and picks stay on that device.

### Set up Supabase (about 5 minutes)

1. Create a free project at supabase.com.
2. Open **SQL Editor**, paste the contents of `supabase.sql`, and run it.
3. Open **Project Settings > API** and copy the **Project URL** and the **anon public** key.
4. Locally, copy `.env.example` to `.env` and fill in both values. On Vercel, add them as environment variables named `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`, then redeploy.

The anon key is meant to be public. The table is read-only to visitors, and votes are written only through the `cast_vote` function, which stores a hash of a per-device token so nobody can overwrite someone else's vote. Run `delete from public.votes;` in the SQL Editor to reset the tally.
