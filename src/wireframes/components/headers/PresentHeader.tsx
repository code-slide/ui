/*
 * codeslide.net
 *
 * @license
 * Forked from mydraft.cc by Sebastian Stehle
 * Copyright (c) Do Duc Quan. All rights reserved.
*/

import { FundProjectionScreenOutlined } from "@ant-design/icons";
import { Button, message } from "antd";
import * as React from "react";
import { useState } from "react";
import { useServer } from "../actions";
import { useDispatch } from "react-redux";

export const PresentHeader = React.memo(() => {
    const dispatch = useDispatch();
    const forServer = useServer();
    const [messageApi, contextHolder] = message.useMessage();
    const [loading, setLoading] = useState<boolean>(false);
    const messageKey = 'PRESENT';

    return (
        <>
            {contextHolder}
            <Button 
                icon={<FundProjectionScreenOutlined />} 
                onClick={() => {
                    setLoading(true);
                    try {
                        dispatch(forServer.slide(messageApi, messageKey));
                    } finally {
                        setLoading(false)
                    }
                }} 
                className="header-cta-right" 
                type="text" shape='round' 
                loading={loading}
            >
                <h4>Present</h4>
            </Button>
        </>
    )
});