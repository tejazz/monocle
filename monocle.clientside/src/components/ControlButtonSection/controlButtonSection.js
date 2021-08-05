import React from 'react';
import './controlButtonSection.scss';
import PowerOn from '../../assets/images/power-icon.svg';
import PowerOff from '../../assets/images/power-off-icon.svg';

const ControlButtonSection = ({isPowerOn, handlePowerToggleParent}) => {
    return (
        <div className='ControlButtonSection'>
            <img
                src={(isPowerOn) ? PowerOn : PowerOff}
                className='ControlButtonSection__Button'
                onClick={() => handlePowerToggleParent('control')}
                alt='power-icon'
            />
        </div>
    );
};

export default ControlButtonSection;
