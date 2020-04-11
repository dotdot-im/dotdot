import React from 'react'
import { AreaChart, XAxis, YAxis, Area, Tooltip, ResponsiveContainer, Label } from 'recharts'
import { MAX_STATS_BARS } from '..';

type Props = {
  data: number[],
  height?: number,
  label: string,
};

export default (props: Props) => {
  const data = props.data.map((num, index) => ({
    date: index,
    value: num,
  }))

  for (let i = data.length; i < MAX_STATS_BARS; i++) {
    data.push({
      date: i,
      value: 0,
    })
  }

  return (
    <div style={ { width: '100%', height: `${ props.height || 250 }px` } }>
      <ResponsiveContainer>
        <AreaChart data={data} barSize={ 5 } barCategoryGap={ 2 } barGap={ 2 } margin={{ top: 50, bottom: 20, left: 0, right: 0}}>
          <YAxis allowDecimals={ false } />
          <XAxis dataKey="date" tick={false}>
            <Label value={ props.label } position="bottom" offset={ -15 } fill='#ccc' />
          </XAxis>
          <Area dataKey="value" fill="#f75f00" stroke="#f75f00" isAnimationActive={ false } type='linear' />
          <Tooltip cursor={ { fill: 'rgba(255, 255, 255, 0.1)' } }/>
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}