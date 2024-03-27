/*
 * codeslide.net
 *
 * @license
 * Copyright (c) Sebastian Stehle. All rights reserved.
*/

import * as React from 'react';
import { Title } from '@app/core';
import { getEditor, useStore } from '@app/wireframes/model';
import { useLoading } from './actions';
import { ArrangeMenu, FileMenu, PresentMenu } from './menu';
import './styles/HeaderView.scss'

export const HeaderView = React.memo(() => {
    const forLoading = useLoading();
    const editor = useStore(s => s.editor);
    const tokenToWrite = useStore(s => s.loading.tokenToWrite);
    const saveTimer = React.useRef<any>();
    const saveAction = React.useRef(forLoading.downloadDiagram);

    saveAction.current = forLoading.downloadDiagram;

    React.useEffect(() => {
        function clearTimer() {
            if (saveTimer.current) {
                clearInterval(saveTimer.current);
                saveTimer.current = null;
            }
        }

        if (tokenToWrite) {
            if (!saveTimer.current) {
                saveTimer.current = setInterval(() => {
                    if (!saveAction.current.disabled) {
                        saveAction.current.onAction();
                    }
                }, 30000);
            }

            const stopTimer = setTimeout(() => {
                clearTimer();
            }, 40000);

            return () => {
                clearTimeout(stopTimer);
            };
        } else {
            clearTimer();

            return undefined;
        }
    }, [tokenToWrite, editor]);

    return (
        <>
            <div className='header-left'>
                <CustomTitle />
                <ArrangeMenu />
                <FileMenu />
            </div>

            <span style={{ float: 'right' }}>
                <PresentMenu />
            </span>
        </>
    );
});

const CustomTitle = React.memo(() => {
    // Get editor's name
    const editor = useStore(getEditor);
    let name = editor.name;
    React.useEffect(() => {
        name = editor.name;
    }, [editor.name])

    return (
        <Title text={name} />
    );
});