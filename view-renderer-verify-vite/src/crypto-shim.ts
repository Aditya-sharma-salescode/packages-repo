// Browser shim for Node's crypto module.
// uuid's Node rng uses crypto.randomFillSync which doesn't exist in browsers.
// This shim bridges to the Web Crypto API (crypto.getRandomValues).

export function randomFillSync(buf: Uint8Array): Uint8Array {
  return globalThis.crypto.getRandomValues(buf) as Uint8Array
}

export function randomUUID(): string {
  return globalThis.crypto.randomUUID()
}

export default { randomFillSync, randomUUID }
