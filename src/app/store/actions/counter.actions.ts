import { createAction, props } from '@ngrx/store'

export const createCounterCategory = createAction(
  '[Counter] Create Counter Category',
  props<{ id: number; title: string }>()
)

export const renameCounterCategory = createAction(
  '[Counter] Rename Counter Category',
  props<{ id: number; title: string }>()
)

export const deleteCounterCategory = createAction(
  '[Counter] Delete Counter Category',
  props<{ id: number }>()
)

export const moveCounterCategory = createAction(
  '[Counter] Move Counter Category',
  props<{ id: number; newIndex: number }>()
)

export const createCounter = createAction(
  '[Counter] Create Counter',
  props<{ id: number; title: string; categoryId: number }>()
)

export const renameCounter = createAction(
  '[Counter] Rename Counter',
  props<{ id: number; title: string }>()
)

export const deleteCounter = createAction(
  '[Counter] Delete Counter',
  props<{ id: number }>()
)

export const incrementCounter = createAction(
  '[Counter] Increment Counter',
  props<{ id: number }>()
)

export const decrementCounter = createAction(
  '[Counter] Decrement Counter',
  props<{ id: number }>()
)

export const moveCounter = createAction(
  '[Counter] Move Counter',
  props<{ id: number; newIndex: number }>()
)
