import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import './trendGraph.scss';

const TrendGraph = ({ data, searchTerm }) => {
    let dataSegment = data.slice(data.length - 1000);
    let keyValue = Math.random();

    const [trend, changeTrendView] = useState('all');

    console.log(trend);

    setInterval(() => {
        keyValue = Math.random();
    }, 5000);

    return (
        <div className='trend'>
            <p className='trend__title'>Trend Graph</p>
            <p className='trend__term'>{searchTerm}</p>

            <div className='trend__button-group'>
                <p className={getTrendButtonClass(trend, 'positive')} onClick={() => changeTrendView('positive')}>Positive</p>
                <p className={getTrendButtonClass(trend, 'neutral')} onClick={() => changeTrendView('neutral')}>Neutral</p>
                <p className={getTrendButtonClass(trend, 'negative')} onClick={() => changeTrendView('negative')}>Negative</p>
                <p className={getTrendButtonClass(trend, 'all')} onClick={() => changeTrendView('all')}>All</p>
            </div>

            <div>
                <ResponsiveContainer className='trend__graph-container' width="100%" height={500} key={keyValue}>
                    <AreaChart
                        data={dataSegment}
                        margin={{
                            top: 20, right: 20, bottom: 20, left: 20,
                        }}
                    >
                        <XAxis hide={true} dataKey="timestamp" />
                        <YAxis />
                        {(trend === 'positive' || trend === 'all') && <Area isAnimationActive={false} dataKey="positive" stroke="#6cad46" fill="#8bde5a" strokeWidth={3} fillOpacity={0.3} />}
                        {(trend === 'negative' || trend === 'all') && <Area isAnimationActive={false} dataKey="negative" stroke="#d44842" fill="#fe6f5e" strokeWidth={3} fillOpacity={0.3} />}
                        {(trend === 'neutral' || trend === 'all') && <Area isAnimationActive={false} dataKey="neutral" stroke="#eeb700" fill="#fff23e" strokeWidth={3} fillOpacity={0.3} />}
                        <Tooltip />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

const getTrendButtonClass = (currentTrend, trend) => {
    return (currentTrend === trend) ? 'trend__button trend__button--active' : 'trend__button';
}

export default TrendGraph;

