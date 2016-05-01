import { DECK_EDIT } from '../actions/actionTypes'

export const nextMode = () => { return { type: 'NEXT_MODE' } }
export const deckEdit = (id) => { return { id, type: DECK_EDIT } }
