# OctoFit Tracker frontend

React 19 presentation tier for OctoFit Tracker. Run the frontend with `npm run dev` and build it with `npm run build`.

## API configuration

When the API is hosted in Codespaces, define `VITE_CODESPACE_NAME` in `octofit-tracker/frontend/.env.local` before starting Vite:

```dotenv
VITE_CODESPACE_NAME=your-codespace-name
```

This variable must be set to reach the Codespaces API at `https://<VITE_CODESPACE_NAME>-8000.app.github.dev/api/`. Restart Vite after changing the file. If it is unset, the frontend safely uses `http://localhost:8000/api/` for local development.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
