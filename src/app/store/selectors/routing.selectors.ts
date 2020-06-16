import { createFeatureSelector, createSelector } from '@ngrx/store'
import { CountersState } from '../models/counters-state'

const selectFeature = createFeatureSelector<any>('routerReducer')

export const selectRouterState = createSelector(selectFeature, (it) => it.state)

export const selectCategoryId = createSelector(
  selectRouterState,
  (it) => +it.params.categoryId || null
)
