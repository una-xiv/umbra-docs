import {marked} from "marked";
import markedAlert from "marked-alert";

export const Repository = new class {
    private data: Entry[] = [];
    private pages: Map<string, PageEntry> = new Map();
    private splash: SplashEntry[] = [];

    public async load(): Promise<void> {
        this.data = await (fetch('docs.json').then(r => r.json()));

        this.parseEntries(this.data);
    }

    /**
     * Returns routes that are marked as splash entries.
     */
    public get splashEntries(): SplashEntry[] {
        return this.splash;
    }

    public get entries(): Entry[] {
        return this.data;
    }

    public findPrev(entry: PageEntry): PageEntry | undefined {
        const keys = Array.from(this.pages.keys());
        const index = keys.indexOf(entry.path);

        if (index === -1) {
            return undefined;
        }

        const prev = keys[index - 1];
        if (!prev) {
            return undefined;
        }

        return this.pages.get(prev);
    }

    public findNext(entry: PageEntry): PageEntry | undefined {
        const keys = Array.from(this.pages.keys());
        const index = keys.indexOf(entry.path);

        if (index === -1) {
            return undefined;
        }

        const next = keys[index + 1];
        if (!next) {
            return undefined;
        }

        return this.pages.get(next);
    }

    public findRoute(route: string): PageEntry | undefined {
        const parts = route.split('--');
        const path = parts[0];
        const hash = parts[1] ?? '';

        console.log('FIND ROUTE:', path);

        const page = this.pages.get(path);
        if (!page) {
            return undefined;
        }

        return page;
    }

    private findRouteIn(route: string, entries: Entry[]): FileEntry | undefined {
        for (const entry of entries) {
            if (entry.type === 'dir') {
                const found = this.findRouteIn(route, entry.children);
                if (found) {
                    return found;
                }
            } else if (entry.route.toLowerCase() === route.toLowerCase()) {
                return entry;
            }
        }
    }

    private parseEntries(entries: Entry[]): void {
        entries.forEach(entry => {
            if (entry.type !== 'file') {
                this.parseEntries(entry.children);
                return;
            }

            let src = window.atob(entry.data);

            if (entry.isSplash) {
                const lines = src.split(/\r?\n/);
                const splash: string[] = [];

                let img = null;
                let i = 0;

                for (i = 0; i < lines.length; i++) {
                    if (lines[i].trim() === '') {
                        continue;
                    }

                    if (!lines[i].startsWith('|')) {
                        break;
                    }

                    const line = lines[i].substring(1).trim();

                    if (line.startsWith('![](')) {
                        img = line.substring(4, line.length - 1);
                        continue;
                    }

                    splash.push(line);
                }

                if (splash.length > 0) {
                    this.splash.push({
                        name: entry.name,
                        path: entry.route,
                        html: this.parseMarkdown(splash.join('\n')),
                        img: img,
                    });
                }

                src = lines.slice(i).join('\n');
            }

            this.pages.set(entry.route, this.createPageEntry(entry, src));
        });
    }

    private createPageEntry(entry: FileEntry, src: string): PageEntry {
        const html = this.parseMarkdown(src);

        return {
            name: entry.name,
            path: entry.route,
            html: html,
        };
    }

    private parseMarkdown(markdown: string): string {
        return marked.use(markedAlert()).parse(markdown.trim(), {
            gfm: true,
            breaks: false,
            async: false,
        });
    }
}

export type Route = {
    name: string;
    path: string;
}

export type SplashEntry = Route & {
    html: string;
    img: string | null;
}

export type PageEntry = Route & {
    html: string;
};

export type Entry = PathEntry | FileEntry;

export interface PathEntry {
    type: 'dir';
    name: string;
    children: Entry[];
}

export interface FileEntry {
    type: 'file';
    name: string;
    route: string;
    data: string;
    isSplash: boolean;
    chapters: {name: string, slug: string}[];
}
