var DRILL = 0;
var EDIT = 1;
var RIGHT = 1;
var WRONG = 0;

var max_id = 0;
var request = window.superagent;

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      words:[
        {id: max_id++, word: "dog", box:0},
        {id: max_id++, word: "cat", box:0},
      ],
      mode: EDIT,
    };
    this.apiUpdate();
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
    this.setState({words: this.state.words.concat({id: max_id++, word:word, box:0})});
  }

  handleResult(id, result) {
    var updated = this.state.words.map((e)=>{
      if(e.id == id) {
        var wordUpdt = {
          id: e.id,
          word: e.word,
          box: result == RIGHT ? e.box + 1 : 0
        };
        return wordUpdt;
      } else {
        return e;
      }
    });
    this.setState({ words: updated });
  }

  switchMode() {
    this.setState({mode: 1 - this.state.mode});
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
    }

    return (
      <div>
      <button onClick={this.switchMode.bind(this)}>Mode</button>
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
        <button onClick={this.handleRight.bind(this)}>Right</button>
        <button onClick={this.handleWrong.bind(this)}>Wrong</button>
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

class HelloWorld extends React.Component {
  render() {
    return <App/>
  }
}

window.App.HelloWorld = HelloWorld
