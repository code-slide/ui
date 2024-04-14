/*
 * codeslide.net
 *
 * @license
 * Forked from mydraft.cc by Sebastian Stehle
 * Copyright (c) Do Duc Quan. All rights reserved.
*/

import React from "react"
import { SelectOutlined } from "@ant-design/icons"
import { Button, message } from "antd"
import { useDispatch } from "react-redux";
import { changeFrames, getDiagram, parseFrames, useStore } from "@app/wireframes/model";

export const ScriptHeader = React.memo(() => {
    const dispatch = useDispatch();
    const diagram = useStore(getDiagram);
    const [messageApi, contextHolder] = message.useMessage();

    if (!diagram) return null;
    
    const fetchFrames = async () => {
        const script = diagram.script;

        if (!script) {
            messageApi.error('Empty script. Cannot perform action');
            return;
        };

        try {
            const frames = await parseFrames(script);
            dispatch(changeFrames(diagram.id, frames));
            messageApi.success('Script is loaded successfully');
        } catch (error) {
            messageApi.error(`${error}`);
        }
    }

    return (
        <>
            {contextHolder}
            <Button 
                shape='round'
                className="header-cta-left"
                icon={<SelectOutlined />}
                onClick={fetchFrames} >
                    <h4>Load script</h4>
            </Button>
        </>
    )
})