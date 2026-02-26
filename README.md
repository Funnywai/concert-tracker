# Concert Log - iOS Style Concert Tracker

A beautiful iOS-style web application to track your concert memories and upcoming shows.

## Features

- 🎵 Track past and upcoming concerts
- 📅 Save date, time, location, price, seat, and notes
- 🔍 Search through your concert history
- 💾 Local storage persistence
- 📱 Mobile-optimized iOS design
- 🌐 Progressive Web App ready

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/concert-log.git
cd concert-log
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` folder.

## Deployment to GitHub Pages

### Option 1: Using gh-pages (Recommended)

1. Install the gh-pages package:
```bash
npm install -D gh-pages
```

2. Add these scripts to your `package.json`:
```json
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}
```

3. Configure the base path in `vite.config.ts`:
```typescript
export default defineConfig({
  base: '/concert-log/', // Replace with your repo name
  plugins: [react()],
})
```

4. Deploy to GitHub Pages:
```bash
npm run deploy
```

5. Go to your GitHub repository settings → Pages → Select the `gh-pages` branch

### Option 2: Manual Deployment

1. Build the project:
```bash
npm run build
```

2. Create a `gh-pages` branch:
```bash
git checkout --orphan gh-pages
git reset
git add dist/
git commit -m "Deploy to GitHub Pages"
git branch -M gh-pages
git push -u origin gh-pages
```

3. In GitHub Repository Settings → Pages, select the `gh-pages` branch as the source

## Deployment to Vercel (Alternative)

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Follow the prompts to complete deployment

## Deployment to Netlify (Alternative)

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Deploy:
```bash
netlify deploy
```

For production:
```bash
netlify deploy --prod
```

## Project Structure

```
concert-log/
├── src/
│   ├── components/      # React components
│   │   ├── ConcertCard.tsx
│   │   ├── ConcertForm.tsx
│   │   └── TabNavigation.tsx
│   ├── utils/
│   │   └── cn.ts
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   └── types.ts
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Technologies Used

- React 18
- TypeScript
- Vite
- Tailwind CSS
- lucide-react (icons)
- date-fns (date formatting)

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.
