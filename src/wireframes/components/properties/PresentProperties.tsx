/*
 * codeslide.net
 *
 * @license
 * Forked from mydraft.cc by Sebastian Stehle
 * Copyright (c) Do Duc Quan. All rights reserved.
*/

import * as React from 'react';
import Prism from 'prismjs';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { default as RevealEditor } from 'react-simple-code-editor';
import { changeRevealConfig, getEditor, useStore } from '@app/wireframes/model';

import 'prismjs/components/prism-JSON';
import 'prismjs/themes/prism.css';
import { Button, Space } from 'antd';
import { vogues } from '@app/const';

export const PresentProperties = React.memo(() => {
    const dispatch = useDispatch();
    const editor = useStore(getEditor);
    const [revealScr, setRevealScr] = useState('');
    const [isScrChange, setIsScrChange] = useState(false);

    useEffect(() => {
        setRevealScr(editor.revealConfig);
    }, [editor.revealConfig]);

    const handleSrcChange = (value: string) => {
        setRevealScr(value);
        setIsScrChange(true);
    }

    const handleSrcSave = () => {
        setIsScrChange(false);
        dispatch(changeRevealConfig(revealScr));
    }

    const handleSrcCancel = () => {
        setIsScrChange(false);
        setRevealScr(editor.revealConfig);
    }

    return (
        <>
            <p>For more config options, please visit <a href='https://revealjs.com/config/'>https://revealjs.com/config/</a></p>
            <div style={{
                borderRadius: 20,
                backgroundColor: vogues.color.codeEditor,
                maxHeight: 400,
                tabSize: '4ch',
                fontFamily: 'monospace',
                fontSize: 13,
                lineHeight: '18px',
                overflow: 'auto',
            }}>
                <RevealEditor 
                    value={revealScr}
                    onValueChange={handleSrcChange}
                    highlight={code => Prism.highlight(code, Prism.languages.json, 'JSON')}
                    padding={16}
                />
            </div>
            <Space style={{ 
                visibility: isScrChange ? 'visible' : 'hidden',
                justifyContent: 'end', 
                paddingTop: 10
            }}>
                <Button onClick={handleSrcCancel} type="text" shape='round'>
                    <h4>Cancel</h4>
                </Button>
                <Button onClick={handleSrcSave} className="header-cta-right" type="text" shape='round'>
                    <h4>Save</h4>
                </Button>
            </Space>
            
        </>
    )
})