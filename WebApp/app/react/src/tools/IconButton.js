import './IconButton.css'
import React from 'react';

import { ReactComponent as ExSvg } from '../icons/delete.svg';
import { ReactComponent as CheckSvg } from '../icons/check.svg';
import { ReactComponent as MessageBubbleSvg } from '../icons/message_bubble.svg';
import { ReactComponent as PlusSvg } from '../icons/plus.svg';
import { ReactComponent as MinusSvg } from '../icons/minus.svg';

function renderSwitch(param) {
  switch(param) {
    case 'ex':
      return (<ExSvg height={20} width={20}/>);
    case 'check':
      return (<CheckSvg height={20} width={20}/>);
    case 'msg':
      return (<MessageBubbleSvg height={20} width={20}/>);
    case 'plus':
      return (<PlusSvg height={20} width={20}/>);
    case 'minus':
      return (<MinusSvg height={20} width={20}/>);
    default:
      return ' ';
  }
}

export class IconButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value
    }
  }

  render() {
    return (
      <div className='icon-button' onClick={this.props.onClick}>
        {renderSwitch(this.state.value)}
      </div>
    );
  }
}