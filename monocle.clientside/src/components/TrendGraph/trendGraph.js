import React from 'react';
import {AreaChart, Area, XAxis, YAxis, Tooltip} from 'recharts';
import './trendGraph.scss';

function TrendGraph(props) {
    return (
        <div className='trend'>
            <p className='trend__title'>Trend Graph</p>

            <div>
                <AreaChart
                    width={730}
                    height={250}
                    data={props.trends}
                    margin={{
                        top: 20, right: 20, bottom: 20, left: 20,
                    }}
                >
                    <XAxis dataKey="timestamp" />
                    <YAxis />
                    <Area dataKey="positive" stroke="#8884d8" fill="#8884d8" />
                    <Area dataKey="negative" stroke="#8884d8" fill="#8884d8" />
                    <Area dataKey="neutral" stroke="#8884d8" fill="#8884d8" />
                    <Tooltip />
                </AreaChart>
            </div>
        </div>
    );
}

export default React.memo(TrendGraph);

