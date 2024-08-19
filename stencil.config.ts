import {Config} from '@stencil/core';
import watch from "rollup-plugin-watch";
import * as path from 'path';
import * as fs from 'fs';

export const config: Config = {
    namespace: 'UmbraDocs',
    srcDir: 'src',
    outputTargets: [
        {
            type: 'www',
            serviceWorker: null,
            dir: 'site',
            buildDir: 'dist',
            empty: false,
            copy: [
                {src: 'index.html'},
                {src: 'favicon.ico'},
                {src: 'images', dest: 'images'},
                {src: 'docs', dest: 'docs'},
            ]
        }
    ],
    rollupPlugins: {
        before: [
            watch({
                dir: 'src/docs'
            })
        ],
        after: [
            indexDocs()
        ]
    },
};
function indexDocs() {
    return {
        name: 'index-docs',
        buildStart() {
            const docsPath = path.resolve(config.srcDir, 'docs');
            const out = [];
            this.addWatchFile(docsPath);
            parseDocs(docsPath, docsPath, out, this.addWatchFile);
            fs.writeFileSync(path.resolve(docsPath, '../../site/docs.json'), JSON.stringify(out, null, 4));
        }
    }
}

function parseDocs(base: string, dir: string, out: any, watchFile: (file: string) => void){
    fs.readdirSync(dir).map(d => path.join(dir, d)).forEach(f => {
        watchFile(f);

        if (fs.statSync(f).isDirectory()) {
            const name = path.basename(f);
            const entry = {
                type: 'dir',
                name: normalize(name),
                children: []
            };

            out.push(entry);
            parseDocs(base, f, entry.children, watchFile);
            return;
        }

        out.push({
            type: 'file',
            name: getTitle(f),
            route: path.relative(base, f).replace(/\\/g, '/').split('/').map(f => slugify(f)).join('/'),
            data: Buffer.from(fs.readFileSync(f, 'utf8')).toString('base64'),
            chapters: getChapters(f),
            isSplash: path.basename(f).endsWith('.splash.md')
        });
    });
}

function normalize(text: string)
{
    return text.replace(/^\d+\./, '').trim().replace('.splash', '').replace(/\.md$/, '').trim();
}

function slugify(text: string)
{
    text = text.replace(/^\d+\./, '').trim();
    text = text.replace('.splash', '');
    text = text.replace(/\.md$/, '');

    return text.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
}

function getTitle(mdFile: string)
{
    const content = fs.readFileSync(mdFile, 'utf-8');
    const match = content.match(/^#\s*(.*)$/m);
    return match ? match[1] : normalize(path.basename(mdFile));
}

function getChapters(mdFile: string)
{
    const content = fs.readFileSync(mdFile, 'utf-8');
    const matches = content.match(/^#[#]+\s*(.*)$/gm);
    const chapters = matches ? matches.map(m => m.replace(/^#[#]+\s*/, '')) : [];

    const result = [];
    chapters.forEach(c => {
        result.push({
            name: c,
            slug: slugify(c)
        });
    });

    return result;
}
