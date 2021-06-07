import React from 'react';
import './counterTile.scss';
import Numeral from 'numeral';

const CounterTile = (props) => {
    console.log(`Rendered component: ${props.tileLabel} Tile`);
    const displayCount = Numeral(props.tileCount).format('0, 0');

    return (
        <div className='CounterTile'>
            <p className='CounterTile__Label'>{props.tileLabel}</p>
            <p className='CounterTile__Count'>{displayCount}</p>
        </div>
    );
};

export default React.memo(CounterTile);
