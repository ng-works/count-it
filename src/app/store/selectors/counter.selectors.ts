import { createFeatureSelector, createSelector } from '@ngrx/store'
import { CountersState } from '../models/counters-state'

const selectFeature = createFeatureSelector<CountersState>('counters')

export const selectCounterCategories = createSelector(
  selectFeature,
  (it) => it.categories
)

export const selectCategoryById = createSelector(
  selectFeature,
  (state: CountersState, id: number) =>
    state.categories.find((it) => it.id === id) || null
)
