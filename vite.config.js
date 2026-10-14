import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Relative base so the same build works at a domain root and at
// https://phoenix238.github.io/bethnal-green-boxing-gym/ (GitHub Pages).
export default defineConfig({ base: './', plugins: [react()] });
