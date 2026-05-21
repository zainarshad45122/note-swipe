# NoteSwipe — Product Context

> Living document for humans and AI agents. Update phase/step status as work progresses.

## Overview

**NoteSwipe** is a motion-first, swipe-based note-taking app where every piece of content is a **card**. Users create, organize, and interact with text, image, voice, and video notes. Cards group into **notebooks**; notebooks can later be private/password-protected.

**Goal:** Fast, intuitive, Gen Z–style experience — quick capture, swipe navigation, media-rich notes, offline-first.

**UI reference:** Light and dark home mockups in the project assets (card stack, filter chips, gesture hints, floating bottom nav with central **+**).

---

## Core Principles

1. **Everything is a card** — unified content model
2. **Swipe-first navigation** — horizontal between cards, vertical for feed/actions
3. **Fast capture** — minimal friction
4. **Media-native notes** — text, image, voice, video (Phase 2+)
5. **Offline-first** — local persistence; sync optional later
6. **Clean, minimal, motion-rich UI**
7. **Performance-first** — smooth motion and interactions are non-negotiable; target **60–120 FPS** on supported devices

---

## Performance

Performance is a **high priority** across every phase — not a late polish pass.

- **Frame rate:** Maintain **60 FPS** as the baseline; aim for **120 FPS** on high-refresh displays (ProMotion, 120 Hz Android) where the device and OS allow it.
- **Animations:** Swipes, transitions, and micro-interactions must feel fluid — use the UI thread (Reanimated), avoid jank from heavy JS work during gestures, and keep layout stable while cards move.
- **Gestures:** Deck scrolling, snap-to-card, and swipe actions should track the finger with minimal latency; no stutter when switching cards or notebooks.
- **Startup & navigation:** Fast cold start, snappy tab/screen transitions, and responsive tap feedback.
- **Lists & media:** Virtualize long feeds where needed; lazy-load images/video; defer non-critical work off the interaction path.

**Agent note:** Profile on real devices (not only simulators). If an animation or screen drops frames, treat it as a bug alongside functional issues.

---

## Data Model

### Card

| Field        | Type                                      | Notes               |
| ------------ | ----------------------------------------- | ------------------- |
| `id`         | string                                    | Unique              |
| `type`       | `"text" \| "image" \| "voice" \| "video"` | Phase 1: text only  |
| `content`    | string \| fileUri \| metadata             | Type-dependent      |
| `createdAt`  | ISO date                                  |                     |
| `updatedAt`  | ISO date                                  |                     |
| `notebookId` | string \| null                            | Optional assignment |
| `isPinned`   | boolean                                   | Phase 3             |
| `tags`       | string[]                                  | Optional; Phase 3   |

### Notebook

| Field          | Type     | Notes               |
| -------------- | -------- | ------------------- |
| `id`           | string   | Unique              |
| `title`        | string   |                     |
| `description`  | string?  | Optional            |
| `isPrivate`    | boolean  | Phase 4             |
| `passwordHash` | string?  | If private; Phase 4 |
| `createdAt`    | ISO date |                     |

**Architectural rule:** All features extend the Card abstraction — do not build parallel note systems per media type.

---

## Tech Stack

| Layer       | Choice                                                      | Status                    |
| ----------- | ----------------------------------------------------------- | ------------------------- |
| Framework   | Expo 56 + React Native                                      | ✅ In repo                |
| Routing     | Expo Router                                                 | ✅ In repo                |
| Animations  | Reanimated + Gesture Handler (UI-thread, 60–120 FPS target) | ✅ Dependencies installed |
| State       | Zustand or Redux Toolkit (lightweight preferred)            | ⬜ Not added              |
| Storage     | SQLite (preferred)                                          | ⬜ Not added              |
| Media files | Expo FileSystem                                             | ⬜ Phase 2                |
| Camera / AV | expo-camera, expo-av                                        | ⬜ Phase 2                |

**Agent note:** See [AGENTS.md](./AGENTS.md) — use Expo v56 docs: https://docs.expo.dev/versions/v56.0.0/

---

## Phase & Step Tracker

Status legend: `⬜ Not started` · `🟡 In progress` · `✅ Done` · `⏭ Deferred`

### Phase 1 — MVP (Core Swipe Notes) — **CURRENT FOCUS**

**Goal:** Create cards, swipe through them, organize into notebooks, persist locally.

| Step | Feature                                           | Status                                |
| ---- | ------------------------------------------------- | ------------------------------------- |
| 1.1  | Card model + types (text)                         | ⬜                                    |
| 1.2  | Create / edit / delete text cards                 | ⬜                                    |
| 1.3  | Local storage (SQLite)                            | ⬜                                    |
| 1.4  | Full-screen swipe deck (horizontal, snap-to-card) | ⬜                                    |
| 1.5  | Notebook model + CRUD                             | ⬜                                    |
| 1.6  | Assign cards to notebooks                         | ⬜                                    |
| 1.7  | Filter cards by notebook                          | ⬜                                    |
| 1.8  | Home screen — card stack / feed                   | ⬜                                    |
| 1.9  | Notebook screen                                   | ⬜                                    |
| 1.10 | Simple card viewer                                | ⬜                                    |
| 1.11 | Basic navigation shell (tabs aligned to product)  | 🟡 Starter tabs only (Home / Explore) |

