import React from "react";
import { Container } from "react-bootstrap";

import SocketProvider from "util/socketProvider";

import "./index.scss";
import Messages from"./Messages";
import TextBox from "./TextBox";

export default () => {
  console.log('render chat');
  return (
    <SocketProvider>
      <Container>
        <Messages />
        <TextBox />
      </Container>
    </SocketProvider>
  );
};
