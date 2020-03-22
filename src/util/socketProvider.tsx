import React, { createContext } from "react";
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
  const { state } = useStateValue();

  const socket = socketio('http://192.168.0.126:8080', {
    reconnection: true,
    timeout: 2000,
    query: {
        token: state.auth.token,
    }
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