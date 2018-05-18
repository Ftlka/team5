import React from 'react';
import './styles.css';

export default class ReactedPopup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            reacted: props.reacted
        };
        this.overflowAmount = 0;
        this.cutPeopleOff();
    }

    cutPeopleOff() {
        if (this.state.reacted.length > 3) {
            const restOfArray = this.state.reacted.splice(3,); // eslint-disable-line
            this.overflowAmount = restOfArray.length;
        }
    }

    render() {
        return (<div className='reacted-container'>
            {this.state.reacted.map((person, idx) =>
                <div key={idx} className='reacted-person'>{person}</div>
            )}
            {this.overflowAmount ? <div>И ещё {this.overflowAmount} человек</div> : null}
        </div>);
    }
}
