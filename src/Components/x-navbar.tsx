import {Component, h, Host, Listen, Prop, State, Watch} from '@stencil/core';
import {Entry, FileEntry, PathEntry, Repository} from '../Repository';

@Component({
    tag: 'x-navbar',
    styleUrl: 'x-navbar.scss',
    shadow: true,
})
export class XNavbar {

    @State() private isPinned: boolean = false;

    private entries: PathEntry[] = [];

    componentWillLoad() {
        this.entries = Repository.entries.filter(e => e.type === 'dir') as PathEntry[];
        document.querySelector('x-app > #content')?.addEventListener('scroll', (e) => {
            this.isPinned = (e.target as HTMLElement).scrollTop > 1;
        })
    }

    render() {
        return (
            <Host class={{pinned: this.isPinned}}>
                <nav>
                    <section>
                        <a href={"#"}>
                            <x-signature size={48}/>
                        </a>
                    </section>
                    <section>
                        {this.renderMenu({type: 'dir', name: '', children: this.entries}, true)}
                    </section>
                </nav>
            </Host>
        );
    }

    private renderMenu(entry: PathEntry, isRoot: boolean = false) {
        return (
            <ul>
                {entry.children.map((e, i) => (
                    <li tabIndex={isRoot ? i : undefined}>
                        {e.type === 'dir' ? [
                            <a href="javascript:void(0)">{e.name}</a>,
                            this.renderMenu(e)
                        ] : (
                            <a href={`#${e.route}`}>{e.name}</a>
                        )}
                    </li>
                ))}
            </ul>
        );
    }
}
