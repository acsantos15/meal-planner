# Meal Planner

This project is now configured to run with Vite for a modern development workflow.

## Available commands

- `npm install` ? install dependencies
- `npm run dev` ? start the Vite development server
- `npm run build` ? build the app for production
- `npm run preview` ? preview the production build locally

## Notes

- The app entrypoint is `src/main.js`.
- Global handlers are exposed so the existing HTML `onclick` attributes keep working.
- Supabase and html2canvas are now loaded as package dependencies instead of relying on CDN globals.
