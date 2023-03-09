import { $getCurrentSubscriber } from 'context';

export function createSignal(value) {
  const subscribers = new Set();

  const read = () => {
    const subscriber = $getCurrentSubscriber();
    subscriber && subscribers.add(subscriber);
    return value;
  };

  const write = (nextValue) => {
    value = nextValue;
    for (const subscriber of subscribers) {
      subscriber();
    }
  };

  return [read, write];
}
