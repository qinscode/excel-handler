import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react-swc";
import path from "node:path";
import { defineConfig } from "vite";

const host = process.env.TAURI_DEV_HOST;

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), TanStackRouterVite()],
	server: {
		port: 1420,
		strictPort: true,
		host: host || false,
		hmr: host
			? {
					protocol: "ws",
					host,
					port: 1421,
				}
			: undefined,
		watch: {
			// 3. tell vite to ignore watching `src-tauri`
			ignored: ["**/src-tauri/**"],
		},
	},
	resolve: {
		extensions: [".js", ".ts", ".jsx", ".tsx", ".json"],
		alias: {
			"@": path.resolve(__dirname, "./src"),
			"@components": path.resolve(__dirname, "./src/components"),
		},
	},
	build: {
		rollupOptions: {
			output: {
				manualChunks: {
					// Separate vendor libraries into their own chunks
					'mui': ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled'],
					'excel': ['xlsx'],
					'router': ['@tanstack/react-router'],
					'query': ['@tanstack/react-query'],
					'react-vendor': ['react', 'react-dom'],
				},
			},
		},
		// Increase chunk size warning limit to 1000kb to reduce warnings
		chunkSizeWarningLimit: 1000,
		// Enable source maps for better debugging (optional)
		sourcemap: false,
	},
	// Enable code splitting for better caching
	optimizeDeps: {
		include: [
			'react',
			'react-dom',
			'@mui/material',
			'@mui/icons-material',
			'@emotion/react',
			'@emotion/styled',
			'xlsx',
			'@tanstack/react-router',
			'@tanstack/react-query'
		],
	},
});
