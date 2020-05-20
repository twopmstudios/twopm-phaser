import { State, Action } from '../state'
import { apply } from '../apply'
import { Vec } from '../types'
import { EntityMap, ComponentMap, addEntity } from '../entity'
import { name } from '../components/index'
import { findEntityByName } from '../components/name'
import { EventStream, makeEventStream } from '../events'
import {
  GameEvent,
  sceneInitCompleted,
  userMouseClicked,
  GameEventType,
  filterEvent,
  colorToggled,
} from '../events/game'
import { Subscription, pipe } from 'rxjs'
import { filter } from 'rxjs/operators'
import { GameObjects } from 'phaser'

const listen = (fn: () => Subscription, list: Subscription[]) => {
  list.push(fn())
}

export default class Demo extends Phaser.Scene {
  actions: Action[] = []
  state: State = {
    timer: 0,
    orbitPos: Vec(0, 0),
    color: 'blue',
  }
  entities: EntityMap = {}
  components: ComponentMap = {}
  msgs: EventStream<GameEvent> = makeEventStream<GameEvent>('events')
  subscriptions: Subscription[] = []

  constructor() {
    super('GameScene')
  }

  init() {
    let s = this.msgs.stream

    listen(
      () =>
        s.subscribe((x) => {
          console.log('LOG', x)
        }),
      this.subscriptions
    )

    listen(
      () =>
        s.pipe(filterEvent<GameEvent>('USER_MOUSE_CLICKED')).subscribe((x) => {
          this.msgs.emit(colorToggled())
        }),
      this.subscriptions
    )

    listen(
      () =>
        s.pipe(filterEvent<GameEvent>('COLOR_TOGGLED')).subscribe((x) => {
          this.actions.push({
            type: 'toggle_color',
          })
        }),
      this.subscriptions
    )

    this.events.on('destroy', () => this.subscriptions.forEach((s) => s.unsubscribe()))

    this.input.on('pointerup', () => this.msgs.emit(userMouseClicked()))
  }

  preload() {
    this.load.image('twopm', 'assets/twopm.png')
  }

  create() {
    let twopm = this.add.image(0, 0, 'twopm')
    let twopmSmall = this.add.image(0, 0, 'twopm')
    twopmSmall.scale = 0.2
    let container = this.add.container(281, 609 - 40, [twopm, twopmSmall])

    addEntity(this.entities, this.components, twopm, [name('twopm')])
    addEntity(this.entities, this.components, twopmSmall, [name('twopm-small')])
    addEntity(this.entities, this.components, container, [name('container')])

    this.tweens.add({
      targets: container,
      y: 609 + 40,
      duration: 3000,
      ease: 'Sine.inOut',
      yoyo: true,
      repeat: -1,
    })

    this.msgs.emit(sceneInitCompleted())
  }

  logic(state: State): Action[] {
    let radius = 180

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

    // actions is mutated and cleared to reduce memory alloc
    this.actions.length = 0
    // console.log(this.state)

    findEntityByName(this.entities, this.components, 'twopm-small').forEach((e) => {
      ;(e as GameObjects.Image).tint = this.state.color === 'blue' ? 0x0000ff : 0xff0000
      // Need more brain to understand Phaser types
      ;(e as any).setPosition(this.state.orbitPos.x, this.state.orbitPos.y)
    })
  }
}
