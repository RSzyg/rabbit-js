import { createEffect } from 'createEffect';
import { createSignal } from 'createSignal';

function $insert(node, read) {
  if (!node) {
    return;
  }
  createEffect(() => {
    node.textContent = read();
  });
}

const $EVENTS = '$r_events';

function $delegateEvent(eventNames, mountNode = window.document) {
  const eventSet = mountNode[$EVENTS] || (mountNode[$EVENTS] = new Set());
  for (let i = 0; i < eventNames.length; i++) {
    const name = eventNames[i];
    if (!eventSet.has(name)) {
      eventSet.add(name);
      document.addEventListener(name, $eventHandler);
    }
  }
}

function $eventHandler(event) {
  const key = `$r_${event.type}`;
  let node = (event.composedPath && event.composedPath()[0]) || event.target;
  if (node !== event.target) {
    Object.defineProperty(event, 'target', {
      configurable: true,
      value: node,
    });
  }

  Object.defineProperty(event, 'currentTarget', {
    configurable: true,
    get() {
      return node || document;
    }
  });

  while(node) {
    const handler = node[key];
    if (handler) {
      handler.call(node, event);
      // TODO: make customized event cancel
      if (event.cancelBubble) {
        return;
      }
    }
    node = node.parentNode;
  }
};

function $template(html) {
  const template = document.createElement('template');
  template.innerHTML = html;
  const node = template.content.firstChild;
  return node;
}

const _template = $template(`<button></button>`);

function Demo() {
  const [count, setCount] = createSignal(0);
  const increment = () => setCount((prev) => prev + 1);
  return (() => {
    const _element = _template.cloneNode(true);
    _element.$r_click = increment;
    $insert(_element, count);
    return _element;
  })();
}
$delegateEvent(['click']);

const container = document.getElementById('app');
container.innerHTML = '';
container.append(Demo());
