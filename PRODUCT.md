# NoteSwipe — Product Context

> Living document for humans and AI agents. Update phase/step status as work progresses.

## Overview

**NoteSwipe** is a motion-first, swipe-based note-taking app where every piece of content is a **note**. Users create, organize, and interact with text, image, voice, and video notes. Notes group into **notebooks**; notebooks can later be private/password-protected.

**Goal:** Fast, intuitive, Gen Z–style experience — quick capture, swipe navigation, media-rich notes, offline-first.

**UI reference:** Light and dark home mockups in the project assets (note stack, filter chips, gesture hints, floating bottom nav with central **+**).

---

## Core Principles

1. **Everything is a note** — unified content model
2. **Swipe-first navigation** — horizontal between notes, vertical for feed/actions
3. **Fast capture** — minimal friction
4. **Media-native notes** — text, image, voice, video (Phase 2+)
5. **Offline-first** — local persistence; sync optional later
6. **Clean, minimal, motion-rich UI**
7. **Performance-first** — smooth motion and interactions are non-negotiable; target **60–120 FPS** on supported devices

---

## Performance

Performance is a **high priority** across every phase — not a late polish pass.

- **Frame rate:** Maintain **60 FPS** as the baseline; aim for **120 FPS** on high-refresh displays (ProMotion, 120 Hz Android) where the device and OS allow it.
- **Animations:** Swipes, transitions, and micro-interactions must feel fluid — use the UI thread (Reanimated), avoid jank from heavy JS work during gestures, and keep layout stable while notes move.
- **Gestures:** Deck scrolling, snap-to-note, and swipe actions should track the finger with minimal latency; no stutter when switching notes or notebooks.
- **Startup & navigation:** Fast cold start, snappy tab/screen transitions, and responsive tap feedback.
- **Lists & media:** Virtualize long feeds where needed; lazy-load images/video; defer non-critical work off the interaction path.

**Agent note:** Profile on real devices (not only simulators). If an animation or screen drops frames, treat it as a bug alongside functional issues.

---

## Data Model

### Note

| Field        | Type                                      | Notes                                                                 |
| ------------ | ----------------------------------------- | --------------------------------------------------------------------- |
| `id`         | string                                    | Unique                                                                |
| `type`       | `"text" \| "image" \| "voice" \| "video"` | Phase 1: text only                                                    |
| `content`    | string \| fileUri \| metadata             | Phase 1 text: HTML body (rich text + color); **no separate title**    |
| `textColor`  | string?                                   | Phase 1 text: user-selected swatch color (default = theme text)     |
| `createdAt`  | ISO date                                  |                                                                       |
| `updatedAt`  | ISO date                                  |                                                                       |
| `notebookId` | string \| null                            | Optional assignment                                                   |
| `isPinned`   | boolean                                   | Phase 3                                                               |
| `tags`       | string[]                                  | Optional; Phase 3                                                     |

**Phase 1 text notes — content rules:**

- **One field only:** the note body. No title, no excerpt/preview field, no auto-summary.
- **Create & edit:** same UI — the **Create Note** bottom sheet (`CreateNoteSheet`). Tapping **+** opens it empty; tapping a note in the deck opens it pre-filled for update.
- **Rich text:** bold, italic, bullet list, numbered list; up to **2000** characters (plain-text count).
- **Color:** user picks a text color via the color picker in the sheet; stored on the note and applied when rendering.

**Deck card display (read surface):**

- Show the note **as written** — same formatting and text color as in the editor, not a plain-text summary.
- **Fit what you can:** within the fixed card, render as much content as fits (adaptive type size + line clamp). Append **`…`** when content is truncated.
- **No separate viewer screen** in Phase 1 — the card is a glance/read viewport; full note opens in the create/edit sheet on tap.

**Architectural rule:** Do not introduce a parallel preview/title layer. Deck truncation is a **layout** concern only; `content` remains the single source of truth.

### Notebook

| Field          | Type     | Notes               |
| -------------- | -------- | ------------------- |
| `id`           | string   | Unique              |
| `title`        | string   |                     |
| `description`  | string?  | Optional            |
| `isPrivate`    | boolean  | Phase 4             |
| `passwordHash` | string?  | If private; Phase 4 |
| `createdAt`    | ISO date |                     |

**Architectural rule:** All features extend the Note abstraction — do not build parallel content models per media type.

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

**Goal:** Create notes, swipe through them, organize into notebooks, persist locally.

