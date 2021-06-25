import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import './trendGraph.scss';

const TrendGraph = ({data}) => {
    let dataSegment = data.slice(data.length - 1000);

    return (
        <div className='trend'>
            <p className='trend__title'>Trend Graph</p>

            <div>
                <ResponsiveContainer width="100%" height={500} key={Math.random()}>
                    <AreaChart
                        data={dataSegment}
                        margin={{
                            top: 20, right: 20, bottom: 20, left: 20,
                        }}
                    >
                        <XAxis dataKey="timestamp" />
                        <YAxis />
                        <Area isAnimationActive={false} dataKey="positive" stroke="#6cad46" fill="#8bde5a" strokeWidth={3} fillOpacity={0.3}/>
                        <Area isAnimationActive={false} dataKey="negative" stroke="#d44842" fill="#fe6f5e" strokeWidth={3} fillOpacity={0.3}/>
                        <Area isAnimationActive={false} dataKey="neutral" stroke="#eeb700" fill="#fff23e" strokeWidth={3} fillOpacity={0.3}/>
                        <Tooltip />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default TrendGraph;

