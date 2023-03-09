export const $context = [];

export function $getCurrentSubscriber() {
  return $context[$context.length - 1];
}
