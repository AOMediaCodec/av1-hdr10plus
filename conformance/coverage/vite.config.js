import preact from "@preact/preset-vite";
import { defineConfig } from "vite";

export default defineConfig({
    base: "/pg_hdr10plus/coverage/",
    plugins: [preact()],
    server: {
        fs: {
            allow: [".."],
        },
    },
});
