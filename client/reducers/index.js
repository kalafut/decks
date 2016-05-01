import { combineReducers } from 'redux'
import { DECK_EDIT } from '../actions/actionTypes'

let nextId = -1

const DRILL = 0
const EDIT = 1
const STUDENT = 2
const MODE_CNT = 3

let defaultState = {
  page: 'DECK_LIST',
  decks: [
    {id: nextId--, name: "First", student: ""},
    {id: nextId--, name: "Second", student: "Ben"},
  ],
  cards: [
    { id: nextId--, front: "dog", back: "A furry pet" },
    { id: nextId--, front: "pizza", back: "A yummy food" },
  ]
}

const decksApp = (state = defaultState, action) => {
  switch (action.type) {
      case DECK_EDIT:
          return Object.assign({}, state, {
            page: 'DECK_EDIT'
          })
      default:
          return state
  }
}

export default decksApp

