import { createEffect } from "createEffect";
import { createSignal } from "createSignal";

function $getNode(fragmentNode) {
  if (!fragmentNode) {
    return null;
  }
  return fragmentNode.firstChild;
}

function $insert(fragmentNode, read) {
  const node = $getNode(fragmentNode);
  if (!node) {
    return;
  }
  createEffect(() => {
    node.textContent = read();
  });
}

function $addEventListener(fragmentNode, eventName, callback) {
  const node = $getNode(fragmentNode);
  if (!node) {
    return;
  }
  node.addEventListener(eventName, callback);
}

const _template = document.createElement('template');
_template.innerHTML = `<button></button>`;

function Demo() {
  const [count, setCount] = createSignal(0);
  const increment = () => setCount(prev => prev + 1);
  return (() => {
    const _element = _template.content.cloneNode(true);
    $addEventListener(_element, 'click', increment);
    $insert(_element, count);
    return _element;
  })();
}

const container = document.getElementById('app');
container.innerHTML = '';
container.append(Demo());
