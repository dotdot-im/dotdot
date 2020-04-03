import React from "react";
import { Container } from "react-bootstrap";

import { useGlobalState } from "store/state";
import Loader from 'components/Loader';

import "./index.scss";
import Messages from"./Messages";
import TextBox from "./TextBox";
import OnlineUsers from "./OnlineUsers";

export default () => {
  const { state } = useGlobalState();

  let chatArea = (
    <Loader />
  );

  if (state.connected) {
    chatArea = (
      <>
        <OnlineUsers />
        <Messages />
        <TextBox />
      </>
    );
  }

  return (
    <Container>
      { chatArea }
    </Container>
  );
};
