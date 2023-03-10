import { createEffect } from "createEffect";
import { createSignal } from "createSignal";

function $insert(node, read) {
  if (!node) {
    return;
  }
  createEffect(() => {
    node.textContent = read();
  });
}

function $addEventListener(node, eventName, callback) {
  if (!node) {
    return;
  }
  node.addEventListener(eventName, callback);
}

function $template(html) {
  const template = document.createElement('template');
  template.innerHTML = html;
  const node = template.content.firstChild;
  return node;
}

const _template = $template(`<button></button>`);

function Demo() {
  const [count, setCount] = createSignal(0);
  const increment = () => setCount(prev => prev + 1);
  return (() => {
    const _element = _template.cloneNode(true);
    $addEventListener(_element, 'click', increment);
    $insert(_element, count);
    return _element;
  })();
}

const container = document.getElementById('app');
container.innerHTML = '';
container.append(Demo());
