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
            this.applyStyle("top", top);
        }
        if (left) {
            this.applyStyle("left", left);
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
            const { top } = this.recalcHeight(elRect, areaRect);
            const { left } = this.recalcWidth(elRect, areaRect);
            this.applyStyle("top", `${top}px`);
            this.applyStyle("left", `${left}px`);
        }
    }
    recalcHeight(elementRect, areaRect) {
        if (elementRect.top < areaRect.top) {
            return { ...elementRect.toJSON(), top: areaRect.top };
        }
        else if (elementRect.bottom > areaRect.bottom) {
            const diff = elementRect.bottom - areaRect.bottom;
            return { ...elementRect.toJSON(), top: elementRect.top - diff };
        }
        return elementRect;
    }
    recalcWidth(elementRect, areaRect) {
        if (elementRect.left < areaRect.left) {
            return { ...elementRect.toJSON(), left: areaRect.left };
        }
        else if (elementRect.right > areaRect.right) {
            const diff = elementRect.right - areaRect.right;
            return { ...elementRect.toJSON(), left: elementRect.left - diff };
        }
        return elementRect;
    }
    get areaRect() {
        return document.querySelector(".area")?.getBoundingClientRect() ?? null;
    }
    get hostRect() {
        return this.shadowRoot?.host.getBoundingClientRect() ?? null;
    }
}
customElements.define("restricted-modal", RestrictedModal);
