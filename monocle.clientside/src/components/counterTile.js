import React from 'react';
import './counterTile.scss';
import Numeral from 'numeral';

const CounterTile = ({ tileCount, tileLabel }) => {
    const displayCount = Numeral(tileCount).format('0, 0');

    return (
        <div className='CounterTile'>
            <p className='CounterTile__Label'>{tileLabel}</p>
            <p className='CounterTile__Count'>{displayCount}</p>
        </div>
    );
};

export default React.memo(CounterTile);
