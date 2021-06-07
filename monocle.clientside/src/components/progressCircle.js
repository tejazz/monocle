import React from 'react';
import Circle from 'react-circle';
import './progressCircle.scss';

const ProgressCircle = (props) => {
    let defaultColor = '#dd0add';
    const percentCount = props.verifiedPercent;

    if (percentCount <= 3) {
        defaultColor = '#ed2939';
    } else if (percentCount > 5 && percentCount <= 10) {
        defaultColor = '#fa8072';
    } else if (percentCount > 10 && percentCount <= 20) {
        defaultColor = '#fcf4a3';
    } else if (percentCount > 20 && percentCount <= 40) {
        defaultColor = '#fee12b';
    } else if (percentCount > 40 && percentCount <= 50) {
        defaultColor = '#9dc183';
    } else if (percentCount > 50 && percentCount <= 60) {
        defaultColor = '#4f7942';
    } else if (percentCount > 60 && percentCount <= 80) {
        defaultColor = '#98fb98';
    } else {
        defaultColor = '#c7ea46';
    }

    return (
        <div className='ProgressCircle'>
            <Circle
                animate={true}
                animationDuration="0.5s"
                progress={percentCount}
                textStyle={{
                    font: 'Bebas',
                    fontSize: '90px',
                    fontFamily: 'Bebas',
                }}
                progressColor={defaultColor}
                showPercentage={true} 
                showPercentageSymbol={true}
                size={140}
            />
        </div>
    );
}

export default React.memo(ProgressCircle);
