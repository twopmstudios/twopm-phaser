import { State, Action, reducer } from './state'

export let apply = (state: State) => (patch: Action[]) => {
  return patch.reduce((acc, n) => reducer(acc, n), state)
}
