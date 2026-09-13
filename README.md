# doodle-ui

Hand-drawn React component library. Sketchy chrome via rough.js, real HTML for text, shipped as an npm package with a Next.js docs site.

## Packages

- `packages/doodle-ui` - the component library
- `apps/docs` - Next.js 14 App Router documentation site

## Develop

```bash
pnpm install
pnpm dev
```

Docs run at [http://localhost:3000](http://localhost:3000). The library rebuilds in watch mode through Turborepo.

```bash
pnpm build
pnpm typecheck
```

## Publish (library)

```bash
pnpm --filter doodle-ui pack --dry-run
pnpm --filter doodle-ui publish
```

If npm rejects `doodle-ui` because of an old unpublished stub, rename the package to `doodleui-react`.

## License

MIT
