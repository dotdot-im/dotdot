import React, { useContext } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { BarChart, XAxis, YAxis, Bar, Tooltip, ResponsiveContainer, Label } from 'recharts'

import useGlobalState from 'store/state';
import RealtimeChart from './RealtimeChart';
import { forHumans } from 'lib/secondsToHuman';
import { SocketContext } from 'util/socketProvider';
import { EVENTS } from 'store/types';
import Widget from './Widget';

export const MAX_STATS_BARS = 100;

type Stat = {
  header: string,
  data: string | number,
  detail?: string,
  tooltip?: string,
}

export default () => {
  const { state } = useGlobalState()

  const { socket } = useContext(SocketContext)

  const totalTime = state.stats.timeActive + state.stats.timeInactive

  const statsData: Stat[][] = [
    [
      {
        header: 'Time Active / Session',
        data: forHumans(Math.round(state.stats.timeActive / state.stats.sessions)),
        detail: 'Total: ' + forHumans(state.stats.timeActive) + ' (' + Math.round(state.stats.timeActive * 100 / totalTime) + '%)'
      },
      {
        header: 'Time Inactive / Session',
        data: forHumans(Math.round(state.stats.timeInactive / state.stats.sessions)),
        detail: 'Total: ' + forHumans(state.stats.timeInactive) + ' (' + Math.round(state.stats.timeInactive * 100 / totalTime) + '%)'
      },
    ],
    [
      {
        header: 'Users Online',
        data: Math.round(state.stats.onlineUsers * 100 / state.stats.totalUsers) + '%',
        detail: `${state.stats.onlineUsers} out of ${state.stats.totalUsers}`,
        tooltip: '',
      },
      {
        header: 'Total Messages',
        data: state.stats.totalMessages,
        detail: Math.round(state.stats.totalMessages / state.stats.totalUsers) + ' messages / user'
      },
      {
        header: 'Server',
        data: 'CPU: ' + state.stats.cpuUsage + '% - RAM: ' + state.stats.freeMemory + '%',
        detail: 'Up for ' + forHumans(state.stats.uptime),
        tooltip: 'Shows CPU usage over the last few seconds, and free RAM',
      },
      {
        header: 'Avg Sessions / user',
        data: Math.round(state.stats.sessions / state.stats.totalUsers),
        detail: 'Total sessions: ' + state.stats.sessions
      },
    ],
  ]

  const roomData = state.stats.rooms

  const onRoomClick = (event: any) => {
    if (!event) {
      return
    }
    const room = event.activePayload[0].payload.id
    if (socket) {
      socket.emit(EVENTS.CHANGE_ROOM, {
        room,
      })
    }
  }

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
              <BarChart onClick={ onRoomClick } data={roomData} barSize={ 10 } margin={{ top: 50, bottom: 0, left: 0, right: 0}}>
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
      <Container className='mt-4'>
        { statsData.map((row, index) => (
          <Row key={ index }>
            { row.map(stats => (
              <Col key={ stats.header }>
                <Widget
                  title={ stats.header }
                  content={ stats.data }
                  history={ stats.detail }
                  tooltip={ stats.tooltip }
                />
              </Col>
            )) }
          </Row>
        )) }
      </Container>
    </Container>
  )
}