import React from 'react';
import './countryStatus.scss';
import Numeral from 'numeral';

const CountryStatus = (props) => {
    if (!props.hoverCountryStatus.country) {
        return null;
    }

    const tweetCount = Numeral(props.hoverCountryStatus.tweetCount).format('0,0');

    return (
        <div className='CountryStatus'>
            <p className='CountryStatus__Country'>{props.hoverCountryStatus.country}</p>
            <div className='CountryStatus__Percent'>
                <p className='CountryStatus__PercentCaption'>Count: </p>
                <p className='CountryStatus__PercentCount'>{tweetCount}</p>
            </div>
            <div className='CountryStatus__Percent'>
                <p className='CountryStatus__PercentCaption'>Percent: </p>
                <p className='CountryStatus__PercentCount'>{Math.round((props.hoverCountryStatus.percentCount + Number.EPSILON) * 100) / 100}%</p>
            </div>
        </div>
    );
}

export default React.memo(CountryStatus);
