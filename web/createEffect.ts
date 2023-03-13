import { $context } from './context.js';

export function createEffect(fn: () => void) {
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
