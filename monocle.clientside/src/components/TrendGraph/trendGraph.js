import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import './trendGraph.scss';

const TrendGraph = ({data}) => {
    console.log(data);
    return (
        <div className='trend'>
            <p className='trend__title'>Trend Graph</p>

            <div>
                <ResponsiveContainer width="100%" height={500}>
                    <AreaChart
                        data={data}
                        margin={{
                            top: 20, right: 20, bottom: 20, left: 20,
                        }}
                    >
                        <XAxis dataKey="timestamp" />
                        <YAxis />
                        <Area dataKey="positive" stroke="green" fill="green" />
                        <Area dataKey="negative" stroke="red" fill="red" />
                        <Area dataKey="neutral" stroke="yellow" fill="yellow" />
                        <Tooltip />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default TrendGraph;

