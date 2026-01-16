# Galaxy Defense Wiki

Galaxy Defense Wiki is a comprehensive community-driven database and guide for the Galaxy Defense game. It provides players with detailed information about cards, chips, and boosters, along with tools to share strategies and reports.

## Tech Stack

This project is built using a modern React tech stack, focusing on performance, user experience, and developer productivity.

### Frontend
- **Framework:** [React](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:**
  - [Shadcn/ui](https://ui.shadcn.com/) (built on [Radix UI](https://www.radix-ui.com/))
  - [Lucide React](https://lucide.dev/) (Icons)
- **Routing:** [React Router](https://reactrouter.com/)
- **State Management & Data Fetching:** [TanStack Query (React Query)](https://tanstack.com/query/latest)
- **Forms:** [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) for validation
- **Charts:** [Recharts](https://recharts.org/)
- **Utilities:** [date-fns](https://date-fns.org/), [sonner](https://sonner.emilkowal.ski/) (Toasts)

### Backend
- **BaaS (Backend as a Service):** [Supabase](https://supabase.com/)
  - Authentication
  - Database (PostgreSQL)

## Key Features

- **Card Database:** Browse and search through a complete collection of game cards (Towers, Units, Abilities).
- **Chip Database:** Detailed information on chips used for upgrades and modifications.
- **Reports System:** Authenticated users can submit and view reports (Battle logs, Strategy shares).
- **Booster Information:** Data on available game boosters.
- **User Authentication:** Secure login and registration powered by Supabase.
- **Feature Suggestions:** Community-driven feature request system.
- **Responsive Design:** Fully optimized for both desktop and mobile devices.

## App Possibilities & Future Enhancements

The current architecture supports a wide range of potential future features:

- **Deck Builder:** A tool for players to construct, save, and share their card decks.
- **Damage/DPS Calculator:** Interactive tools to calculate damage output based on card and chip combinations.
- **Community Strategy Guides:** A dedicated section for long-form user-written guides and tutorials.
- **Tier Lists:** Community-voted or expert-curated tier lists for cards and chips.
- **User Profiles:** Enhanced profiles showcasing user contributions, saved decks, and favorite items.
- **Interactive Maps:** Visual guides for game levels with tower placement strategies.
- **Admin Dashboard:** specialized interface for moderators to manage content and users.

## Getting Started

To run this project locally:

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd galaxy-defense
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   # or
   bun dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:8080` (or the port shown in your terminal).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
