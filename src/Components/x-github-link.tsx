import {Component, h, Host, State} from "@stencil/core";

@Component({
    tag: 'x-github-link',
    styleUrl: 'x-github-link.scss',
    shadow: true,
})
export class XGithubLink {
    @State() private stargazers: number = 0;
    @State() private forks: number = 0;

    async componentWillLoad() {
        const data = await fetch('https://api.github.com/repos/una-xiv/umbra').then(r => r.json());
        this.stargazers = data?.stargazers_count ?? 0;
        this.forks = data?.forks_count ?? 0;
    }

    render() {
        return (
            <Host>
                <img src="images/github-mark-white.png"/>
                <main>
                    <div>
                        https://github.com/una-xiv/umbra
                    </div>
                    <footer>
                        <div>{this.stargazers} stars,</div>
                        <div>{this.forks} forks.</div>
                    </footer>
                </main>
            </Host>
        );
    }
}
