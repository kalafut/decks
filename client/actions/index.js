import { DECK_EDIT, GOTO_PAGE } from '../actions/actionTypes'

export const nextMode = () => { return { type: 'NEXT_MODE' } }
export const deckEdit = (id) => { return { id, type: DECK_EDIT } }
export const newDeck = () => { return { type: GOTO_PAGE, page: 'newDeck' } }
