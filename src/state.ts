import { Vec2d } from './types'

// reducers / redux inspired pattern minimising memory alloc
// instead of using immutable spread operators we use mutable writes
// if I find the performance tradeoff is insignificant I may return to spread
// or I might use immy / immutablejs
export type Action =
  | { type: 'update_position'; position: Vec2d }
  | { type: 'timer_tick' }
  | { type: 'toggle_color' }

export type State = {
  timer: number
  orbitPos: Vec2d
  color: 'red' | 'blue'
}

let writeOrbitPosition = (s: State, pos: Vec2d) => (s.orbitPos = pos)
let writeTimer = (s: State, timer: number) => (s.timer = timer)
let writeColor = (s: State, color: 'red' | 'blue') => (s.color = color)

export let reducer = (s: State, p: Action) => {
  switch (p.type) {
    case 'update_position':
      writeOrbitPosition(s, p.position)
      break
    case 'timer_tick':
      writeTimer(s, s.timer + 0.005)
      break
    case 'toggle_color':
      writeColor(s, s.color === 'red' ? 'blue' : 'red')
      break
  }
  return s
}
