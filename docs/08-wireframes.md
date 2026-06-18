# UI/UX Wireframes & Design System

ASCII wireframes (low-fi intent) + the design tokens the code implements.

## Design tokens
- **Color:** background `#070710` (ink) → `#0c0c18`; surfaces = glass `rgba(255,255,255,0.04)` + 1px `rgba(255,255,255,0.08)` border + backdrop-blur. Text `#ECECF1` / muted `#8A8AA0`. Each philosopher/tribe injects one **accent** (CSS var `--accent`) used for glows, bars, sigils.
- **Type:** display = `Fraunces`/`Playfair Display` (serif, for quotes & identity lines); UI = `Geist`/`Inter`. Scale: 12/14/16/20/28/40/64/96.
- **Radius:** 20–28px on cards, pill buttons. **Shadow:** soft, colored by accent at low alpha (the "glow").
- **Motion (Framer Motion):** dissolves (opacity+blur+y), spring `{stiffness 120, damping 18}`; reveal uses staggered children; a persistent animated **starfield/grain** behind everything.

## Landing (cold open)
```
┌───────────────────────────────────────────────┐
│  ✶  ·   THE PHILOSOPHY MACHINE      ·    ✶      │
│                                                 │
│        What do you actually believe?            │   ← serif, 64px
│                                                 │
│   ┌─────────────────────────────────────────┐  │
│   │  A trolley speeds toward five people.    │  │   ← live dilemma
│   │  You can pull a lever to divert it,      │  │     (glass card)
│   │  killing one instead. Do you pull it?    │  │
│   │   [  No, I won't  ]   [  Yes, I pull  ]  │  │
│   └─────────────────────────────────────────┘  │
│        the machine is listening…                │
│   2.4M minds mapped · ★★★★★                     │   ← social proof
└───────────────────────────────────────────────┘
```

## Quiz (the Gauntlet)
```
┌───────────────────────────────────────────────┐
│  ✕                          ·····●····  6/18    │   ← constellation progress
│                                                 │
│   “Is it acceptable to lie to save a life?”     │   ← serif, large
│                                                 │
│   strongly                              strongly│
│   disagree  ◁————————●————————▷          agree  │   ← slider w/ intensity
│                                                 │
│        [ It's complicated / I refuse ]          │
│                                                 │
│   · the machine senses a tension with Q3 ·      │   ← live callout
└───────────────────────────────────────────────┘
```

## Reveal
```
   (suspense: constellation lines animate & connect)
┌───────────────────────────────────────────────┐
│                  ✶  forming…                    │
│            ◍  NIETZSCHE  ◍                       │   ← portrait + glow(accent)
│        “You think like Nietzsche.”              │   ← serif headline
│                                                 │
│   Nietzsche ███████████████░░░░  73%            │
│   Buddha     ████░░░░░░░░░░░░░░  18%            │
│   Camus      ██░░░░░░░░░░░░░░░░   9%            │
│                                                 │
│   ⬡ EXISTENTIALIST tribe   ·   ✦ rarer than 94% │
│                                                 │
│   [  Share my result  ]   [  See full dossier ]│
└───────────────────────────────────────────────┘
```

## Dossier
```
┌───────────────────────────────────────────────┐
│  Your worldview, decoded                        │
│  ── Ethics ─────────●──  you lean consequence   │
│  ── Free will ──●───────  you sense determinism │
│  ── Meaning ────────────● you create meaning    │
│  ...                                            │
│  ⚡ Your core tension:                           │
│     "You crave meaning yet reject the divine."  │
│  🌑 Shadow philosopher: Aquinas-type / Kant     │
│  📖 Read next: Beyond Good and Evil; The Myth…  │
│  ┌─ blurred ───────────────────────────────┐   │
│  │  DEEP REPORT (premium) — unlock          │   │
│  └──────────────────────────────────────────┘   │
└───────────────────────────────────────────────┘
```

## Share hub / Compare / Battle / Daily (intent)
- **Share hub:** preview of the generated card with format toggles (Story / Post / Link); one-tap targets (X, WhatsApp, IG, LinkedIn, Copy link).
- **Compare:** big "81% aligned" ring, per-dimension diverging bars, "where you clash hardest" quote, invite CTA.
- **Battle:** two portraits facing off, vote split bar animating live, "your tribe sides 87% with X," recruit button.
- **Daily:** single dilemma, after-answer global split donut, streak flame + count, countdown to tomorrow.
- **Me (dashboard):** level ring + XP, streak, badge grid (locked = silhouette), results history (premium), referral progress (n/3 → unlock).

## Share card layouts (rendered by `/api/og`)
- **9:16 Story:** centered portrait glow, identity line, 3 blend bars, quote, tribe sigil + rarity badge, footer URL + result code + QR.
- **1.91:1 OG:** left = identity + bars, right = portrait/constellation, bottom strip = tribe + rarity + URL.
- All cards themed by `--accent`; rare/mythic get an extra animated-look gradient + "MYTHIC" ribbon.

## Accessibility & responsiveness
Mobile-first single column; slider operable by tap zones + keyboard; reduced-motion variant disables starfield/parallax; AA contrast on all text over glass; share cards have a light-bg legible variant.
