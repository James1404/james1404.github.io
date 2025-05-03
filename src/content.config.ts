import { defineCollection, z } from "astro:content";
import { glob, file } from "astro/loaders";

const projects = defineCollection({
    loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/projects" }),
    schema: z.object({
        title: z.string(),
    }),
});

export const collections = { projects };
