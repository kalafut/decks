import React from 'react';
import request from 'superagent';
import { Students } from './students';
import { getState, register, dispatch } from '../stores/store'

var DRILL = 0;
var EDIT = 1;
var STUDENT = 2;
var MODE_CNT = 3;

var RIGHT = 1;
var WRONG = 0;

// Set next_id to well out of range of what is coming from the database
var next_id = -1;

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

class Frame extends React.Component {
  render() {
    return(
      <div className="pure-g">
        <div className="pure-u-1-5"></div>
        <div className="pure-u-3-5">
          <App/>
        </div>
        <div className="pure-u-1-5"></div>
      </div>
    )
  }
}
export default Frame;

class App extends React.Component {
  constructor(props) {
    super(props);
    register(() => { this.setState(getState()) })


    /*
    this.state = {
      words:[
        {id: next_id--, word: "dog", box:0},
        {id: next_id--, word: "cat", box:0},
      ],
      students:[
        {id: next_id--, name: "Ben"},
        {id: next_id--, name: "Laura"},
      ],
      mode: EDIT,
    };
    */
    this.state = getState()
    //this.apiUpdate();
  }

  componentDidMount() {
    dispatch('FETCH_WORDS')
  }

  handleResult(id, result) {
    var self = this;
    var newBox;

    var updated = this.state.words.map((e)=>{
      if(e.id == id) {
        var wordUpdt = {
          id: e.id,
          word: e.word,
          box: result == RIGHT ? e.box + 1 : 0
        };
        newBox = wordUpdt.box;
        return wordUpdt;
      } else {
        return e;
      }
    });
    this.setState({ words: updated });

    request
    .post('/words')
    .send({id:id, box: newBox})
    .end(function(err, res) {
    });

  }
  render() {
    var content;

    switch(this.state.mode) {
      case EDIT:
          content = <WordEditor/>;
          break;
      case DRILL:
          content = <WordDrill handleResult={this.handleResult.bind(this)}/>;
          break;
      case STUDENT:
          //content = <div>Hi</div>
          content = <Students/>;
          break;
    }

    return (
      <div>
      <button className="pure-button pure-button-primary" onClick={dispatch.bind(this, 'NEXT_MODE')}>Mode</button>
      <br/>
      {content}
      </div>
    )
  }
}


class WordDrill extends React.Component {
  average() {
    var total = 0;
    getState().words.forEach((e)=>{
      total += e.box;
    });
    return total / getState().words.length;
  }

  render() {
    let word = getState().activeCard
    return(
      <div>
        <div>{this.average()}</div>
        <div>{word.word} ({word.box})</div>
        <button className="pure-button button-success" onClick={dispatch.bind(this, 'CARD_RESULT', { id: word.id, correct: true } )}>Right</button>
        <button className="pure-button button-error" onClick={dispatch.bind(this, 'CARD_RESULT', { id: word.id, correct: false } )}>Wrong</button>
      </div>
    );
  }
}

class WordEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = { newWord:"" };
  }

  handleNewWordChange(e) {
    this.setState({newWord:e.target.value});
  }

  addWord(e) {
    this.props.addWord(this.state.newWord);
    this.setState({ newWord: "" });
  }

  render() {
      return(
        <div>
          <ul>
          {getState().words.map((word)=>{
            return <li key={word.id}>{word.word}</li>
          })}
          </ul>
          <input
            type="text"
            value={this.state.newWord}
            onChange={this.handleNewWordChange.bind(this)}
          />
          <button onClick={this.addWord.bind(this)}>Add</button>
        </div>
      );
  }
}
