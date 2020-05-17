import { State, Action } from '../state'
import { apply } from '../apply'
import { Vec } from '../types'
import { EntityMap, ComponentMap, addEntity } from '../entity'
import { name } from '../components/index'
import { findEntityByName } from '../components/name'

export default class Demo extends Phaser.Scene {
  actions: Action[] = []
  state: State = {
    timer: 0,
    orbitPos: Vec(0, 0),
  }
  entities: EntityMap = {}
  components: ComponentMap = {}

  constructor() {
    super('GameScene')
  }

  preload() {
    this.load.image('twopm', 'assets/twopm.png')
  }

  create() {
    let twopm = this.add.image(0, 0, 'twopm')
    let twopmSmall = this.add.image(0, 0, 'twopm')
    twopmSmall.scale = 0.2
    let container = this.add.container(400, 200, [twopm, twopmSmall])

    addEntity(this.entities, this.components, twopm, [name('twopm')])
    addEntity(this.entities, this.components, twopmSmall, [name('twopm-small')])
    addEntity(this.entities, this.components, container, [name('container')])

    this.tweens.add({
      targets: container,
      y: 240,
      duration: 3000,
      ease: 'Sine.inOut',
      yoyo: true,
      repeat: -1,
    })
  }

  logic(state: State): Action[] {
    let radius = 180
    // actions is mutated and cleared to reduce memory alloc
    this.actions.length = 0

    // future: event loop
    // events are dispatched and listeners are updated (rxjs backed)
    // subscribers can emit events in response, handled synchronously
    // subscribers have access to an addAction function to express indended side effects
    // managers and supervisors can also recieve a poll here, letting them trigger actions
    // aggregated actions are passed to apply etc.

    this.actions.push({
      type: 'timer_tick',
    })

    this.actions.push({
      type: 'update_position',
      position: Vec(radius * Math.cos(state.timer), radius * Math.sin(state.timer)),
    })

    return this.actions
  }

  update() {
    let patch = this.logic(this.state)
    this.state = apply(this.state)(patch)

    findEntityByName(this.entities, this.components, 'twopm-small').forEach((e) =>
      // Need more brain to understand Phaser types
      (e as any).setPosition(this.state.orbitPos.x, this.state.orbitPos.y)
    )
  }
}
