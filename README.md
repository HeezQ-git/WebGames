
# WEB GAMES

   A project of mine, which is a recreation of NYTimes web games, created to solely focus on improving both my frontend and backend skills.  
   I plan to continue to add more games and further develop the app.
## Demo

App is currently deployed on Vercel. You can see the [demo here](https://web-games-one.vercel.app/spelling-bee).

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
To deploy frontend, go to `/frontend` directory and run:

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
To deploy backend, go to `/backend` directory and run:

```bash
pnpm start
# or
npm start
# or
yarn start
```

Open http://localhost:3000 with your browser to see the result.
## Features

- Light/dark mode toggle
- Cross platform
- Guest accounts
- Account creation and saving games played as guest
- Ability to share games via link

## Roadmap

- Add management of content preferences
- Add ability to delete account or reset progress
- Add Google as a login provider
- Optimization, performance improvements and code refactoring
- New game: *Wordle*

    #### Spelling Bee:
    - Add hints to games
    - Add different modes (easy, normal, hard)
    