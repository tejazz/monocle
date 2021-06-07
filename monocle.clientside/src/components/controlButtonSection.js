import React from 'react';
import './controlButtonSection.scss';
import PowerOn from '../assets/images/power-icon.svg';
import PowerOff from '../assets/images/power-off-icon.svg';

class ControlButtonSection extends React.PureComponent {
    handlePowerToggle = () => this.props.handlePowerToggleParent('control');

    render() {
        console.log('Rendered component: Control Button Section');

        return (
            <div className='ControlButtonSection'>
                <img
                    src={(this.props.isPowerOn) ? PowerOn : PowerOff}
                    className='ControlButtonSection__Button'
                    onClick={this.handlePowerToggle}
                    alt='power-icon'
                />
            </div>
        );
    }
}

export default ControlButtonSection;
