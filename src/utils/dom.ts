type Child = Node | string;

/** 要素を生成する小さなヘルパー（XSS を避けるため textContent でテキストを注入する） */
export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  options: {
    readonly className?: string;
    readonly text?: string;
    readonly children?: readonly Child[];
    readonly attributes?: Readonly<Record<string, string>>;
  } = {}
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag);
  if (options.className !== undefined) element.className = options.className;
  if (options.text !== undefined) element.textContent = options.text;
  for (const [name, value] of Object.entries(options.attributes ?? {})) {
    element.setAttribute(name, value);
  }
  for (const child of options.children ?? []) {
    element.append(child);
  }
  return element;
}
