import {Component, h, Host, Prop, State, Watch} from '@stencil/core';
import {Repository, PageEntry} from '../Repository';


@Component({
    tag: 'x-page',
    styleUrl: 'x-page.scss',
    shadow: true,
})
export class XPage {

    @Prop() entry: PageEntry | null = null;

    @State() private html: string = '';
    @State() private prev: PageEntry | undefined;
    @State() private next: PageEntry | undefined;

    private mainEl: HTMLElement | undefined;

    componentWillLoad() {
        this.onEntryChanged();
        window.addEventListener('hashchange', () => this.onEntryChanged());
    }

    render() {
        return (
            <Host>
                <main>
                    <div
                        ref={el => this.mainEl = el}
                        innerHTML={this.html}
                    />
                    {(this.next || this.prev) && (
                        <footer>
                            {this.prev && <x-button href={this.prev.path}>Previous: {this.prev.name}</x-button>}
                            {this.next && <x-button href={this.next.path}>Next: {this.next.name}</x-button>}
                        </footer>
                    )}
                </main>
            </Host>
        );
    }

    @Watch('entry')
    private async onEntryChanged(): Promise<void> {
        if (!this.entry) return;

        this.html = this.entry.html;
        this.prev = Repository.findPrev(this.entry);
        this.next = Repository.findNext(this.entry);

        const anchor = window.location.hash.split('--')[1] ?? '';
        setTimeout(() => {
            requestAnimationFrame(() => {
                for (const el of this.mainEl?.children ?? []) {
                    if (el.tagName.match(/^H[1-6]$/)) {
                        const id = this.slugify(el.textContent?.toLowerCase() ?? '');
                        if (id === anchor) {
                            console.log('FOUND ANCHOR:', id, el);
                            el.scrollIntoView({behavior: 'smooth', block: 'start'});
                        }
                    }
                }
            });
        }, 250);
    }

    private slugify(text: string) {
        text = text.replace(/^\d+\./, '').trim();
        return text.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
    }
}
