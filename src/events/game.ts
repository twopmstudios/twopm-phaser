import { filter } from 'rxjs/operators'

export const userMouseClicked = () => ({ type: 'USER_MOUSE_CLICKED' } as const)
export const colorToggled = () => ({ type: 'COLOR_TOGGLED' } as const)
export const sceneInitCompleted = () => ({ type: 'SCENE_INIT_COMPLETED' } as const)

type Typed<T> = { type: T }

export let filterEvent = <TEvent extends Typed<TEvent['type']>>(
  desired: TEvent['type']
) => filter((x: TEvent) => x.type === desired)

export type GameEvent =
  | ReturnType<typeof userMouseClicked>
  | ReturnType<typeof colorToggled>
  | ReturnType<typeof sceneInitCompleted>

export type GameEventType = GameEvent['type']
