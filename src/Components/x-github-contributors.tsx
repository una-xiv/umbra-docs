import {Component, h, Host, State} from "@stencil/core";

@Component({
    tag: 'x-github-contributors',
    styleUrl: 'x-github-contributors.scss',
    shadow: true,
})
export class XGithubContributors {

    @State() private contributors: any[] = [];

    async componentDidLoad() {
        this.contributors = await fetch('https://api.github.com/repos/una-xiv/umbra/contributors').then(r => r.json());
    }

    render() {
        return (
            <Host>
                {this.contributors.map(c => (
                    <a href={c.html_url} target="_blank" title={c.login}>
                        <div class="user" style={{'--avatar': `url(${c.avatar_url})`}}/>
                    </a>
                ))}
            </Host>
        );
    }
}
