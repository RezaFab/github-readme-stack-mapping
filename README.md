# GitHub Stack Mapping

GitHub Stack Mapping generates an embeddable SVG card from a GitHub user's public repositories, grouped by detected tech stack.

## Main Endpoint

`GET /api/card?username=<github_username>`

Example:

```md
![GitHub Stack Mapping](https://github-stack-mapping.vercel.app/api/card?username=RezaFab)
```

## Query Parameters

- `username` (required): GitHub username
- `theme`: `light` or `dark` (default `light`)
- `hide_border`: `true` or `false` (default `false`)
- `title_color`: hex color (for example `#24292f`)
- `text_color`: hex color
- `bg_color`: hex color
- `border_color`: hex color
- `max_repos_per_stack`: number, range `1-10` (default `4`)
- `max_stacks`: number, range `1-25` (default `10`)

Example with options:

```md
![GitHub Stack Mapping](https://github-stack-mapping.vercel.app/api/card?username=RezaFab&theme=dark&max_stacks=8)
```

## Optional Debug Endpoint

`GET /api/projects?username=<github_username>`

This endpoint returns JSON so you can inspect detected stacks and grouped repositories.

## Stack Detection

The API inspects each public repository using:

- Repository language and topics
- `package.json`
- `composer.json`
- `pubspec.yaml`
- `requirements.txt`
- `pyproject.toml`
- `Dockerfile`

Supported stacks include React, Vite, Next.js, Vue, Nuxt, Angular, Svelte, Node.js, Express, NestJS, Laravel, CodeIgniter, Symfony, Flutter, React Native, Spring Boot, Java, Python, Django, Flask, FastAPI, Prisma, PostgreSQL, MySQL, Docker, and Tailwind CSS.

## Local Development

1. Install dependencies:

```bash
npm install
```

2. Run the frontend locally:

```bash
npm run dev
```

3. Run Vercel API routes locally:

```bash
npx vercel dev
```

## Deploy to Vercel

1. Import this repository into Vercel.
2. Set the environment variable `GITHUB_TOKEN` in Vercel Project Settings.
3. Deploy.

`GITHUB_TOKEN` must stay server-side. Do not use `VITE_GITHUB_TOKEN` for this project.

## Build Check

```bash
npm run build
```

The TypeScript build includes both the React app and `api/**/*.ts` server files.
