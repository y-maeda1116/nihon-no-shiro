# TypeScript Template Base

A cross-platform TypeScript template repository optimized for Node.js tool development with consideration for future web frontend (React) migration.

## Features

- TypeScript 7 (Go-based, ~10x faster) with strict mode
- Hot-reload development with `tsx`
- Dual CJS/ESM build with `tsup`
- Testing with Vitest
- Linting with ESLint (flat config)
- Formatting with Prettier
- Environment variable validation with Zod
- CI/CD with GitHub Actions (Ubuntu, Windows, macOS)

## Requirements

- Node.js >= 20.0.0
- npm

## Setup

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create environment file:

```bash
cp .env.example .env
```

4. Edit `.env` with your actual values:

```env
DISCORD_TOKEN=your_discord_bot_token_here
DEEPL_AUTH_KEY=your_deepl_auth_key_here
```

## Development

Run in development mode with hot-reload:

```bash
npm run dev
```

## Testing

Run tests:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

## Type Checking

Run type checking with the native TypeScript 7 `tsc`:

```bash
npm run typecheck
```

> **Note:** TypeScript 7 does not yet ship the JavaScript compiler API that `typescript-eslint` (and `tsup`) depend on.
> Following the [upstream side-by-side guidance](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/#running-side-by-side-with-typescript-6-0),
> `@typescript/native` is an alias for `typescript@7` (provides `tsc`), while `typescript` is an alias for
> `@typescript/typescript6` so tools importing the `typescript` API get the supported 6.x API.

## Build

Build for production:

```bash
npm run build
```

Run built files:

```bash
npm start
```

## Linting and Formatting

Lint code:

```bash
npm run lint
```

Format code:

```bash
npm run format
```

## Environment Variables

The following environment variables are required (customize for your project):

| Variable | Description |
|----------|-------------|
| `DISCORD_TOKEN` | Discord bot token (example) |
| `DEEPL_AUTH_KEY` | DeepL API key (example) |

## License

MIT
