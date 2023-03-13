export const $context: (() => void)[] = [];

export function $getCurrentSubscriber() {
  return $context[$context.length - 1];
}
