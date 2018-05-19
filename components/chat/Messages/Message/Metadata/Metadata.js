import React from 'react';

import './styles.css';

export default class Metadata extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const imageBlock = this.props.metadata.logo
            ? <img className='metadata__pic' src={this.props.metadata.logo}
                alt={this.props.metadata.title}/>
            : '';

        return (
            <a href={this.props.metadata.url}>
                <div className={`metadata metadata-${this.props.side}`}>
                    <a className='metadata__link' href={this.props.metadata.url}>
                        {this.props.metadata.title}
                    </a>
                    {imageBlock}
                    <div className='meatadata__text'>
                        {this.props.metadata.description}
                    </div>
                </div>
            </a>
        );
    }
}
