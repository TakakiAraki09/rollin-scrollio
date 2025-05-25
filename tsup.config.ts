import { sassPlugin } from 'esbuild-sass-plugin';
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/index.scss'],
  format: ['esm', 'cjs'],
  outDir: 'dist',
  dts: true,
  minify: false,
  sourcemap: true,
  clean: true,
  esbuildPlugins: [
    sassPlugin({
    })
  ]
});
