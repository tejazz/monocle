import React, { PureComponent } from 'react';
import './dashboard.scss';
import MapSection from '../../components/MapSection/mapSection';
import ControlButtonSection from '../../components/ControlButtonSection/controlButtonSection';
import StatisticDisplay from '../../components/StatisticsDisplay/statisticDisplay';
import CountryStatus from '../../components/CountryStatus/countryStatus';
import SidePanel from '../../components/SidePanel/sidePanel';
import SearchTermBar from '../../components/SearchTermBar/searchTermBar';
import ProgressCircle from '../../components/ProgressCircle/progressCircle';
import LegendSection from '../../components/LegendSection/legendSection';

class dashboard extends PureComponent {
    state = {
        isOverlayOpen: false,
        isPowerOn: false,
    };

    handleOverlayChange = (status) => this.setState({ isOverlayOpen: status });

    handlePowerToggleParent = async (source) => {
        await this.setState({ isPowerOn: source === 'control' ? !this.state.isPowerOn : true });
        this.state.isPowerOn ? this.props.startStreaming() : this.props.stopStreaming();
    };

    render() {
        const { searchTerm, startStreaming, stopStreaming, tweetCount, positiveTweetCount, negativeTweetCount, neutralTweetCount, hoverCountryStatus, isConnected, displayGeneralTweet, displayPositiveTweet, displayNegativeTweet, displayNeutralTweet, displayVerifiedTweet, displayUnverifiedTweet, resetStateSearchTerm, verifiedPercent, locations, trend } = this.props;

        return (
            <div className='Dashboard'>
                <div className='Header'>
                    <p className='Header__Title'>Monocle 2.0</p>
                    <SearchTermBar
                        resetStateSearchTerm={resetStateSearchTerm}
                        handlePowerToggleParent={this.handlePowerToggleParent}
                    />
                    <ControlButtonSection
                        startStreaming={startStreaming}
                        stopStreaming={stopStreaming}
                        isConnected={isConnected}
                        isPowerOn={this.state.isPowerOn}
                        handlePowerToggleParent={this.handlePowerToggleParent}
                    />
                </div>
                {(this.state.isOverlayOpen) ? <div className='Overlay' /> : null}
                <CountryStatus hoverCountryStatus={hoverCountryStatus} />
                <ProgressCircle verifiedPercent={verifiedPercent} />
                <StatisticDisplay
                    tweetCount={tweetCount}
                    positiveTweetCount={positiveTweetCount}
                    negativeTweetCount={negativeTweetCount}
                    neutralTweetCount={neutralTweetCount}
                />
                <LegendSection />
                <MapSection {...this.props} />
                <SidePanel
                    handleOverlayChange={this.handleOverlayChange}
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
}

export default dashboard;
