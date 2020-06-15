import { Counter } from './counter.model'

export interface Category {
  id: number
  title: string
  counters: Counter[]
}
