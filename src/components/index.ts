import { Id } from '../entity'

export type Component =
  | { entityId: Id; type: 'name'; name: string }
  | { entityId: Id; type: 'age'; age: number }

export let name = (n: string) => ({ entityId: null, type: 'name', name: n } as const)
export let age = (n: number) => ({ entityId: null, type: 'age', age: n } as const)
