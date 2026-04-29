<p align="center">
  <img src="https://github-readme-stack-mapping.vercel.app/api/card?username=RezaFab&mode=techstack&section=all&theme=dark&hide_border=false&title_color=%238ec5ff&text_color=%23cfe8ff&bg_color=%23070b16&border_color=%23243049&show_projects=false&max_repos_per_stack=5&max_stacks=30" alt="GitHub Readme Stack Mapping" />
</p>

<h1 align="center">GitHub Readme Stack Mapping</h1>

<p align="center">
  Generate an embeddable GitHub README SVG card from your public repositories.
</p>

<p align="center">
  <a href="https://github-readme-stack-mapping.vercel.app">
    <img src="https://img.shields.io/badge/Vercel-Live-black?style=for-the-badge&logo=vercel" alt="Vercel Live" />
  </a>
  <a href="https://github.com/RezaFab/github-readme-stack-mapping/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/RezaFab/github-readme-stack-mapping?style=for-the-badge" alt="License" />
  </a>
  <a href="https://github.com/RezaFab/github-readme-stack-mapping/commits/main/">
    <img src="https://img.shields.io/github/last-commit/RezaFab/github-readme-stack-mapping?style=for-the-badge" alt="Last Commit" />
  </a>
  <img src="https://img.shields.io/badge/Build-npm%20run%20build-2ea44f?style=for-the-badge" alt="Build command npm run build" />
</p>

<p align="center">
  <a href="https://github-readme-stack-mapping.vercel.app/api/card?username=RezaFab&mode=techstack&section=backend&theme=dark&hide_border=false&title_color=%238ec5ff&text_color=%23cfe8ff&bg_color=%23070b16&border_color=%23243049&show_projects=true&max_repos_per_stack=5&max_stacks=30">Demo</a> |
  <a href="#quick-start">Quick Start</a> |
  <a href="#api-reference">API Reference</a> |
  <a href="#why-this-project">Why</a> |
  <a href="#technology">Technology</a> |
  <a href="#local-development">Local Dev</a> |
  <a href="#deploy-to-vercel">Deploy</a> |
  <a href="#limitations">Limitations</a> |
  <a href="#acknowledgements">Thanks</a> |
  <a href="#project-policies">Policies</a>
</p>

## Features

- README-ready SVG output from `/api/card`
- Detection mode split: `techstack`, `languages`, `all`
- Section filter: `frontend`, `backend`, `tools`, `mobile`, `other`, `all`
- Theme support: `dark` and `light`
- Optional per-technology project list with links (`show_projects=true`)
- Optional JSON debug endpoint at `/api/projects`

## Technology

