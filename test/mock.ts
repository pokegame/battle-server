import { Socket } from '../src/Connection'

export function createSocket(): Socket {
  return { send: (message) => {} }
}
