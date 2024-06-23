
# WEB GAMES

   Welcome to my Web Games project, a personal initiative to recreate NYTimes web games. This project serves as a platform for honing my frontend and backend development skills. I am committed to continuously enhancing the app and introducing new games.
## Demo

The app is currently deployed on Vercel. You can check out the [demo here](https://web-games-one.vercel.app/spelling-bee).

## Tech Stack

### FRONTEND
- Next.js (v14) + TypeScript
- Axios + [SWR](https://swr.vercel.app/)
- [Mantine (v7)](https://mantine.dev/)
- [React Hot Toast](https://react-hot-toast.com/)
- [React Icons](https://react-icons.github.io/react-icons/)
- [Zustand](https://zustand.surge.sh/)
- [PostCSS](https://postcss.org/)

### BACKEND
- Node.js (v16) + TypeScript
- Express.js
- MongoDB + Prisma
- [JWT](https://jwt.io/)

## Deployment

### FRONTEND
To deploy the frontend, navigate to the `/frontend` directory and run:

```bash
pnpm dev
# or
npm run dev
# or
yarn dev
# or
bun dev
```

### BACKEND
To deploy the backend, navigate to the `/backend` directory and run:

```bash
pnpm start
# or
npm start
# or
yarn start
```

Open http://localhost:3000 with your browser to see the result.
## Features

- **Dynamic Light/Dark Mode**: Seamlessly switch between light and dark themes to suit your preference.
- **Cross-Platform Compatibility**: Enjoy the games on any device, whether it's a desktop, tablet, or mobile.
- **Guest Access**: Play games without the need for an account, perfect for quick and easy access.
- **Account Management**: Create an account to save your progress, customize your settings, and track your achievements.
- **Game Progression Saving**: Save your game progress and pick up right where you left off at any time.
- **Shareable Game Links**: Easily share your favorite games with friends via a unique link.
- **In-Game Hints**: Get helpful hints to improve your gameplay and tackle challenging puzzles.
- **Accessibility Features**: Designed with accessibility in mind to ensure a great experience for all users.

## Roadmap

- [x]  ~Add management of content preferences~
- [x]  ~Add ability to delete account or reset progress~
- [x]  ~Optimization, performance improvements and code refactoring~
- [ ]  New game: *Wordle*

#### Wordle:
  - [ ]  Basic game logic
  - [ ]  User interface design
  - [ ]  Saving games
  - [ ]  Implement scoring system
  - [ ]  Add hints or helper features
  - [ ]  Accessibility improvements

#### Spelling Bee:
  - [x]  ~Add ability to share game via link~
  - [x]  ~Add hints to games~
  - [ ]  Add different modes (easy, normal, hard)
  - [ ]  Accessibility improvements