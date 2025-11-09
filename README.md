## Cocoa Chain – Plant, Track, and Grow

A wallet-connected dashboard for managing cocoa plantations with blockchain integration, analytics, and community features.

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment:**
   ```bash
   cp env.example .env.local
   # Add your Reown Project ID: NEXT_PUBLIC_PROJECT_ID=your_project_id
   ```

3. **Run the app:**
   ```bash
   npm run dev
   ```

Visit [http://localhost:3000](http://localhost:3000/) and connect your wallet to get started.

## Features

### Plantation Management
- Plant seeds, track growth stages (planted → growing → harvested)
- Task management with Kanban board, recurring tasks, and stage-triggered templates
- Yield journal with timeline logging and photo attachments
- Stage gating rules with validation prerequisites
- Bulk stage updates for multiple plantations
- Shared notes with tags and attachments

### Analytics & Reporting
- Dashboard metrics with animated counters
- Regional geo-insights with heat layers
- Yield forecast workspace with scenario projections
- Wallet performance comparison reports
- Cohort-based harvest analytics
- Export to PDF/CSV with customizable sections
- Alert intelligence dashboard

### Operations
- Operations calendar merging task deadlines, stage changes, and forecast harvests
- Task Kanban board with drag & drop and swimlanes
- Recurring task scheduler with templates
- Stage-triggered task automation

### Community & Collaboration
- Help requests system with categories and priorities
- Farmer chat with topic rooms and direct messages
- Wallet reputation scoreboard with badges
- Shared plantation notes with collaborative editing
- Collaboration hub for team management

### Alerts & Notifications
- Multi-channel alerts (in-app, email, SMS stubs)
- Task deadline monitoring
- Stage change notifications
- Wallet activity alerts
- Notification preferences panel

### User Experience
- Global search (⌘K) across plantations, tasks, and requests
- Keyboard shortcuts (⌘? for help)
- Onboarding tour for new users
- Enhanced top bar with quick stats
- Data export/import (JSON/CSV)
- Loading skeletons and smooth animations

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS v4
- **Web3:** Reown AppKit + wagmi + viem
- **State:** Zustand with localStorage persistence
- **Animations:** Framer Motion
- **Charts:** Chart.js + react-chartjs-2
- **Export:** jsPDF for PDF generation

## Data Persistence

- Plantations, tasks, and settings stored in `localStorage`
- Seed data in `src/data/plantations.json` and `src/data/engagement.json`
- All stores use Zustand with persistence middleware

## Scripts

- `npm run dev` – Development server
- `npm run build` – Production build
- `npm run start` – Run production build
- `npm run lint` – Run ESLint

## Project Structure

- `src/app/` – Next.js pages and layouts
- `src/components/` – React components
- `src/store/` – Zustand state stores
- `src/lib/` – Utilities (analytics, alerts, export, animations)
- `src/data/` – Seed data files
