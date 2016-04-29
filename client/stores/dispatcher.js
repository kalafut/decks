import { state, actions } from './store'

let observer

export const dispatch = (action, data) => {
  if(action in actions) {
    actions[action](data)
    notify()
  } else {
    throw("Unknown action: " + action)
  }
}

export const getState = () => { return state }
export const register = (cb) => { observer = cb }
export const notify = () => { observer() }

