# Full Stack Developer Portfolio + Admin Panel

A complete portfolio website built with **Next.js (App Router)** and **MongoDB**, with a built-in
**admin panel** for managing every section of the site. Nothing is hardcoded — all content (hero,
about, experience, skills, projects, contact) is stored in MongoDB and rendered from the database.

## Features

- **Public portfolio site**: Hero (image, resume, LinkedIn), About, Experience, Skills, Projects, Contact
- **Admin panel** (`/admin`) with full **CRUD** for every module, protected by login
- **Dark / light mode** toggle, on both the public site and the admin panel
- **Custom primary color** — pick any brand color in Settings, applied instantly site-wide via CSS variables
- **Contact form** that saves messages to MongoDB, with an inbox in the admin panel
- **Professional icon set only** — [lucide-react](https://lucide.dev) throughout, no emoji or clipart
- Single Next.js project — portfolio and admin panel live together, no separate backend needed

## Tech stack

| Layer      | Choice                                      |
|------------|----------------------------------------------|
| Framework  | Next.js 14 (App Router, Route Handlers)      |
| Database   | MongoDB + Mongoose                           |
| Styling    | Tailwind CSS (CSS-variable-driven theming)   |
| Auth       | JWT in an httpOnly cookie (bcrypt-hashed password) |
| Icons      | lucide-react                                 |
| Dark mode  | next-themes                                  |

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

```
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/portfolio
JWT_SECRET=some-long-random-string
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=ChangeMe123!
```

- `MONGODB_URI`: connection string for your MongoDB database (Atlas or self-hosted).
- `JWT_SECRET`: any long random string, used to sign admin login sessions.
- `ADMIN_EMAIL` / `ADMIN_PASSWORD`: the first admin account is created automatically
  the first time someone logs in (or when you run the seed script), using these values.

### 3. (Optional) seed starter content

```bash
npm run seed
```

This adds example Hero/About/Experience/Skills/Projects content and creates the admin
account, so the site isn't empty on first run. Safe to skip — the admin panel lets you
create everything by hand too.

### 4. Run the app

```bash
npm run dev
```

- Public site: `http://localhost:3000`
- Admin panel: `http://localhost:3000/admin/login`

Log in with the `ADMIN_EMAIL` / `ADMIN_PASSWORD` from your `.env.local`.

## Project structure

```
app/
  page.js                  # public homepage (server component, reads DB directly)
  layout.js                # root layout, applies theme + primary color from DB
  globals.css
  admin/
    login/page.js
    page.js                 # dashboard
    hero/page.js            # singleton editor
    about/page.js           # singleton editor
    experience/page.js      # list + CRUD
    skills/page.js          # list + CRUD, icon picker
    projects/page.js        # list + CRUD
    contact/page.js         # inbox + public contact-section editor
    settings/page.js        # theme + primary color
  api/
    auth/{login,logout,me}/route.js
    hero/route.js
    about/route.js
    experience/route.js, experience/[id]/route.js
    skills/route.js, skills/[id]/route.js
    projects/route.js, projects/[id]/route.js
    contact/route.js, contact/[id]/route.js   # POST public, rest admin-only
    contactinfo/route.js
    settings/route.js
components/
  Navbar.jsx, Footer.jsx, ThemeProvider.jsx, DynamicIcon.jsx
  sections/                 # public-facing section components
  admin/                    # sidebar, topbar, form field, status banner
models/                     # Mongoose schemas
lib/                        # db connection, auth helpers, color utility
middleware.js                # protects /admin pages and mutating API routes
scripts/seed.js
```

## How auth works

- A single `Admin` collection stores admin accounts (bcrypt-hashed passwords).
- Logging in sets an httpOnly JWT cookie (`portfolio_admin_token`).
- `middleware.js` blocks access to `/admin/*` pages and any non-GET API request unless
  that cookie is present and valid — so all writes (create/update/delete) are protected.
- Public `GET` endpoints (hero, about, experience, skills, projects, settings, contact info)
  stay open so the portfolio page can render without logging in.
- The contact **inbox** (`GET /api/contact`) is admin-only; only submitting a message
  (`POST /api/contact`) is public.

## Images and resume

To keep the project simple and deployment-friendly (no file storage service required),
images and the resume are stored as **URLs** — paste a link to an image or PDF hosted
anywhere (e.g. Cloudinary, S3, Google Drive, imgur) into the relevant field in the admin
panel. If you'd like direct file uploads instead, the cleanest options are to add an
`/api/upload` route backed by Cloudinary or S3, or introduce a `public/uploads` folder
with a Multer-based handler — happy to wire either one up on request.

## Customizing the primary color / theme

Go to **Admin → Settings**:
- Pick a preset or a custom color — it previews live immediately.
- Choose the default theme (light/dark) shown to first-time visitors.
- Click **Save settings** to persist to MongoDB and apply it site-wide (public site + admin).

Colors are stored as a single hex value and converted to CSS variables (`--color-primary`,
etc.) at request time in `app/layout.js`, so every Tailwind class using `primary-*` picks
it up automatically — no rebuild needed.

## Deployment notes

- Any Next.js-compatible host works (Vercel, Render, a Node server, etc.).
- Set the same environment variables (`MONGODB_URI`, `JWT_SECRET`, `ADMIN_EMAIL`,
  `ADMIN_PASSWORD`) in your hosting provider's dashboard.
- Use a strong, unique `JWT_SECRET` and `ADMIN_PASSWORD` in production.
