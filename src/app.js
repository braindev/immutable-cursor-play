import React from "react";
import ReactDOM from "react-dom";

import Immutable from 'immutable';
import Cursor from 'immutable-cursor';

class App extends React.Component {
  constructor(props) {
    super(props);
    const data = Immutable.fromJS({
      name: 'One', children: [],
    });
    const cb = (nextValue, prevValue, keyPath) => {
      this.setState({ cursor: Cursor.from(nextValue, cb) });
    };
    this.state = {
      cursor: Cursor.from(data, cb)
    };
  }

  render() {
    const cursor = this.state.cursor;
    return (
      <div>
        <Node node={cursor} />
        <hr />
        <pre>
          {JSON.stringify(this.state.cursor, undefined, '  ')}
        </pre>
      </div>
    );
  }
}

class Node extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.node.deref() !== nextProps.node.deref();
  }

  updateName(e) {
    this.props.node.set('name', e.target.value);
  }

  addChild() {
    this.props.node.update('children', (prev) => {
      return prev.push(Immutable.fromJS({name: 'New Node', children: [] }));
    });
  }

  render() {
    console.log('render node');
    return (
      <div className='card' style={{padding: '5px', margin: '5px'}}>
        <button type='button' onClick={this.addChild.bind(this)} className='btn btn-secondary'>
          Add Child
        </button>
        {' '}
        <input
          type='text'
          value={this.props.node.get('name')}
          onChange={this.updateName.bind(this)}
          className='form-control'
        />
        <ul>
          {this.props.node.get('children').toArray().map((n, i)=>{
            return (
              <li key={i}>
                <Node node={this.props.node.cursor(['children', i])} />
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

export default App;
ReactDOM.render(<App />, document.getElementById("app"));
