import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { BarChart, XAxis, YAxis, Bar, Tooltip, ResponsiveContainer, Label, Legend } from 'recharts'

import useGlobalState from 'store/state';
import RealtimeChart from './RealtimeChart';

export const MAX_STATS_BARS = 100;

export default () => {
  const { state } = useGlobalState()

  const roomData = state.stats.rooms

  return (
    <Container fluid>
      <Row>
        <Col>
          <RealtimeChart
            data={ state.stats.messages }
            label='Messages / minute'
          />
        </Col>
        <Col>
          <RealtimeChart
            data={ state.stats.users }
            label='Users / minute'
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <div style={ { width: '100%', height: '400px' } }>
            <ResponsiveContainer>
              <BarChart data={roomData} barSize={ 10 } margin={{ top: 50, bottom: 0, left: 0, right: 0}}>
                <YAxis allowDecimals={ false } domain={ [ 0, 10 ] } />
                <XAxis tick={false}>
                  <Label value='Rooms' position="bottom" offset={ -15 } fill='#ccc' />
                </XAxis>
                <Bar dataKey="active" stackId='a' fill="#f75f00" />
                <Bar dataKey="inactive" stackId='a' fill="#555" />
                <Tooltip cursor={ { fill: 'rgba(255, 255, 255, 0.1)' } }/>
                <Legend />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
        </Col>
      </Row>
    </Container>
  )
}