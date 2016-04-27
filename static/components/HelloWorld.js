import React from 'react';
import request from 'superagent';
import { Students } from './students';
import { getState, register, dispatch } from './store'

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

  apiUpdate() {
    var self = this;
    request
    .get('/words')
    .end(function(err, res){
      var data = JSON.parse(res.text);
      self.setState({words: data});
    });
  }

  addWord(word) {
    this.setState({words: this.state.words.concat({id: next_id++, word:word, box:0})});
    request
    .post('/word/add')
    .send({front:word})
    .end(function(err,res) {
    });
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
          content = <WordEditor words={this.state.words} addWord={this.addWord.bind(this)}/>;
          break;
      case DRILL:
          content = <WordDrill words={this.state.words} handleResult={this.handleResult.bind(this)}/>;
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
  constructor(props) {
    super(props);
    this.state = {
      idx: getRandomInt(0, this.props.words.length)
    }
  }

  average() {
    var total = 0;
    this.props.words.forEach((e)=>{
      total += e.box;
    });
    return total / this.props.words.length;
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props !== nextProps;
  }

  handleRight(e) {
    this.props.handleResult(this.word().id, RIGHT);
    this.updateState();
  }

  handleWrong(e) {
    this.props.handleResult(this.word().id, WRONG);
    this.updateState();
  }

  word() {
    return this.props.words[this.state.idx];
  }

  updateState() {
    this.setState({
      idx: getRandomInt(0, this.props.words.length)
    });
  }

  render() {
    var word = this.word();
    return(
      <div>
        <div>{this.average()}</div>
        <div>{word.word} ({word.box})</div>
        <button className="pure-button button-success" onClick={this.handleRight.bind(this)}>Right</button>
        <button className="pure-button button-error" onClick={this.handleWrong.bind(this)}>Wrong</button>
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
          {this.props.words.map((word)=>{
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
