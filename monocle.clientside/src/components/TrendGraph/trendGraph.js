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
                    data={props.data}
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
            </div>
        </div>
    );
}

export default React.memo(TrendGraph);

