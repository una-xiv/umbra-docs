import {Component, Element, h, Prop} from "@stencil/core";

@Component({
    tag: 'x-button',
    styleUrl: 'x-button.scss',
    shadow: true,
})
export class XButton {
    @Prop({reflect: true}) href: string = '';

    @Element() el: HTMLElement;

    componentDidLoad()
    {
        this.el.addEventListener('click', () => {
            if (this.href) {
                document.location = `#${this.href}`;
            }
        });
    }

    render() {
        return (
            <slot/>
        );
    }
}
