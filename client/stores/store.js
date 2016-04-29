import request from 'superagent'

var DRILL = 0;
var EDIT = 1;
var STUDENT = 2;
var MODE_CNT = 3;

var RIGHT = 1;
var WRONG = 0;

let next_id = -1

let state = {
  words:[
    {id: next_id--, word: "dog", box:0},
    {id: next_id--, word: "cat", box:0},
  ],
  students:[
    {id: next_id--, name: "Ben"},
    {id: next_id--, name: "Laura"},
  ],
  mode: EDIT,
  activeCard : null
}

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min)) + min;
}

state.activeCard = state.words[getRandomInt(0, state.words.length)]

let observer

export const getState = () => { return state }
export const register = (cb) => { observer = cb }
const notify = () => { observer() }

export const dispatch = (action, data) => {
  if(action in actions) {
    actions[action](data)
    notify()
  } else {
    throw("Unknown action: " + action)
  }
}

let actions = {
  'ADD_STUDENT': (name) => {
    state.students = [...state.students, {id: next_id--, name}]
  },
  'RM_STUDENT': (id) => {
    state.students = state.students.filter((s)=>{ return s.id != id })
  },
  'NEXT_MODE': () => {
    state.mode = (state.mode + 1) % MODE_CNT
  },
  'FETCH_WORDS': () => {
    var self = this;
    request
    .get('/words')
    .end(function(err, res){
      let data = JSON.parse(res.text)
      state.words = data
      notify()
    })},
  'ADD_WORD': (word) => {
    state.words = [...state.words, {id: next_id--, word:word, box:0}]
    request
    .post('/word/add')
    .send({front:word})
    .end(function(err,res) {
    });
  },
  'CARD_RESULT': ({ id, correct }) => {
    state.words = state.words.map((e) => {
      if(e.id == id) {
        e = {
          id: e.id,
          word: e.word,
          box: correct ? e.box + 1 : 0
        }
      }
      return e
    })
    state.activeCard = state.words[getRandomInt(0, getState().words.length)]
  },
  'NEXT_CARD': () => {
    state.activeCard = state.words[getRandomInt(0, getState().words.length)]
  },
}
