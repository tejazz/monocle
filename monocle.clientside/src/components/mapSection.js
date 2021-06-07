import React from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import './mapSection.scss';

const MapSection = (props) => {
    const { locations, verifiedLocationTweetCount } = props;

    const renderMap = () => (
        <ComposableMap>
            <ZoomableGroup zoom={1}>
                <Geographies geography={'/world110m.json'}>
                    {({ geographies }) => geographies.map(geo => {

                        let defaultColor = '#37404f';

                        if (locations.hasOwnProperty(geo.properties.NAME) && verifiedLocationTweetCount > 0) {
                            const percentCount = (locations[geo.properties.NAME] / verifiedLocationTweetCount) * 100;
                            if (percentCount <= 3) {
                                defaultColor = '#ed2939';
                            } else if (percentCount > 3 && percentCount <= 6) {
                                defaultColor = '#fa8072';
                            } else if (percentCount > 6 && percentCount <= 10) {
                                defaultColor = '#fcf4a3';
                            } else if (percentCount > 10 && percentCount <= 15) {
                                defaultColor = '#fee12b';
                            } else if (percentCount > 15 && percentCount <= 20) {
                                defaultColor = '#9dc183';
                            } else if (percentCount > 20 && percentCount <= 30) {
                                defaultColor = '#4f7942';
                            } else if (percentCount > 30 && percentCount <= 50) {
                                defaultColor = '#98fb98';
                            } else {
                                defaultColor = '#c7ea46';
                            }
                        }

                        let hoverCountryStatus = {
                            country: geo.properties.NAME,
                            percentCount: (props.tweetCount > 0 && locations[geo.properties.NAME]) ? (locations[geo.properties.NAME] / props.tweetCount) * 100 : 0,
                            tweetCount: locations[geo.properties.NAME] ? locations[geo.properties.NAME] : 0, 
                        };

                        return <Geography
                            key={geo.rsmKey}
                            geography={geo}
                            onMouseEnter={() => props.handleCountryHover(hoverCountryStatus)}
                            onMouseLeave={() => props.handleCountryHover({})}
                            style={{
                                default: {
                                    fill: defaultColor,
                                    outline: 'none',
                                    stroke: defaultColor,
                                    strokeWidth: 1
                                },
                                pressed: {
                                    fill: 'white',
                                    outline: 'none',
                                    stroke: '#333333',
                                    strokeWidth: 1
                                },
                                hover: {
                                    fill: 'white',
                                    outline: 'none',
                                    stroke: '#333333',
                                    strokeWidth: 1
                                },
                            }}
                        />
                    })}
                </Geographies>
            </ZoomableGroup>
        </ComposableMap>
    );

    return (
        <div className='MapSection'>
            {renderMap()}
            <p className='MapSection__SearchTerm'>Search Term(s):<span className='MapSection__SearchTerm MapSection__SearchTerm--Term'>{props.searchTerm}</span></p>
        </div>
    );
}

export default React.memo(MapSection);