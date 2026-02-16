# Todo

- [x] Create CLAUDE.md with project overview, commands, architecture, and key configuration
- [x] Generate ctx.md context index files (project.ctx.md, components.ctx.md)
- [x] Set up qmd collection with embeddings for semantic search

## SEO Improvements

### Batch 1 — No Dependencies (parallel)
- [x] Step 1: Static crawl files (robots.txt, sitemap.xml)
- [x] Step 2: Meta tags, canonical, OG, JSON-LD in index.html
- [x] Step 3: Install shadcn/ui Accordion
- [x] Step 4: Create FAQ data module
- [x] Step 5: Update security headers
- [x] Step 6: Optimize banner image (649KB → 169KB)

### Batch 2 — After Batch 1
- [x] Step 7: Build FAQ component
- [x] Step 8: Fix heading hierarchy (h3 → h2 in card.tsx)
- [x] Step 9: Add FAQPage JSON-LD
- [x] Step 10: Guard window references for pre-rendering
- [x] Step 11: Code splitting & lazy loading (lazy SignatureVerifier, dynamic bs58, dynamic wallet adapters, WalletContext extraction)

### Batch 3 — After Batch 2
- [x] Step 12: Pre-rendering script (StaticShell + scripts/prerender.tsx + build script update)

### Batch 4 — Verification
- [x] Step 13: Build & verify everything works (build succeeds, pre-rendered HTML verified, preview serves correctly)
