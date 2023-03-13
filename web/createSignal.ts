import { $getCurrentSubscriber } from './context.js';

export function createSignal<T>(value: T) {
  const subscribers = new Set<() => void>();

  const read = () => {
    const subscriber = $getCurrentSubscriber();
    subscriber && subscribers.add(subscriber);
    return value;
  };

  const write = (nextValue: T) => {
    if (typeof nextValue === 'function') {
      nextValue = nextValue(value);
    }
    value = nextValue;
    for (const subscriber of subscribers) {
      subscriber();
    }
  };

  return [read, write];
}
