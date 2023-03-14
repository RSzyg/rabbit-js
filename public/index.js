import {
  createSignal,
  template,
  insert,
  createComponent,
  render,
  delegateEvent,
  addEventListener,
} from "rabbit-js/web";

const $template = template(`<button></button>`);

function Button(props) {
  // JSX
  // return <button onClick={props.onClick}>{props.value}</button>;
  // =>
  return (() => {
    const _element = $template.cloneNode(true);
    addEventListener(_element, "click", props.onClick);
    insert(_element, props.value);
    return _element;
  })();
}

function Demo() {
  const [count, setCount] = createSignal(0);
  const increment = () => setCount((prev) => prev + 1);
  // JSX
  // return <Button value={count} onClick={increment} />
  // =>
  return createComponent(Button, {
    value: count,
    onClick: increment,
  });
}

render(() => createComponent(Demo, {}), document.getElementById("app"));
delegateEvent(["click"]);
