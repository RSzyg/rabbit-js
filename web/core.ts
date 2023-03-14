import { createEffect } from "./createEffect.js";

let $root: Element | null = null;

export function render(
  componentCreator: () => Element,
  container: Element | null
) {
  if (!container) {
    return;
  }
  $root = container;
  const dom = componentCreator();
  if (!dom) {
    return;
  }
  container.textContent = "";
  container.append(dom);
}

export function createComponent<P>(component: (props: P) => Element, props: P) {
  const dom = component(props);

  // TODO: handle lifecycle

  return dom;
}

export function insert<T>(node: Element, read: () => T) {
  if (!node) {
    return;
  }
  createEffect(() => {
    const value = read();
    if (typeof value === "string" || typeof value === "number") {
      node.textContent = `${value}`;
    }
    // TODO: other value type
  });
}

const $nodeToEventList = new WeakMap<Element | Document, Set<string>>();

const $nodeToEventHandler = new WeakMap<
  Node,
  Map<string, (...args: any) => void>
>();

export function addEventListener(node: Node, eventName: string, handler: (...args: any) => void) {
  if (!$nodeToEventHandler.has(node)) {
    $nodeToEventHandler.set(node, new Map());
  }
  // It should be exist, asserts here
  $nodeToEventHandler.get(node)!.set(eventName, handler);
}

export function delegateEvent(
  eventNames: string[],
  mountNode: Element | Document | null
) {
  if (!mountNode) {
    mountNode = $root || window.document;
  }
  if (!$nodeToEventList.has(mountNode)) {
    $nodeToEventList.set(mountNode, new Set());
  }
  // eventSet should be exist, asserts here
  const eventSet = $nodeToEventList.get(mountNode)!;
  for (let i = 0; i < eventNames.length; i++) {
    const name = eventNames[i];
    if (!eventSet.has(name)) {
      eventSet.add(name);
      document.addEventListener(name, _eventHandler);
    }
  }
}

function _getNode(eventTarget: EventTarget | null) {
  if (!eventTarget || !("nodeType" in eventTarget)) {
    return null;
  }
  return eventTarget as Node;
}

function _eventHandler(event: Event) {
  let node = _getNode(
    (event.composedPath && event.composedPath()[0]) || event.target
  );
  if (node !== event.target) {
    Object.defineProperty(event, "target", {
      configurable: true,
      value: node,
    });
  }

  Object.defineProperty(event, "currentTarget", {
    configurable: true,
    get() {
      return node || document;
    },
  });

  while (node) {
    const handler = $nodeToEventHandler.get(node)?.get(event.type);
    if (handler) {
      handler.call(node, event);
      // TODO: make customized event cancel
      if (event.cancelBubble) {
        return;
      }
    }
    node = node.parentNode;
  }
}

export function template(html: string) {
  const template = document.createElement("template");
  template.innerHTML = html;
  const node = template.content.firstChild;
  return node;
}
