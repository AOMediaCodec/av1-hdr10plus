import preact from "@preact/preset-vite";
import { defineConfig } from "vite";

export default defineConfig({
    base: "/av1-hdr10plus/coverage/",
    plugins: [preact()],
    server: {
        fs: {
            allow: [".."],
        },
    },
});
