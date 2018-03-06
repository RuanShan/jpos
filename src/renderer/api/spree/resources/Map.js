import Collection from '../resources/Collection'
import { pagination } from '../helpers'
import extractCollection from './extractCollection'

export default class Map {
  constructor (data, entities) {
    this.entities = entities
    this.pagination = pagination(data)
    this.data = []
    Object.keys(entities).forEach((key) => {
      const Entity = entities[key]
      const collection = Entity.collection
      const item = data[key]
      if (Array.isArray(item)) {
        const instance = new Collection({ [collection]: item }, Entity)
        this[key] = instance
        this.data.push(instance)
      } else {
        const instance = new Entity(item)
        this[key] = instance
        this.data.push(instance)
      }
    })
  }

  get collection () {
    return extractCollection(this.data)
  }
}
