// @ts-check
import { defineConfig } from "astro/config";

import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";

import tailwindcss from "@tailwindcss/vite";

import react from "@astrojs/react";

import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
    vite: {
        plugins: [tailwindcss(), wasm(), topLevelAwait()],
    },

    integrations: [react(), mdx()],

    site: "https://james1404.github.io",
});
