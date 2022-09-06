import esbuild from 'esbuild';
import { sassPlugin } from 'esbuild-sass-plugin';


await esbuild.build({
    entryPoints: ['./src/index.tsx'],
    outdir: 'dist',
    bundle: true,
    minify: true,
    watch: true,
    plugins: [
        sassPlugin(),
    ]
}).catch(e => console.error(error));
