import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import Helmet from "react-helmet";

import { StateProvider } from "store/state";

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
      <Router />
    </StateProvider>
  </BrowserRouter>
);

ReactDOM.render(app, document.getElementById("root"));