- TypeScript
- React
- Vite
- Node.js
- Vercel Serverless Functions
- GitHub REST API
- [Simple Icons](https://github.com/simple-icons/simple-icons)

## Quick Start

Add this to your README:

```md
![GitHub Stack Mapping](https://github-readme-stack-mapping.vercel.app/api/card?username=YOUR_GITHUB_USERNAME)
```

## API Reference

### Main Card Endpoint

`GET /api/card?username=<github_username>`

Example:

```txt
https://github-readme-stack-mapping.vercel.app/api/card?username=RezaFab
```

### Optional Debug Endpoint

`GET /api/projects?username=<github_username>`

Example:

```txt
https://github-readme-stack-mapping.vercel.app/api/projects?username=RezaFab&mode=all&section=all
```

### Query Parameters

| Name | Type | Default | Description |
|---|---|---|---|
| `username` | string | required | GitHub username |
| `mode` | `techstack` \| `languages` \| `all` | `techstack` | Group source (`techstack` excludes language-only stacks) |
| `section` | `all` \| `frontend` \| `backend` \| `tools` \| `mobile` \| `other` | `all` | Filter stacks by section |
| `theme` | `dark` \| `light` | `dark` | Card theme |
| `hide_border` | boolean | `false` | Hide outer border |
| `title_color` | hex color | auto | Override title color |
| `text_color` | hex color | auto | Override body text color |
| `bg_color` | hex color | auto | Override background color |
| `border_color` | hex color | auto | Override border color |
| `show_projects` | boolean | `false` | Show project list under each stack card |
| `max_repos_per_stack` | number `1-10` | `5` | Max repos shown per stack (used when `show_projects=true`) |
| `max_stacks` | number `1-40` | `25` | Max stacks shown |

## Why This Project

- Focuses on stack mapping by repository context, not just language statistics.
- Supports section-based filtering (`frontend`, `backend`, `tools`, `mobile`, `other`) to make cards more relevant.
- Can show related project names under each technology (`show_projects=true`) for better portfolio storytelling.

## Usage Examples

### Default Tech Stack Card

```md
![GitHub Stack Mapping](https://github-readme-stack-mapping.vercel.app/api/card?username=RezaFab&mode=techstack&theme=dark)
```
<img src="https://github-readme-stack-mapping.vercel.app/api/card?username=RezaFab&mode=techstack&theme=dark" alt="GitHub Readme Stack Mapping" />

### Frontend Only

```md
![GitHub Stack Mapping](https://github-readme-stack-mapping.vercel.app/api/card?username=RezaFab&mode=techstack&section=frontend)
```
<img src="https://github-readme-stack-mapping.vercel.app/api/card?username=RezaFab&mode=techstack&section=frontend" alt="GitHub Readme Stack Mapping" />

### Backend Only

```md
![GitHub Stack Mapping](https://github-readme-stack-mapping.vercel.app/api/card?username=RezaFab&mode=techstack&section=backend)
```
<img src="https://github-readme-stack-mapping.vercel.app/api/card?username=RezaFab&mode=techstack&section=backend" alt="GitHub Readme Stack Mapping" />

### Tools / Database Only

```md
![GitHub Stack Mapping](https://github-readme-stack-mapping.vercel.app/api/card?username=RezaFab&mode=techstack&section=tools)
```
<img src="https://github-readme-stack-mapping.vercel.app/api/card?username=RezaFab&mode=techstack&section=tools&theme=dark&hide_border=false&title_color=%238ec5ff&text_color=%23cfe8ff&bg_color=%23070b16&border_color=%23243049&show_projects=false&max_repos_per_stack=5&max_stacks=25" alt="GitHub Readme Stack Mapping" />

### Mobile Only (Android/Flutter/React Native)

```md
![GitHub Stack Mapping](https://github-readme-stack-mapping.vercel.app/api/card?username=RezaFab&mode=techstack&section=mobile)
```
<img src="https://github-readme-stack-mapping.vercel.app/api/card?username=RezaFab&mode=techstack&section=mobile" alt="GitHub Readme Stack Mapping" />

### Show Projects (With Links)

```md
![GitHub Stack Mapping](https://github-readme-stack-mapping.vercel.app/api/card?username=RezaFab&mode=techstack&show_projects=true&max_repos_per_stack=5)
```
<img src="https://github-readme-stack-mapping.vercel.app/api/card?username=RezaFab&mode=techstack&show_projects=true&max_repos_per_stack=5" alt="GitHub Readme Stack Mapping" />

### All Option Example

```md
![GitHub Stack Mapping](https://github-readme-stack-mapping.vercel.app/api/card?username=RezaFab&mode=techstack&section=backend&theme=dark&hide_border=false&title_color=%238ec5ff&text_color=%23cfe8ff&bg_color=%23070b16&border_color=%23243049&show_projects=true&max_repos_per_stack=5&max_stacks=25)
```
<img src="https://github-readme-stack-mapping.vercel.app/api/card?username=RezaFab&mode=techstack&section=backend&theme=dark&hide_border=false&title_color=%238ec5ff&text_color=%23cfe8ff&bg_color=%23070b16&border_color=%23243049&show_projects=true&max_repos_per_stack=5&max_stacks=25" alt="GitHub Readme Stack Mapping" />


## Local Development

1. Install dependencies:

```bash
npm install
```

2. Add `.env.local`:

```env
GITHUB_TOKEN=your_github_token_here
```

3. Run frontend (Vite):

```bash
npm run dev
```

4. Run API routes (Vercel runtime):

```bash
npx vercel dev --listen 3000
```

5. Open:

```txt
http://localhost:5173
```

The frontend preview should call `http://localhost:3000/api/card?...` in local dev.

## Deploy to Vercel

1. Import this repository to Vercel.
2. Set environment variable `GITHUB_TOKEN` in Project Settings.
3. Deploy.

Security notes:

- Keep token server-side only.
- Do not expose token as `VITE_GITHUB_TOKEN`.

## Limitations

- Uses only public repositories available from GitHub APIs.
- GitHub API rate limits can affect response time or produce temporary empty results, especially without a token.
- Technology detection is heuristic-based, so some repositories may be categorized imperfectly.
- Very large profiles may need `max_stacks` and `max_repos_per_stack` tuning to keep output readable.

## Acknowledgements

- Inspired by [github-readme-stats](https://github.com/anuraghazra/github-readme-stats) by
  [Anurag Hazra](https://github.com/anuraghazra).
- Thanks to [Simple Icons](https://github.com/simple-icons/simple-icons) for the icon dataset used in this project.
- Thanks to [Vercel](https://vercel.com) for the serverless platform used to run and deploy this project.

## Build Check

```bash
npm run build
```

## Project Policies

- [Contributing](./CONTRIBUTING.md)
- [Code of Conduct](./CODE_OF_CONDUCT.md)
- [Security Policy](./SECURITY.md)
- [MIT License](./LICENSE)
