import { createReducer, on } from '@ngrx/store'
import { update } from 'js-immutables'
import { CountersState } from '../models/counters-state'
import * as CounterAct from '../actions/counter.actions'

const defaultState: CountersState = {
  categories: [
    {
      id: 1,
      title: 'Category 1',
      counters: [
        {
          id: 1,
          title: 'Counter 1',
          count: 10,
          creation: new Date(),
          lastUpdate: new Date()
        }
      ]
    }
  ]
}

export const counterReducer = createReducer(
  defaultState,

  on(CounterAct.createCounterCategory, (state, { id, title }) =>
    update(state, 'categories').push({ id, title, counters: [] })
  ),

  on(CounterAct.renameCounterCategory, (state, { id, title }) =>
    update(state, 'categories').mapFirst(
      (category) => category.id === id,
      (category) => update(category).set('title', title)
    )
  ),

  on(CounterAct.deleteCounterCategory, (state, { id }) =>
    update(state, 'categories').removeFirst((it) => it.id === id)
  ),

  on(CounterAct.moveCounterCategory, (state, { id, newIndex }) => {
    const oldIndex = state.categories.findIndex((it) => it.id === id)

    if (
      oldIndex === -1 ||
      oldIndex === newIndex ||
      newIndex >= state.categories.length
    ) {
      return state
    }

    const categories = state.categories.filter((it) => it.id !== id)
    categories.splice(newIndex, 0, state.categories[oldIndex])

    return update(state).set('categories', categories)
  }),

  on(CounterAct.createCounter, (state, { id, title, categoryId }) => {
    const now = new Date()

    return update(state, 'categories').mapFirst(
      (it) => it.id === categoryId,
      (it) =>
        update(it, 'counters').push({
          id,
          title,
          count: 0,
          creation: now,
          lastUpdate: now
        })
    )
  }),

  on(CounterAct.incrementCounter, (state, { id }) => {
    const [
      categoryIndex,
      counterIndex
    ] = getCategoryIndexAndCounterIndexByCounterId(state, id)

    if (categoryIndex === -1) {
      return state
    }

    return update(state, function* (select) {
      const path = select('categories', categoryIndex, 'counters', counterIndex)

      yield path.map('count', (it) => it + 1)
      yield path.set('lastUpdate', new Date())
    })
  }),

  on(CounterAct.decrementCounter, (state, { id }) => {
    const [
      categoryIndex,
      counterIndex
    ] = getCategoryIndexAndCounterIndexByCounterId(state, id)

    if (categoryIndex === -1) {
      return state
    }

    const ret = update(state, function* (select) {
      const path = select('categories', categoryIndex, 'counters', counterIndex)
      console.log(4444, path)
      yield path.map('count', (it) => it - 1)
      yield path.set('lastUpdate', new Date())
    })

    return ret
  }),

  on(CounterAct.decrementCounter, (state, { id }) =>
    update(state, 'categories').removeFirst((it) => it.id === id)
  )
)

// locals

function getCategoryIndexAndCounterIndexByCounterId(
  state: CountersState,
  counterId: number
): [number, number] {
  for (let i = 0; i < state.categories.length; ++i) {
    const category = state.categories[i]

    for (let j = 0; j < category.counters.length; ++j) {
      const counter = category.counters[j]

      if (counter.id === counterId) {
        return [i, j]
      }
    }
  }

  return [-1, -1]
}
