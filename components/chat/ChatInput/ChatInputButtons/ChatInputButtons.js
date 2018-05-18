import { Component, Fragment } from 'react';

import './styles.css';

export default class ChatInputButtons extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    static getDerivedStateFromProps(nextProps) {
        return {
            isRecognizerAvailable: nextProps.isRecognizerAvailable,
            onShowPickerButtonClick: nextProps.onShowPickerButtonClick,
            pickerButtonRef: nextProps.pickerButtonRef,
            isRecognitionStarted: nextProps.isRecognitionStarted,
            startRecognition: nextProps.startRecognition,
            stopRecognition: nextProps.stopRecognition,
            onFileInputChange: nextProps.onFileInputChange
        };
    }

    render() {
        return (
            <Fragment>
                <div className='chat-input-buttons'>
                    <div className='chat-input-buttons__show-picker-button'
                        onClick={this.state.onShowPickerButtonClick}
                        ref={this.state.pickerButtonRef}
                    >
                        <div className={`chat-input-buttons__sprite
                            chat-input-button__sprite-emoji`} />
                    </div>

                    {this.state.isRecognizerAvailable &&
                        <div className='chat-input-buttons__recognition-button'>
                            {!this.state.isRecognitionStarted
                                ? <div
                                    className={`chat-input-buttons__sprite
                                        chat-input-buttons__sprite-mic`}
                                    onClick={this.state.startRecognition}
                                />
                                : <div
                                    className={`chat-input-buttons__sprite
                                        chat-input-buttons__sprite-crossed-mic`}
                                    onClick={this.state.stopRecognition}
                                />
                            }
                        </div>}

                    <label className='chat-input-buttons__file-label' htmlFor='file-input'>
                        <div className={`chat-input-buttons__sprite
                            chat-input-buttons__sprite-file`} />
                    </label>
                </div>

                <input
                    type='file'
                    onChange={this.state.onFileInputChange}
                    className='chat-input-buttons__file-input'
                    id='file-input'
                />
            </Fragment>
        );
    }
}
