import request from 'superagent'
import { combineReducers } from 'redux'

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
      case 'DECK_EDIT':
          return Object.assign({}, state, {
            page: 'DECK_EDIT'
          })
      case 'LOAD_DECKS':
          return Object.assign({}, state, {
            decks: action.data.decks
          })
      case 'GOTO_PAGE':
          return Object.assign({}, state, {
            page: action.page
          })
      default:
          return state
  }
}

export const requestDecks = (store) => {
    request
    .get('/decks')
    .end((err, res) => {
      store.dispatch({
        type: 'LOAD_DECKS',
        data: res.body
      })
    })
}

export default decksApp

