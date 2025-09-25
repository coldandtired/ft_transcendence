import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
	root: path.resolve(__dirname, 'src/frontend'),
	build: {
		lib: {
			entry: path.resolve(__dirname, 'src/frontend/js/index.ts'),
			name: 'TranscendenceFrontend',
			fileName: 'index',
			formats: ['es']
		},
		rollupOptions: {
			output: {
				dir: 'dist/frontend/js',
				entryFileNames: 'index.js',
				chunkFileNames: 'chunks/[name]-[hash].js',
				assetFileNames: 'assets/[name]-[hash].[ext]'
			}
		},

		target: 'esnext',
		emptyOutDir: false,
		minify: false
	},
	publicDir: path.resolve(__dirname, 'src/frontend/images'),
});
