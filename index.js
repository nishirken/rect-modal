"use strict";
const template = document.createElement("template");
template.innerHTML = `
    <slot name="children"></slot>
`;
const style = document.createElement("style");
style.textContent = `
  :host {
    position: absolute;
    top: 0;
    left: 0;
    visibility: hidden;
  }
`;
class RestrictedModal extends HTMLElement {
    static get observedAttributes() {
        return ["top", "left", "show"];
    }
    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: "open" });
        if (template.content) {
            shadowRoot.appendChild(template.content.cloneNode(true));
        }
        if (style.textContent) {
            shadowRoot.appendChild(style);
        }
    }
    connectedCallback() {
        const top = this.shadowRoot?.host.getAttribute("top");
        const left = this.shadowRoot?.host.getAttribute("left");
        if (top) {
            this.applyStyle("top", `${top}px`);
        }
        if (left) {
            this.applyStyle("left", `${left}px`);
        }
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (this.shadowRoot === null) {
            return;
        }
        switch (name) {
            case "show":
                if (newValue === "true") {
                    this.recalc();
                    this.applyStyle("visibility", "visible");
                }
        }
    }
    applyStyle(name, value) {
        if (this.shadowRoot) {
            this.shadowRoot.host.style[name] = value;
        }
    }
    recalc() {
        const elRect = this.hostRect;
        const areaRect = this.areaRect;
        if (elRect && areaRect) {
            this.recalcHeight(elRect, areaRect);
            // this.recalcWidth(elRect, areaRect);
        }
    }
    recalcHeight(elementRect, areaRect) {
        if (this.shadowRoot === null) {
            return;
        }
        if (elementRect.top < areaRect.top) {
            this.applyStyle("top", `${areaRect.top}px`);
        }
        else if (elementRect.bottom > areaRect.bottom) {
            const diff = elementRect.bottom - areaRect.bottom;
            this.applyStyle("top", `${elementRect.top - diff}px`);
        }
    }
    // private recalcWidth(elementRect: DOMRect, areaRect: DOMRect): void {}
    get areaRect() {
        return document.querySelector(".area")?.getBoundingClientRect() ?? null;
    }
    get hostRect() {
        return this.shadowRoot?.host.getBoundingClientRect() ?? null;
    }
}
customElements.define("restricted-modal", RestrictedModal);
