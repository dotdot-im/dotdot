import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import Helmet from "react-helmet";

import { StateProvider } from "store/state";
import SocketProvider from "util/socketProvider";

import loadIcons from "./lib/icons";
import Router from "./router";

import "assets/scss/index.scss";


loadIcons();

const app = (
  <BrowserRouter basename={process.env.REACT_APP_BASEPATH}>
    <Helmet
      titleTemplate='%s | dotdot'
    />
    <StateProvider>
      <SocketProvider>
        <Router />
      </SocketProvider>
    </StateProvider>
  </BrowserRouter>
);

ReactDOM.render(app, document.getElementById("root"));
