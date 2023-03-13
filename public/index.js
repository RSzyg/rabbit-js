import { createSignal, createEffect } from 'rabbit-js/web';

let $root = null;

function $render(componentCreator, container) {
  if (!container) {
    return;
  }
  $root = container;
  const dom = componentCreator();
  if (!dom) {
    return;
  }
  container.textContent = '';
  container.append(dom);
}

function $createComponent(component, props) {
  const dom = component(props);

  // TODO: handle lifecycle

  return dom;
}

function $insert(node, read) {
  if (!node) {
    return;
  }
  createEffect(() => {
    node.textContent = read();
  });
}

const $EVENTS = '$r_events';

function $delegateEvent(eventNames, mountNode) {
  if (!mountNode) {
    mountNode = $root || window.document;
  }
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

function Button(props) {
  // JSX
  // return <button onClick={props.onClick}>{props.value}</button>;
  // =>
  return (() => {
    const _element = _template.cloneNode(true);
    _element.$r_click = props.onClick;
    $insert(_element, props.value);
    return _element;
  })();
}

function Demo() {
  const [count, setCount] = createSignal(0);
  const increment = () => setCount((prev) => prev + 1);
  // JSX
  // return <Button value={count} onClick={increment} />
  // =>
  return $createComponent(Button, {
    value: count,
    onClick: increment,
  });
}

$render(() => $createComponent(Demo, {}), document.getElementById('app'));
$delegateEvent(['click']);
