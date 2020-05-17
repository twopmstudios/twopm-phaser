import { makeId } from './id'
import { Component } from './components'

export type Id = string
export type EntityMap = { [k: string]: Phaser.GameObjects.GameObject }
export type ComponentMap = { [k: string]: Component }

export let addEntity = (
  entities: EntityMap,
  components: ComponentMap,
  e: Phaser.GameObjects.GameObject,
  addComponents?: Component[]
) => {
  let id = makeId()
  entities[id] = e

  if (addComponents) {
    addComponents.forEach((c) => addComponent(components, id, c))
  }

  return id
}

export let addComponent = (components: ComponentMap, entityId: Id, c: Component) => {
  let id = makeId()
  components[id] = c
  c.entityId = entityId
}
