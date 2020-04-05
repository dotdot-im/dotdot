import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";

import { StateProvider } from "store/state";
import SocketProvider from "util/socketProvider";

import loadIcons from "./lib/icons";
import Router from "./router";
import Title from "./components/Title";

import "assets/scss/index.scss";


loadIcons();

const app = (
  <BrowserRouter basename={process.env.REACT_APP_BASEPATH}>
    <StateProvider>
      <SocketProvider>
        <Title />
        <Router />
      </SocketProvider>
    </StateProvider>
  </BrowserRouter>
);

ReactDOM.render(app, document.getElementById("root"));
