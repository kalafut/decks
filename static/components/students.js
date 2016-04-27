import React from 'react';
import request from 'superagent';

var next_id = -1;

export class Students extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      students:[
        {id: next_id--, name: "Ben"},
        {id: next_id--, name: "Laura"},
      ]
    };
    //this.apiUpdate();
  }

  onDelete(id) {
    var s = this.state.students.filter((s)=>{
      return s.id != id;
    });
    this.setState({students: s});
  }

  addName(name) {
    this.setState({
      students: this.state.students.concat({id: next_id--, name: name})
    });
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

  //addWord(word) {
  //  this.setState({words: this.state.words.concat({id: next_id++, word:word, box:0})});
  //  request
  //  .post('/word/add')
  //  .send({front:word})
  //  .end(function(err,res) {
  //  });
  //}

  //handleResult(id, result) {
  //  var self = this;
  //  var newBox;

  //  var updated = this.state.words.map((e)=>{
  //    if(e.id == id) {
  //      var wordUpdt = {
  //        id: e.id,
  //        word: e.word,
  //        box: result == RIGHT ? e.box + 1 : 0
  //      };
  //      newBox = wordUpdt.box;
  //      return wordUpdt;
  //    } else {
  //      return e;
  //    }
  //  });
  //  this.setState({ words: updated });

  //  request
  //  .post('/words')
  //  .send({id:id, box: newBox})
  //  .end(function(err, res) {
  //  });

  //}

  //switchMode() {
  //  this.setState({mode: 1 - this.state.mode});
  //}

  render() {
    return (
      <div>
        <ul>
          {this.state.students.map((student)=>{
            return <li key={student.id}>{student.name} <a href="#" onClick={this.onDelete.bind(this, student.id)}>Delete</a></li>;
          })}
        </ul>
        <AddStudent addName={this.addName.bind(this)}/>
      </div>
    );
  }
}

class AddStudent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      adding: false
    };
  }

  startAdd() {
    this.setState({adding: true});
  }

  save() {
    var name = this.refs.newName.value.trim();
    if(name.length > 0) {
      this.props.addName(name);
    }
    this.setState({adding: false});
  }

  render() {
    if (this.state.adding) {
      return (
        <div>
          <input ref="newName" type="text"/>
          <button className="pure-button pure-button-primary" onClick={() => this.save()}>Save</button>
        </div>
      );
    } else {
      return(
        <button className="pure-button pure-button-primary" onClick={() => this.startAdd()}>Add</button>
      );
    }
  }
}
