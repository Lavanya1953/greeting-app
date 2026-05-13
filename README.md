Custom Greetings & Wishes App

Web app for the internship task: personalized greeting cards with your **name** and **profile photo** overlaid on template backgrounds, **free vs premium** templates, and **share** (merged PNG via native share or download).

## Features (PRD)

- **Authentication**: Continue with Google (demo stub), email (local demo), or guest.
- **Profile**: Display name and profile photo (or default avatar).
- **Home**: Categories (Birthday, Anniversary, Festivals), grid of templates, live preview with overlay.
- **Share**: Renders the preview to a single PNG with [html2canvas](https://html2canvas.hertzen.com/), then uses Web Share API with files when available, otherwise triggers download.
- **Premium**: Badges on cards; tapping a premium template without access opens an upsell modal; **Start demo access** unlocks premium locally for recordings.

Prerequisites

- [Node.js](https://nodejs.org/) 18+ (LTS recommended)

Setup


cd "greeting app"
npm install
npm run dev

Open the URL shown in the terminal (usually `http://localhost:5173`).

 Build

npm run build
npm run preview


 Tech stack

- [Vite](https://vitejs.dev/) + [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Router](https://reactrouter.com/)
- [html2canvas](https://html2canvas.hertzen.com/) for flattening the card DOM into one image
- [lucide-react](https://lucide.dev/) icons

