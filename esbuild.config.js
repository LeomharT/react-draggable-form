import esbuild from 'esbuild';
import { sassPlugin } from 'esbuild-sass-plugin';

console.time('Total time');

await esbuild.build({
    entryPoints: ['./src/index.tsx'],
    outdir: 'dist',
    bundle: true,
    minify: true,
    watch: true,
    assetNames: 'assets/[name]-[hash]',
    loader: {
        '.png': 'file',
        '.svg': 'file',
        '.jpg': 'file'
    },
    plugins: [
        sassPlugin(),
    ]
}).then(v =>
{
    console.log("No issues found!");
}).catch(e => console.error(e));

console.timeEnd('Total time');
