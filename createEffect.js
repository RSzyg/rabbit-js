import { $context } from 'context';

export function createEffect(fn) {
  const execute = () => {
    $context.push(execute);
    try {
      fn();
    } finally {
      $context.pop();
    }
  };
  execute();
}
