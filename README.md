## Cocoa Chain – Plant, Track, and Grow

Cocoa Chain is a wallet-connected dashboard for planting, tracking, and visualising digital cocoa plantations. It runs on Next.js (App Router) with Tailwind CSS, Reown AppKit (WalletConnect), wagmi, Zustand, and Framer Motion.

## Prerequisites

- Node.js 18+
- npm 9+
- Reown (WalletConnect) Project ID – create one at [reown.com](https://reown.com/) and copy the **Project ID**

## Environment Setup

1. Copy `env.example` to `.env.local`:

   ```bash
   cp env.example .env.local
   ```

2. Replace the placeholder value with your Reown AppKit Project ID:

   ```bash
   NEXT_PUBLIC_PROJECT_ID=REPLACE_WITH_REOWN_PROJECT_ID
   ```

This variable enables WalletConnect/AppKit across the app. Without it, the dashboard will throw an error on boot.

## Install Dependencies

```bash
npm install
```

## Run the App

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000/) to see the dashboard.

The default landing page becomes the Cocoa Chain experience once the UI components are scaffolded (see project plan).

## Core Features

### Plantation Management
- **Plantation Dashboard**: Comprehensive dashboard with grid/list views, filtering, sorting, and search
- **Plant Seed Modal**: Create new plantations with location, area, and initial stage configuration
- **Stage Management**: Update growth stages (seedling → vegetative → flowering → fruiting → harvest)
- **Bulk Operations**: Bulk stage advancement and multi-plantation selection
- **Plantation Cards**: Rich cards displaying health scores, age, urgent tasks, and progress indicators
- **Plantation Insights**: AI-powered insights and recommendations for plantation optimization
- **Favorites System**: Star and spotlight favorite plantations with aggregated metrics
- **Notes System**: Add and manage notes for individual plantations
- **Plantation Templates**: Pre-configured templates for quick plantation creation
- **Stage Gating**: Validation rules for stage transitions

### Task Management
- **Task Planner**: Create, assign, and track tasks with due dates and priorities
- **Recurring Tasks**: Schedule recurring tasks with flexible intervals
- **Task Kanban Board**: Visual task management with drag-and-drop
- **Task Status Tracking**: Track pending, in-progress, completed, and cancelled tasks
- **Urgent Task Detection**: Automatic detection and highlighting of overdue tasks
- **Task Analytics**: Task completion rates and productivity metrics

### Analytics & Reporting
- **Growth Analytics Hub**: Charts and visualizations for plantation growth trends
- **Yield Forecast**: Predictive analytics for harvest windows and yield estimates
- **Cohort Analysis**: Track plantations by cohort and growth stage
- **Dashboard Metrics**: Real-time KPIs including total seeds, harvested, growing, carbon offsets
- **Statistics Summary**: Comprehensive statistical overview with distributions and trends
- **Carbon Efficiency Metrics**: Per-tree and per-hectare carbon offset calculations
- **Forecast Workspace**: Advanced forecasting tools with multiple scenarios
- **Export Analytics**: Export data in CSV, JSON, and Excel formats

### Sustainability & Environmental
- **Sustainability Panel**: Track tree coverage, land use, and environmental impact
- **Carbon Offset Tracking**: Calculate and visualize carbon offsets per plantation
- **Tree Count Analytics**: Monitor tree protection and growth metrics
- **Environmental Insights**: Geo-insights and regional environmental data

### Collaboration & Community
- **Collaboration Hub**: Add collaborators, assign roles, and manage permissions
- **Shared Notes Panel**: Collaborative note-taking for plantations
- **Community Share Panel**: Share updates and achievements with the community
- **Farmer Chat Panel**: Communication tools for collaborators
- **Help Requests**: Request and track help from the community
- **Community Support**: File complaints and track resolution status

### Financial Management
- **Receipts Ledger**: Upload, store, and manage financial receipts
- **Receipt History**: View and search receipt history
- **Loan Tracker**: Request and track cooperative loans
- **Loan Request Workflow**: Complete loan application and approval process
- **Financial Dashboard**: Overview of financial transactions and expenses
- **Market Prices**: Track commodity prices and market trends

### Security & Monitoring
- **Security Panel**: Comprehensive security monitoring and controls
- **Session Guard**: Automatic session locking with countdown warnings
- **Security Events Log**: Track and audit security-related events
- **Security Monitor**: Real-time security monitoring and alerts
- **Risk Detection**: Identify and flag potential security risks
- **Activity Timeline**: Complete audit trail of user actions

