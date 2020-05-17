import { EntityMap, ComponentMap } from '../entity'

export let findEntityByName = (
  entities: EntityMap,
  components: ComponentMap,
  name: string
) =>
  Object.values(components)
    .filter((c) => c.type == 'name' && c.name === name)
    .map((c) => entities[c.entityId])
