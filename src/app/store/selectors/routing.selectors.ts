import { createFeatureSelector, createSelector } from '@ngrx/store'
import { CountersState } from '../models/counters-state'
import {
  selectCategoryById,
  selectCounterCategories
} from './counter.selectors'

const selectFeature = createFeatureSelector<any>('routerReducer')

export const selectRouterState = createSelector(selectFeature, (it) => it.state)

export const selectCounterCategoryId = createSelector(
  selectRouterState,
  (it) => +it.params.categoryId || null
)

export const selectCounterCategory = createSelector(
  selectCounterCategoryId,
  selectCounterCategories,
  (id, categories) => categories.find((it) => it.id === id) || null
)
