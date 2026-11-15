# Filmbox

A movie catalog in the style of Letterboxd, built on the [TMDB](https://www.themoviedb.org) API. Browse and filter films, open a film or person page, search by title and keep a personal watchlist.

**Demo:** _add your Vercel link here_

![Movies](docs/Movies.png)
![Movie](docs/Movie.png)
![Actor](docs/Actor.png)
![Search](docs/Search.png)

## Features

- **Catalog.** Popular films by default; filters by genre, country, runtime, release year and rating; pagination (60 films per page).
- **Film page.** Cast, crew, details, genres and releases tabs, trailer, reviews, "where to watch" providers, image carousel, similar films.
- **Person page.** Filmography split by department (acting, directing, writing, etc.).
- **Search.** By title, with the director shown for every result.
- **Watchlist.** Statuses _watched / want / dropped_, saved in `localStorage`.

## Tech stack

React 19 · TypeScript · Vite · Tailwind CSS 4 · React Router 7 · Zustand 5 (with `persist`) · lucide-react

## Getting started

Requirements: Node.js 20+ and a free [TMDB account](https://www.themoviedb.org/settings/api).

```bash
npm ci
cp .env.example .env      # then put your token into .env
npm run dev
```

`.env`:

```
VITE_TMDB_TOKEN=your_tmdb_api_read_access_token
```

Use the **API Read Access Token** (v4), not the short API key.

| Command                | What it does                      |
| ---------------------- | --------------------------------- |
| `npm run dev`          | Dev server with HMR               |
| `npm run build`        | Production build into `dist/`     |
| `npm run preview`      | Serve the production build locally |
| `npx tsc --noEmit`     | Type check (not part of `build`)  |

## Project structure

```
src/
├── components/   pages (MainPage, MoviePage, PersonPage, SearchPage, WatchlistPage) and ui/
├── hooks/        data loading: useMovies, useMovie, usePerson, useSearch
├── store/        Zustand: filters (genres, countries) and watchlist
├── lib/tmdb.ts   single place for TMDB requests: base URL, token, error handling
├── types/        TMDB types
└── fonts/        Inter, Source Serif 4, Lora (bundled locally)
```

Data hooks cancel in-flight requests with `AbortController` when filters, page or route change, so a slow stale response cannot overwrite a newer one.

## Security note

`VITE_*` variables are embedded in the client bundle, so the TMDB token is visible to anyone who opens DevTools. This is normal for a frontend-only app: use a **read-only** token, never commit `.env` (it is in `.gitignore`), and rotate the token if it leaks. To hide it completely you would need a small proxy (for example a serverless function).

## Known limitations

- Filters and the current page are not stored in the URL, so a filtered view cannot be shared via a link.
- The pager may show "Next" on the last page of a filtered result.
- Search makes one extra `/credits` request per result to find the director (up to 20 per page), which can be slow; "Show more" is always visible.
- On a person page opened for a director, the "Acting" department is not offered in the dropdown.
- Switching the page of film reviews reloads the whole film.
- The header has only a "Films" link: sign-in, lists and members are not implemented.
- ESLint is configured for `.js/.jsx` files only and does not lint `.ts/.tsx`.

## Attribution

This product uses the TMDB API but is not endorsed or certified by TMDB.
Streaming availability data is provided by JustWatch via TMDB.
The interface is inspired by Letterboxd; the project is not affiliated with it.