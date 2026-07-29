# K8s Next.js Demo

A Next.js application demonstrating public and private environment variable handling in Kubernetes deployments, with Docker support and standalone output.

## Pages

- **`/`** — Server component that reads env vars directly from `process.env`
- **`/client`** — Client component that fetches private env vars once from `/api/test-env`
- **`/api/test-env`** — API route that returns server-side env vars as JSON

## Environment Variables

| Variable | Type | Description |
|---|---|---|
| `NEXT_PUBLIC_BRANCH` | Public | Git branch name |
| `NEXT_PUBLIC_USERNAME` | Public | Deployment username |
| `SECRET_STRING` | Private | Secret value (server-only) |
| `PASSWORD` | Private | Password value (server-only) |

Public vars (`NEXT_PUBLIC_*`) are bundled into the client. Private vars are exposed only via the API route.

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Docker

```bash
docker compose up -d
```

Build args: `NEXT_PUBLIC_BRANCH`, `NEXT_PUBLIC_USERNAME`
