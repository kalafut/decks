import React from 'react';
import request from 'superagent';
import { dispatch, getState } from '../stores/dispatcher'

var next_id = -1;

export class Students extends React.Component {
  apiUpdate() {
    var self = this;
    request
    .get('/words')
    .end(function(err, res){
      var data = JSON.parse(res.text);
      self.setState({words: data});
    });
  }

  render() {
    return (
      <div>
        <ul>
          {getState().students.map((student)=>{
            return <li key={student.id}>{student.name} <a href="#" onClick={dispatch.bind(this, "RM_STUDENT", student.id)}>Delete</a>
            </li>;
          })}
        </ul>
        <AddStudent />
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
      dispatch('ADD_STUDENT', name);
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
