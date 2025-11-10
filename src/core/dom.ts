export function setStyleProperty(DOM: HTMLElement, property: string, value: string | null,): void {
  return DOM.style.setProperty(property, value);
}

export function removeStyleProperty(DOM: HTMLElement, property: string): string {
  return DOM.style.removeProperty(property);
}