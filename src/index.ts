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

interface Attrs {
  top: string; // px
  left: string; // px
  show: "true" | "false";
}
type AttrName = keyof Attrs;

class RestrictedModal extends HTMLElement {
  static get observedAttributes() {
    return ["top", "left", "show"];
  }

  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: "open" });

    if ((template as any).content) {
      shadowRoot.appendChild((template as any).content.cloneNode(true));
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

  attributeChangedCallback<T extends AttrName>(
    name: T,
    oldValue: Attrs[T],
    newValue: Attrs[T]
  ) {
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

  private applyStyle<T extends keyof CSSStyleDeclaration>(
    name: T,
    value: CSSStyleDeclaration[T]
  ) {
    if (this.shadowRoot) {
      (this.shadowRoot.host as HTMLElement).style[name] = value;
    }
  }

  private recalc(): void {
    const elRect = this.hostRect;
    const areaRect = this.areaRect;

    if (elRect && areaRect) {
      const { top } = this.recalcHeight(elRect, areaRect);
      const { left } = this.recalcWidth(elRect, areaRect);
      this.applyStyle("top", `${top}px`);
      this.applyStyle("left", `${left}px`);
    }
  }

  private recalcHeight(elementRect: DOMRect, areaRect: DOMRect): DOMRect {
    if (elementRect.top < areaRect.top) {
      return { ...elementRect.toJSON(), top: areaRect.top };
    } else if (elementRect.bottom > areaRect.bottom) {
      const diff = elementRect.bottom - areaRect.bottom;
      return { ...elementRect.toJSON(), top: elementRect.top - diff };
    }
    return elementRect;
  }

  private recalcWidth(elementRect: DOMRect, areaRect: DOMRect): DOMRect {
    if (elementRect.left < areaRect.left) {
      return { ...elementRect.toJSON(), left: areaRect.left };
    } else if (elementRect.right > areaRect.right) {
      const diff = elementRect.right - areaRect.right;
      return { ...elementRect.toJSON(), left: elementRect.left - diff };
    }
    return elementRect;
  }

  private get areaRect(): DOMRect | null {
    return document.querySelector(".area")?.getBoundingClientRect() ?? null;
  }

  private get hostRect(): DOMRect | null {
    return this.shadowRoot?.host.getBoundingClientRect() ?? null;
  }
}

customElements.define("restricted-modal", RestrictedModal);
