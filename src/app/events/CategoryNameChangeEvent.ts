export interface CategoryNameChangeEvent {
  type: 'categoryNameChange',
  categoryId: number,
  newName: string
}