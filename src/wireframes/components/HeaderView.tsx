/*
 * codeslide.net
 *
 * @license
 * Forked from mydraft.cc by Sebastian Stehle
 * Copyright (c) Do Duc Quan. All rights reserved.
*/

import * as React from 'react';
import { Title } from '@app/core';
import { getEditor, useStore } from '@app/wireframes/model';
import { useLoading } from './actions';
import { ArrangeHeader, FileHeader, PresentHeader, IdHeader, ModeHeader } from './headers';
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
        <div className='header'>
            <div className='header-left'>
                <CustomTitle />
                <ArrangeHeader />
                <FileHeader />
                <IdHeader />
            </div>

            <span style={{ float: 'right' }}>
                <ModeHeader />
                <span className='menu-separator' />
                <PresentHeader />
            </span>
        </div>
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