import { connect } from 'react-redux'
import { toggleTodo } from '../actions'
import { Frame } from '../components/HelloWorld'
import { nextMode } from '../actions'

const mapStateToProps = (state) => {
  return {
    mode: state.mode,
    test: "hello"
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onModeClick: () => {
      dispatch(nextMode())
    }
  }
}

export const AppContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Frame)

