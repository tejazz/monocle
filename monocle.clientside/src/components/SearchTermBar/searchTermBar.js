import React, { useState, useEffect, useRef, useCallback } from 'react';
import './searchTermBar.scss';

const SearchTermBar = (props) => {
    const {resetStateSearchTerm, handlePowerToggleParent} = props;
    const [inputTerm, handleInputChange] = useState('');
    const inputRef = useRef();

    const triggerChange = useCallback(() => {
        resetStateSearchTerm(inputTerm);
        handleInputChange('');
        handlePowerToggleParent('search');
    }, [inputTerm, resetStateSearchTerm, handlePowerToggleParent]);

    const keyPressEvent = useCallback((e) => {
        if (e.keyCode === 13) {
           triggerChange();
        }
    }, [triggerChange]);

    useEffect(() => {
        inputRef.current.addEventListener('keydown', keyPressEvent);
        let parentInputRef = inputRef;

        return () => {
            console.log('clear event listener');
            parentInputRef.current.removeEventListener('keydown', keyPressEvent);
        };
    }, [keyPressEvent]);

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
