import './Button.css'
import React from 'react';

export class Button extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value
    }
  }

  render() {
    return (
      <div className='button' onClick={this.props.onClick}>
        {this.state.value}
      </div>
    );
  }
}