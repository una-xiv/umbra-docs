import {Component, Element, h, Host, State} from '@stencil/core';
import {PageEntry, Repository} from '../Repository';

@Component({
    tag: 'x-app',
    styleUrl: 'x-app.scss',
})
export class XApp {

    @State() private route: PageEntry | null = null;

    @Element() el: HTMLElement;

    async componentWillLoad() {
        await Repository.load();

        window.addEventListener('hashchange', () => this.loadRoute());
        this.loadRoute();
    }

    render() {
        if (!this.route) {
            return (
                <Host>
                    <div id="background"/>
                    <div id="content">
                        <div class="wrapper">
                            <main>
                                <div class="banner">
                                    <x-logo/>
                                    <div>
                                        <x-signature/>
                                        <div>Enhance your Final Fantasy XIV experience.</div>
                                    </div>
                                </div>
                                <div class="cards">
                                    {Repository.splashEntries.map(e => (
                                        <a class="card" href={`#${e.path}`}>
                                            <div class="card-image">
                                                <img src={e.img ?? ''} alt={""}/>
                                                <h1>{e.name}</h1>
                                            </div>
                                            <div class="card-body">
                                                <div class="body" innerHTML={e.html}/>
                                            </div>
                                        </a>
                                    ))}
                                </div>

                                <section>
                                    <div class="column">
                                        <h1>A welcoming community</h1>
                                        <p>Join our Discord server to chat with other users, get help, or to share your
                                            own creations.</p>
                                        <a href="https://discord.gg/xaEnsuAhmm" target="_blank">
                                            <img
                                                src="https://discord.com/api/guilds/1263935915517149298/widget.png?style=banner2"/>
                                        </a>
                                        <h1>Support the development</h1>
                                        <p>
                                            Umbra is a free project. If you enjoy using it, please consider supporting
                                            the development.
                                        </p>
                                        <a href='https://ko-fi.com/L4L4XIDQI' target='_blank'>
                                            <img src='https://storage.ko-fi.com/cdn/kofi6.png?v=3'
                                                 alt='Buy Me a Coffee at ko-fi.com'
                                                 style={{height: '40px', backgroundColor: '#f0c0a3'}}
                                            />
                                        </a>
                                    </div>
                                    <div class="column">
                                        <h1>Open Source</h1>
                                        <p>
                                            Our code is available on GitHub. If you're a developer, feel free to
                                            contribute!
                                        </p>
                                        <a href="https://github.com/una-xiv/umbra">
                                            <x-github-link/>
                                        </a>
                                        <h1>Contributors</h1>
                                        <p>
                                            Special thanks to the following contributors for their work on Umbra.
                                        </p>
                                        <x-github-contributors/>
                                    </div>
                                </section>
                            </main>
                        </div>
                        <x-sitemap/>
                    </div>
                </Host>
            );
        }

        return (
            <Host>
                <div id="background"/>
                <div id="content">
                    <x-navbar/>
                    <div class="wrapper">
                        <x-page entry={this.route}/>
                    </div>
                    <x-sitemap/>
                </div>
            </Host>
        );
    }

    private loadRoute(): void {
        const hash = document.location.hash;

        if (!hash) {
            this.route = null;
        }

        this.route = Repository.findRoute(hash.substring(1)) || null;

        if (hash.indexOf('--') === -1) {
            setTimeout(() => {
                this.el.querySelector("#content")!.scrollTop = 0;
            }, 100);
        }
    }
}
