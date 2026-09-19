<img src="https://socialify.git.ci/siyamthandagwamanda/CodeTribe_Async_Weather_News_Dashboard/image?language=1&owner=1&name=1&stargazers=1&theme=Light" alt="CodeTribe_Async_Weather_News_Dashboard" width="640" height="320" />

# Async Weather & News Dashboard

A minimal Node.js + TypeScript project scaffold for demonstrating asynchronous programming styles:
- **Callbacks**
- **Promises**
- **Async/Await (with try…catch)**

## Requirements
- **Node.js 18+**
- **npm**

> Node 18+ is recommended so you can later use built‑in `fetch` without extra libraries.

---

## Quick Start

```bash
# 1) Create and init 
mkdir async-weather-news-dashboard && cd async-weather-news-dashboard
npm init -y
npm i -D typescript ts-node @types/node
npx tsc --init

# 2) Replace tsconfig.json with a minimal config (see below)
# 3) Add the folder structure and placeholder files (see below)

# 4) Build + run
npm run build
npm run callback
npm run promise
npm run async
```

### Minimal `tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "moduleResolution": "Node",
    "strict": true,
    "esModuleInterop": true,
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"]
}
```

### `package.json` scripts
Add these under `"scripts"`:
```json
{
  "scripts": {
    "build": "tsc",
    "callback": "ts-node src/callbackVersion.ts",
    "promise": "ts-node src/promiseVersion.ts",
    "async": "ts-node src/asyncAwaitVersion.ts"
  }
}
```

---

## Project Structure

```
async-weather-news-dashboard/
├─ src/
│  ├─ callbackVersion.ts      
│  ├─ promiseVersion.ts       
│  └─ asyncAwaitVersion.ts    
├─ tsconfig.json
├─ package.json
└─ README.md
```

---

## What each entry file do

- **`callbackVersion.ts`**  
  Implement HTTP requests with Node’s callbacks (e.g., `https` module).  
  Show nested callbacks (“callback hell”) to illustrate control flow.

- **`promiseVersion.ts`**  
  Use Promises and chaining.  
  Add examples of `Promise.all` (weather + news in parallel) and `Promise.race` (fastest response).

- **`asyncAwaitVersion.ts`**  
  Refactor the Promise version to `async/await` with `try…catch` for errors.

---

## The Sprints Checklist

- **Sprint 2 – Callback Version**
  - Fetch weather (e.g., Open‑Meteo) and news (e.g., DummyJSON) via callbacks.
  - Log a combined, readable result or a clean error message.

- **Sprint 3 – Promise Version**
  - Convert to Promises; demonstrate chaining and `Promise.all` / `Promise.race`.

- **Sprint 4 – Async/Await Version**
  - Refactor to `async/await`; handle errors with `try…catch`.

- **Sprint 5 – Error Handling & Consistency**
  - Ensure all three versions return/print results in a consistent shape.

- **Sprint 6 – Testing & Docs**
  - Confirm scripts work and capture sample outputs in this README.

---

## Troubleshooting

- **`ts-node: command not found`**  
  Ensure it’s installed as a dev dependency: `npm i -D ts-node`.

- **TypeScript compile errors**  
  Run `npm run build` and read the error; make sure your `rootDir` is `src` and your files are in `src/`.
