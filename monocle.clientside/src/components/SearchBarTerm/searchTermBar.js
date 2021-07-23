import React, { useState, useEffect, useRef } from 'react';
import './searchTermBar.scss';

const eventPressEvent = async (e, handleInputChange, props, inputTerm) => {
    if (e.keyCode === 13) {
        props.resetStateSearchTerm(inputTerm);
        await handleInputChange('');
        props.handlePowerToggleParent('search');
    }
};

const SearchTermBar = (props) => {
    const [inputTerm, handleInputChange] = useState('');
    const inputRef = useRef();

    useEffect(() => {
        inputRef.current.addEventListener('keydown', async (e) => await eventPressEvent(e, handleInputChange, props, inputTerm));
        let parentInputRef = inputRef;

        return () => {
            parentInputRef.current.removeEventListener('keydown', async (e) => await eventPressEvent(e, handleInputChange, props, inputTerm));
        };
    }, [inputTerm, handleInputChange, props])

    return (
        <div className='SearchTermBar'>
            <input
                type='text'
                placeholder='Enter search term here (Press return to confirm)'
                className='SearchTermBar__Input'
                value={inputTerm}
                onChange={(e) => handleInputChange(e.target.value)}
                ref={inputRef}
            />
        </div>
    );
}

export default SearchTermBar;
