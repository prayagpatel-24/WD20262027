// Dev server for the Luma site. The site itself is plain HTML/CSS/JS in /luma.
import { defineConfig } from "vite";

export default defineConfig({
  root: "luma",
  appType: "mpa",          // multi-page site: a missing page shows a 404 instead of the home page
  server: { port: 5500, open: true }
});
