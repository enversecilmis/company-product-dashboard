# Interview Assignment - Company Product Dashboard

I built the project in two parts:

- frontend with vite
- backend with express


## Running
To start both run these commands in both of their root directories:
```bash
npm install
```
```bash
npm run dev
```

## Possible Issues

If it doesn't work please check `settings.ts` file in both and make sure `CLIENT_URL` and `SERVER_URL` values are correct.


## Used Packages

### Backend
- `mongodb-memory-server`: In memory database that simulates Mongo DB.
- `mongoose`: For easy interfacing with Mongo DB.
- `jsonwebtoken`: To sign and validate JWT tokens.
- `argon2`: For hashing passwords.
- `nodemon`and `ts-node`: For fast development environment.

### frontend
- `react-router-dom`: For client side routing.
- `zustand`: For global state.
- `@tanstack/react-query`: For async state.
- `antd`: For a design system.
- `tailwindcss`: For more convenient "inline" styles.
