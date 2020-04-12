import React from 'react'
import { Container, Row, Col, Table } from 'react-bootstrap'
import { BarChart, XAxis, YAxis, Bar, Tooltip, ResponsiveContainer, Label } from 'recharts'

import useGlobalState from 'store/state';
import RealtimeChart from './RealtimeChart';
import { forHumans } from 'lib/secondsToHuman';

export const MAX_STATS_BARS = 100;

export default () => {
  const { state } = useGlobalState()

  const tableData = [
    {
      header: 'Users Online',
      data: `${state.stats.onlineUsers}  (${Math.round(state.stats.onlineUsers * 100 / state.stats.totalUsers)}%)`,
    },
    {
      header: 'Total Users',
      data: state.stats.totalUsers,
    },
    {
      header: 'Total Messages',
      data: state.stats.totalMessages,
    },
    {
      header: 'CPU Usage',
      data: state.stats.cpuUsage + '%',
    },
    {
      header: 'Free Memory',
      data: state.stats.freeMemory + '%',
    },
    {
      header: 'Server Uptime',
      data: forHumans(state.stats.uptime),
    },
    {
      header: 'Time Active / Ses',
      data: forHumans(Math.round(state.stats.timeActive / state.stats.sessions)),
    },
    {
      header: 'Time Inactive / Sess',
      data: forHumans(Math.round(state.stats.timeInactive / state.stats.sessions)),
    },
    {
      header: 'Total Sessions',
      data: state.stats.sessions,
    },
    {
      header: 'Avg Sessions / user',
      data: Math.round(state.stats.sessions / state.stats.totalUsers),
    },
    {
      header: 'Total Time Active',
      data: forHumans(state.stats.timeActive),
    },
    {
      header: 'Total Time Inactive',
      data: forHumans(state.stats.timeInactive),
    },
  ]

  const roomData = state.stats.rooms

  return (
    <Container fluid>
      <Row>
        <Col>
          <RealtimeChart
            data={ state.stats.messages }
            label='Realtime Messages'
          />
        </Col>
        <Col>
          <RealtimeChart
            data={ state.stats.users }
            label='Realtime Users'
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
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Col>
      </Row>
      <Container>
        <Row>
          <Col>
            <Table size='sm' variant="dark" className='mt-4'>
              <tbody>
                { tableData.map(row => (
                  <tr key={ row.header }>
                    <th style={ { width: '230px' } }>
                      { row.header }
                    </th>
                    <td>
                      { row.data }
                    </td>
                  </tr>
                )) }
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    </Container>
  )
}