**MVP done when:** User can create a card → swipe smoothly at 60 FPS (no dropped frames on mid-range devices) → assign to notebook → data persists after restart.

---

### Phase 2 — Media Notes

**Goal:** Multi-media capture and playback.

| Step | Feature                          | Status |
| ---- | -------------------------------- | ------ |
| 2.1  | Camera image capture + preview   | ⬜     |
| 2.2  | Image cards + storage            | ⬜     |
| 2.3  | Voice record + playback UI       | ⬜     |
| 2.4  | Voice cards                      | ⬜     |
| 2.5  | Short video record + inline play | ⬜     |
| 2.6  | Video cards                      | ⬜     |
| 2.7  | File storage abstraction         | ⬜     |
| 2.8  | Compression strategy             | ⬜     |
| 2.9  | Thumbnails (image/video)         | ⬜     |
| 2.10 | Waveform for voice (optional)    | ⏭     |

---

### Phase 3 — Organization & Intelligence

**Goal:** Structure, search, and smart surfacing.

| Step | Feature                   | Status |
| ---- | ------------------------- | ------ |
| 3.1  | Tags on cards             | ⬜     |
| 3.2  | Filter by tags            | ⬜     |
| 3.3  | Search by content         | ⬜     |
| 3.4  | Search by notebook / tags | ⬜     |
| 3.5  | Suggested notebooks       | ⬜     |
| 3.6  | Recently used cards       | ⬜     |
| 3.7  | Pin cards                 | ⬜     |
| 3.8  | Pin notebooks             | ⬜     |

---

### Phase 4 — Private Notebooks

**Goal:** Secure storage for sensitive notes.

| Step | Feature                                  | Status |
| ---- | ---------------------------------------- | ------ |
| 4.1  | Mark notebook private                    | ⬜     |
| 4.2  | Lock / unlock (PIN or password)          | ⬜     |
| 4.3  | Auto-lock after inactivity               | ⬜     |
| 4.4  | Encrypted local storage for private data | ⬜     |

---

### Phase 5 — Motion & Experience

**Goal:** Premium, addictive feel — must meet [Performance](#performance) targets (60–120 FPS, no janky swipes).

| Step | Feature                                        | Status |
| ---- | ---------------------------------------------- | ------ |
| 5.1  | Card stack physics                             | ⬜     |
| 5.2  | Spring-based transitions                       | ⬜     |
| 5.3  | Parallax swipe effects                         | ⬜     |
| 5.4  | Multi-direction gestures                       | ⬜     |
| 5.5  | Context swipe actions (e.g. archive, organize) | ⬜     |
| 5.6  | Haptics                                        | ⬜     |
| 5.7  | Micro-interactions + screen transitions        | ⬜     |

---

### Phase 6 — Sync & Cloud (Optional)

**Goal:** Multi-device and backup.

| Step | Feature                        | Status |
| ---- | ------------------------------ | ------ |
| 6.1  | User accounts                  | ⬜     |
| 6.2  | Cloud sync (cards + notebooks) | ⬜     |
| 6.3  | Export / backup                | ⬜     |
| 6.4  | Restore from backup            | ⬜     |
| 6.5  | Real-time sync (optional)      | ⏭     |

---

## Screen Map (Target UX)

| Screen                                               | Phase | Status                     |
| ---------------------------------------------------- | ----- | -------------------------- |
| Home — greeting, filters, card stack, gesture hints  | 1     | ⬜                         |
| Notebooks list / detail                              | 1     | ⬜                         |
| Card create / edit                                   | 1     | ⬜                         |
| Card full-screen viewer                              | 1     | ⬜                         |
| Bottom nav: Home, Notebooks, **+**, Capture, Profile | 1–2   | 🟡 Partial (2-tab starter) |
| Search                                               | 3     | ⬜                         |
| Private notebook unlock                              | 4     | ⬜                         |

---

## Current Repo Snapshot

_Last updated: May 2026_

- Expo 56 with themed components (`themed-text`, `themed-view`, `theme.ts`) and light/dark `ThemeProvider`
- Tabs: **Home** (shows “NoteSwipe”) and **Explore** (placeholder) via `app-tabs` / `app-tabs.web`
- Starter demo UI removed (splash overlay, collapsibles, external links, tutorial content)
- No Card/Notebook store, SQLite, swipe deck, or product screens yet
- Reanimated + Gesture Handler installed and ready for Phase 1 deck

**Suggested Phase 1 build order:** types → SQLite → store → swipe deck on Home → notebooks + filter → create/edit card → align tabs with mockup nav.

---

## Future Vision

NoteSwipe evolves toward a personal memory system, media-first note ecosystem, and swipe-based productivity surface — not a traditional folder-based notes app.

---

## How to Update This File

When completing work:

1. Change the relevant step status in the phase table.
2. Update **Current Repo Snapshot** if structure or dependencies change.
3. Keep **Phase 1** as `CURRENT FOCUS` until MVP criteria are met.