| Step | Feature                                           | Status                                |
| ---- | ------------------------------------------------- | ------------------------------------- |
| 1.1  | Note model + types (text, HTML body, color)       | 🟡 Types partial; persistence pending |
| 1.2  | Create / edit text notes (single sheet, no title) | 🟡 Create UI; edit-on-tap pending     |
| 1.3  | Local storage (SQLite)                            | ⬜                                    |
| 1.4  | Full-screen swipe deck (horizontal, snap-to-note) | 🟡 Deck UI; HTML render pending       |
| 1.5  | Notebook model + CRUD                             | ⬜                                    |
| 1.6  | Assign notes to notebooks                         | 🟡 Picker UI stub in create sheet     |
| 1.7  | Filter notes by notebook                          | ⬜                                    |
| 1.8  | Home screen — note stack / feed                   | 🟡 Home + deck                        |
| 1.9  | Notebook screen                                   | ⬜                                    |
| 1.10 | Deck card — formatted body, fit + ellipsis        | ⬜                                    |
| 1.11 | Tap deck note → open create sheet in edit mode    | ⬜                                    |
| 1.12 | Basic navigation shell (tabs aligned to product)  | 🟡 Partial (Home / Notebooks / Profile) |

**MVP done when:** User can create a note → see it in the deck (formatted, truncated with `…` if needed) → tap to edit in the same sheet → assign to notebook → data persists after restart → swipe smoothly at 60 FPS.

---

### Phase 2 — Media Notes

**Goal:** Multi-media capture and playback.

| Step | Feature                          | Status |
| ---- | -------------------------------- | ------ |
| 2.1  | Camera image capture + preview   | ⬜     |
| 2.2  | Image notes + storage            | ⬜     |
| 2.3  | Voice record + playback UI       | ⬜     |
| 2.4  | Voice notes                      | ⬜     |
| 2.5  | Short video record + inline play | ⬜     |
| 2.6  | Video notes                      | ⬜     |
| 2.7  | File storage abstraction         | ⬜     |
| 2.8  | Compression strategy             | ⬜     |
| 2.9  | Thumbnails (image/video)         | ⬜     |
| 2.10 | Waveform for voice (optional)    | ⏭     |

---

### Phase 3 — Organization & Intelligence

**Goal:** Structure, search, and smart surfacing.

| Step | Feature                   | Status |
| ---- | ------------------------- | ------ |
| 3.1  | Tags on notes             | ⬜     |
| 3.2  | Filter by tags            | ⬜     |
| 3.3  | Search by content         | ⬜     |
| 3.4  | Search by notebook / tags | ⬜     |
| 3.5  | Suggested notebooks       | ⬜     |
| 3.6  | Recently used notes       | ⬜     |
| 3.7  | Pin notes                 | ⬜     |
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
| 5.1  | Note stack physics                             | ⬜     |
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
| 6.2  | Cloud sync (notes + notebooks) | ⬜     |
| 6.3  | Export / backup                | ⬜     |
| 6.4  | Restore from backup            | ⬜     |
| 6.5  | Real-time sync (optional)      | ⏭     |

---

## Screen Map (Target UX)

| Screen                                               | Phase | Status                     |
| ---------------------------------------------------- | ----- | -------------------------- |
| Home — greeting, filters, note stack, gesture hints  | 1     | 🟡 Deck on Home             |
| Notebooks list / detail                              | 1     | ⬜                         |
| Note create / edit (shared bottom sheet)             | 1     | 🟡 Create UI; edit pending |
| Bottom nav: Home, Notebooks, **+**, Profile          | 1–2   | 🟡 Partial                 |
| Search                                               | 3     | ⬜                         |
| Private notebook unlock                              | 4     | ⬜                         |

**Note create / edit flow:** One bottom sheet for both modes. **Create:** FAB **+** → empty sheet. **Edit:** tap note in deck → same sheet with full content, notebook, and color; save updates the note. No dedicated read-only viewer in Phase 1.

---

## Current Repo Snapshot

_Last updated: May 2026_

- Expo 56 with themed components (`themed-text`, `themed-view`, `theme.ts`) and light/dark `ThemeProvider`
- Tabs: **Home**, **Notebooks**, **Profile** + FAB create via `app-tabs` / `BottomNavBar`
- **Note deck:** horizontal swipe deck on Home (`NoteDeck`, card components)
- **Create note:** full-height `CreateNoteSheet` — rich editor, formatting toolbar, notebook/color pickers in sub-sheets; persistence not wired yet
- **Deck card (`Note`):** plain-text display today; target is HTML + color, fit-to-card with ellipsis, tap → edit sheet
- No SQLite / store yet; mock notes on Home
- Reanimated + Gesture Handler in use for deck

**Suggested Phase 1 build order:** finalize note types (HTML + color, no title) → SQLite + store → wire create/save → deck HTML render + ellipsis → tap-to-edit sheet → notebooks + filter.

---

## Future Vision

NoteSwipe evolves toward a personal memory system, media-first note ecosystem, and swipe-based productivity surface — not a traditional folder-based notes app.

---

## How to Update This File

When completing work:

1. Change the relevant step status in the phase table.
2. Update **Current Repo Snapshot** if structure or dependencies change.
3. Keep **Phase 1** as `CURRENT FOCUS` until MVP criteria are met.
