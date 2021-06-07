import React from 'react';
import './legendSection.scss';

const LegendSection = () => {
    return (
        <div className='LegendSection'>
            <div className='LegendItem'>
                <p className='LegendItem__Label'>Tweets Percentage (Verified)</p>
            </div>
            <div className='LegendItem'>
                <div className='LegendItem__Color LegendItem__Color--1'></div>
                <p className='LegendItem__Label'>Less Than 3%</p>
            </div>
            <div className='LegendItem'>
                <div className='LegendItem__Color LegendItem__Color--2'></div>
                <p className='LegendItem__Label'>Between 3% - 6%</p>
            </div>
            <div className='LegendItem'>
                <div className='LegendItem__Color LegendItem__Color--3'></div>
                <p className='LegendItem__Label'>Between 6% - 10%</p>
            </div>
            <div className='LegendItem'>
                <div className='LegendItem__Color LegendItem__Color--4'></div>
                <p className='LegendItem__Label'>Between 10% - 15%</p>
            </div>
            <div className='LegendItem'>
                <div className='LegendItem__Color LegendItem__Color--5'></div>
                <p className='LegendItem__Label'>Between 15% - 20%</p>
            </div>
            <div className='LegendItem'>
                <div className='LegendItem__Color LegendItem__Color--6'></div>
                <p className='LegendItem__Label'>Between 20% - 30%</p>
            </div>
            <div className='LegendItem'>
                <div className='LegendItem__Color LegendItem__Color--7'></div>
                <p className='LegendItem__Label'>Between 30% - 50%</p>
            </div>
            <div className='LegendItem'>
                <div className='LegendItem__Color LegendItem__Color--8'></div>
                <p className='LegendItem__Label'>Greater Than 50%</p>
            </div>
        </div>
    );
}

export default LegendSection;
