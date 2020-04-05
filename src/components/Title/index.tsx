import React, { useEffect, useContext, useState, useCallback } from 'react';
import Helmet from 'react-helmet';

import { SocketContext } from "util/socketProvider";

export default () => {

    const { socket } = useContext(SocketContext);

    const [windowFocused, setWindowFocused] = useState<boolean>(true);
    const [titleNotification, setTitleNotification] = useState<boolean>(false);

    const onMessage = useCallback(() => {
        if (!windowFocused) {
            setTitleNotification(true);
        }
    }, [windowFocused]);

    useEffect(() => {
        if (!socket) {
            return;
        }
        socket.on("message", onMessage);

    },[socket, onMessage]);

    window.onfocus = function() {
        setTitleNotification(false);
        setWindowFocused(true);
    }

    window.onblur = function() {
        setWindowFocused(false);
    }

    return (
        <Helmet>
            <title>{titleNotification ? "• dotdot" : "dotdot"}</title>
        </Helmet>
    );
};

