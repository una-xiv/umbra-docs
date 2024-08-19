import {Component, Host, h} from "@stencil/core";
import {Repository, Entry, PathEntry, FileEntry} from "../Repository";

@Component({
    tag: 'x-sitemap',
    styleUrl: 'x-sitemap.scss',
    shadow: true,
})
export class XSitemap {
    render() {
        return (
            <Host>
                <main>
                    {Repository.entries.map(e => this.renderEntry(e))}
                </main>
            </Host>
        )
    }

    private renderEntry(entry: Entry) {
        if (entry.type === 'dir') {
            return this.renderPath(entry);
        }

        const result = [<a href={`#${entry.route}`}>{entry.name}</a>];

        if (entry.chapters.length > 0) {
            result.push(
                <ul>
                    {entry.chapters.map(c => (
                        <li><a href={`#${entry.route}--${c.slug}`}>{c.name}</a></li>
                    ))}
                </ul>
            )
        }

        return result;
    }

    private renderPath(entry: PathEntry) {
        return (
            <section>
                <h1>{entry.name}</h1>
                <div>
                    {entry.children.map(e => this.renderEntry(e))}
                </div>
            </section>
        );
    }
}
