import React, { useEffect, useRef } from 'react';
import './searchTermBar.scss';

const SearchTermBar = (props) => {
    const {resetStateSearchTerm, handlePowerToggleParent} = props;
    const inputRef = useRef();

    useEffect(() => {
        const keyPressEvent = (e) => {
            if (e.keyCode === 13) {
                if(!inputRef.current.value.length){
                  return alert("Enter a search term")
                }
                resetStateSearchTerm(inputRef.current.value);
                inputRef.current.value = '';
                handlePowerToggleParent('search');
            }
        };

        inputRef.current.addEventListener('keydown', keyPressEvent);
        let parentInputRef = inputRef;

        return () => {
            parentInputRef.current.removeEventListener('keydown', keyPressEvent);
        }
    }, [resetStateSearchTerm, handlePowerToggleParent]);

    return (
        <div className='SearchTermBar'>
            <input
                type='text'
                placeholder='Enter search term here (Press return to confirm)'
                className='SearchTermBar__Input'
                ref={inputRef}
            />
        </div>
    );
}

export default SearchTermBar;
