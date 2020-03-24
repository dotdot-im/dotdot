import React, { createContext, useEffect } from "react";
import socketio from 'socket.io-client';

import { useStateValue } from "store/state";

type SocketContextType = {
  socket: SocketIOClient.Socket | null,
  emit: Function,
};

export const SocketContext = createContext<SocketContextType>({
  socket: null,
  emit: () => {},
});

type Props = {
  children: any,
};

export default (props: Props) => {
  const { state, dispatch } = useStateValue();

  useEffect(() => {
    dispatch({
      type: 'error',
      payload: null,
    });
  }, [dispatch]);

  const onError = (error: string | null) => {
    socket.close();
    socket.disconnect();

    dispatch({
      type: 'login',
      payload: null,
    });

    dispatch({
      type: 'socketConnected',
      payload: false,
    });

    if (error) {
      dispatch({
        type: 'error',
        payload: error,
      });
    } else {
      dispatch({
        type: 'offline',
        payload: null,
      });
    }
  };

  const socket = socketio('http://localhost:8080', {
    reconnection: true,
    timeout: 2000,
    query: {
        token: state.auth.token,
    }
  });

  socket.on('connect', () => {
    console.log('connected');

    dispatch({
      type: 'socketConnected',
      payload: true,
    });
  });

  socket.on('connect_error', (error: string) => {
    console.log('failed to connect', error);

    onError(null);
  });

  socket.on('connect_timeout', (timeout: string) => {
    console.log('timeout connect', timeout);

    onError(null);
  });

  socket.on('error', (error: string) => {
    console.log('failed to connect', error);

    onError(error);
  });

  const provider = {
    socket,
    emit: socket.emit,
  };

  return (
    <SocketContext.Provider value={ provider }>
      { props.children }
    </SocketContext.Provider>
  );
};