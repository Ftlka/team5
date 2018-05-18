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
                        <img
                            className='chat-input-buttons__image'
                            src='static/images/smile.svg'
                            alt='Смайлики'
                            width='30'
                            height='30'
                        />
                    </div>

                    {this.state.isRecognizerAvailable &&
                        <div className='chat-input-buttons__recognition-button'>
                            {!this.state.isRecognitionStarted
                                ? <img
                                    className='chat-input-buttons__image'
                                    src='static/images/mic.svg'
                                    alt='Начать аудионабор'
                                    onClick={this.state.startRecognition}
                                    width='30'
                                    height='30'
                                />
                                : <img
                                    className='chat-input-buttons__image'
                                    src='static/images/crossed-mic.svg'
                                    alt='Остановить аудионабор'
                                    onClick={this.state.stopRecognition}
                                    width='30'
                                    height='30'
                                />
                            }
                        </div>}

                    <label className='chat-input-buttons__file-label' htmlFor='file-input'>
                        <img
                            className='chat-input-buttons__image'
                            src='static/images/picture.svg'
                            alt='Отправить изображение'
                            width='30'
                            height='30'
                        />
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
