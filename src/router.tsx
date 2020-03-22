import React from "react";
import { Switch } from "react-router-dom";

import Footer from "components/Footer";
import Chat from "sections/Chat";
import AuthenticatedRoute from "util/AuthenticatedRoute";
import UnauthenticatedRoute from "util/UnauthenticatedRoute";
import useCheckLogin from "lib/checkAuth";
import OfflineCheck from "components/OfflineCheck";
import Login from "sections/Login";

export default () => {
  useCheckLogin();

  return (
    <>
      <div id="content">
        <OfflineCheck />
        <Switch>
          <UnauthenticatedRoute path='/login' component={ Login } />
          <AuthenticatedRoute path="/" component={ Chat } />
        </Switch>
      </div>
      <Footer />
    </>
  );
};
