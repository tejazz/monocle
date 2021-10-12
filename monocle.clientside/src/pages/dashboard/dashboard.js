import React, { useState, useEffect } from 'react';
import './dashboard.scss';
import MapSection from '../../components/MapSection/mapSection';
import ControlButtonSection from '../../components/ControlButtonSection/controlButtonSection';
import StatisticDisplay from '../../components/StatisticsDisplay/statisticDisplay';
import CountryStatus from '../../components/CountryStatus/countryStatus';
import SidePanel from '../../components/SidePanel/sidePanel';
import SearchTermBar from '../../components/SearchTermBar/searchTermBar';
import ProgressCircle from '../../components/ProgressCircle/progressCircle';
import LegendSection from '../../components/LegendSection/legendSection';

const Dashboard = (props) => {
    const [isOverlayOpen, handleOverlayChange] = useState(false);
    const [isPowerOn, handlePowerToggleChange] = useState(false);
    const { searchTerm, startStreaming, stopStreaming, tweetCount, positiveTweetCount, negativeTweetCount, neutralTweetCount, hoverCountryStatus, isConnected, displayGeneralTweet, displayPositiveTweet, displayNegativeTweet, displayNeutralTweet, displayVerifiedTweet, displayUnverifiedTweet, resetStateSearchTerm, verifiedPercent, locations, trend } = props;

    useEffect(() => {
        isPowerOn ? startStreaming() : stopStreaming();
    }, [isPowerOn, startStreaming, stopStreaming]);

    const handlePowerToggleParent = (source) => {
        const isEmptyTermOnStartUp = !searchTerm.length && !isPowerOn && source === 'control'
        
        if(isEmptyTermOnStartUp){
         return alert("Enter a search term")
        }
        
        handlePowerToggleChange(source === 'control' ? !isPowerOn : true);
    };

    return (
        <div className='Dashboard'>
            <div className='Header'>
                <p className='Header__Title'>Monocle 2.0</p>
                <SearchTermBar
                    resetStateSearchTerm={resetStateSearchTerm}
                    handlePowerToggleParent={handlePowerToggleParent}
                />
                <ControlButtonSection
                    startStreaming={startStreaming}
                    stopStreaming={stopStreaming}
                    isConnected={isConnected}
                    isPowerOn={isPowerOn}
                    handlePowerToggleParent={handlePowerToggleParent}
                />
            </div>
            {(isOverlayOpen) ? <div className='Overlay' /> : null}
            <CountryStatus hoverCountryStatus={hoverCountryStatus} />
            <ProgressCircle verifiedPercent={verifiedPercent} />
            <StatisticDisplay
                tweetCount={tweetCount}
                positiveTweetCount={positiveTweetCount}
                negativeTweetCount={negativeTweetCount}
                neutralTweetCount={neutralTweetCount}
            />
            <LegendSection />
            <MapSection {...props} />
            <SidePanel
                handleOverlayChange={handleOverlayChange}
                displayGeneralTweet={displayGeneralTweet}
                displayPositiveTweet={displayPositiveTweet}
                displayNegativeTweet={displayNegativeTweet}
                displayNeutralTweet={displayNeutralTweet}
                displayVerifiedTweet={displayVerifiedTweet}
                displayUnverifiedTweet={displayUnverifiedTweet}
                locations={locations}
                trend={trend}
                searchTerm={searchTerm}
            />
        </div>
    );
}

export default Dashboard;