### Wallet Integration
- **Wallet Manager**: Connect and manage multiple wallets
- **Wallet Performance**: Track plantation counts, harvest conversion, and carbon footprint per wallet
- **Wallet Reputation**: Reputation scoring based on plantation performance
- **Multi-wallet Dashboard**: View plantations across multiple connected wallets
- **Watchlist Management**: Add wallets to watchlist with custom labels

### Operations & Planning
- **Operations Calendar**: Calendar view for tasks, harvests, and events
- **Harvest Planner**: Plan and schedule harvest operations
- **Resource Allocation**: Allocate resources across plantations
- **Inventory Panel**: Track equipment and supplies
- **Equipment Tracker**: Monitor equipment usage and maintenance
- **Supply Chain Tracker**: Track supply chain operations
- **Yield Journal**: Document and track yield data over time

### Data Management
- **Data Export**: Export plantations, tasks, and analytics data
- **Data Import**: Import data from various formats
- **Data Management Panel**: Centralized data management interface
- **Document Library**: Store and manage plantation-related documents
- **Certification Manager**: Track and manage certifications

### User Experience
- **Dark Theme Support**: Full dark mode with system preference detection
- **Keyboard Shortcuts**: Power user shortcuts for common actions
- **Onboarding Tour**: Guided tour for new users
- **Global Search**: Search across plantations, tasks, and notes
- **Advanced Filters**: Multi-criteria filtering with presets
- **Quick Actions**: Quick access to common operations
- **Notification Preferences**: Customize alert and notification settings
- **Settings Panel**: Comprehensive application settings

### Alerts & Notifications
- **Alert Manager**: Centralized alert management system
- **Alert Toaster**: Toast notifications for real-time alerts
- **Alert Insights**: Actionable insights from alert patterns
- **Task Deadline Alerts**: Automatic alerts for upcoming and overdue tasks
- **Stage Change Notifications**: Notify on plantation stage transitions
- **Weather Alerts**: Weather-based alerts and recommendations

### Geospatial Features
- **Global Footprint Map**: Interactive map showing all plantations
- **Geo Insights Panel**: Regional insights and analytics
- **Location-based Filtering**: Filter plantations by location
- **Carbon-weighted Markers**: Visualize carbon impact on map

### Additional Features
- **On-chain Sync**: Simulate and visualize blockchain transactions
- **Status Indicators**: Visual status indicators for plantations and tasks
- **Progress Tracking**: Visual progress bars and indicators
- **Animated Counters**: Smooth number animations for metrics
- **Loading States**: Skeleton loaders and spinners
- **Empty States**: Helpful empty state messages
- **Confirmation Dialogs**: User-friendly confirmation modals

## Tech Stack

- Next.js 16 (App Router)
- Tailwind CSS v4 + custom Cocoa Chain theme
- Reown AppKit + wagmi + viem
- Zustand for state management
- Framer Motion for animated UI
- TanStack Query for Wallet/Web3 caching
- Chart.js + react-chartjs-2 for analytics visuals
- d3-geo + world-atlas + topojson-client for geospatial rendering
- date-fns for timeline formatting and scheduling utilities
- Local security store for guardrails, risk detection, and audit events
- Engagement store (receipts, complaints, loans) for finance and support flows backed by local JSON seed data
- Local JSON + localStorage hydration for prototype data persistence

## Analytics Snapshot Overview

- **Forecast Panel:** blends yield checkpoints, growth velocities, and cohort metrics to surface upcoming harvest opportunities.
- **Global Footprint Map:** plots every plantation with carbon-weighted markers and highlights top offset regions.
- **Wallet Performance:** aggregates plantation counts, harvest conversion, carbon footprint, and outstanding tasks per wallet.
- **Collaboration Hub:** centralises collaborator insights, lets you add new contributors, and log notes that feed the activity timeline.
- **Activity Timeline:** time-orders stages, yield events, tasks, and collaboration updates for rapid situational awareness.

## Alerts

- Task deadlines are scanned every five minutes; alerts fire when a task is due in the next 24 hours or becomes overdue.
- Plantation stage changes and wallet activity (connect/disconnect, watchlist updates) publish alerts instantly.
- Delivery channels default to in-app + toast notifications, with stubbed email/SMS senders logging to the console (`src/lib/notifiers.ts`).
- Channel preferences and alert state live in `src/store/alerts.ts`. Hook up real providers by swapping the notifier implementations.

## Mock Data

- Source plantations live in `src/data/plantations.json`.
- Finance, support, and loan samples are seeded from `src/data/engagement.json`.
- State is persisted to `localStorage` via Zustand so dashboard changes survive reloads.
- Reset behaviour: clearing browser storage reverts to seed data.

## Scripts

- `npm run dev` – start the local dev server
- `npm run build` – build for production
- `npm run start` – run the compiled app
- `npm run lint` – run ESLint checks (passes on the current codebase)
