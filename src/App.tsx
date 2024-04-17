/*
 * codeslide.net
 *
 * @license
 * Forked from mydraft.cc by Sebastian Stehle
 * Copyright (c) Do Duc Quan. All rights reserved.
*/

import { ConfigProvider, Layout } from 'antd';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import { useRouteMatch } from 'react-router';
import { ClipboardContainer } from '@app/core';
import { EditorView, ShapeView, PagesView, HeaderView, AnimationView, ToolView } from '@app/wireframes/components';
import { getSelectedItems, getSelectedShape, loadDiagramFromServer, newDiagram, useStore } from '@app/wireframes/model';
import { vogues } from './const';
import { CustomDragLayer } from './wireframes/components/CustomDragLayer';
import { OverlayContainer } from './wireframes/contexts/OverlayContext';

export const App = () => {
    const dispatch = useDispatch();
    const route = useRouteMatch<{ token?: string }>();
    const routeToken = route.params.token || null;
    const routeTokenSnapshot = React.useRef(routeToken);
    const selectedItem = useStore(getSelectedShape);
    const selectedSet = useStore(getSelectedItems);
    const sidebarWidth = useStore(s => s.ui.sidebarSize);
    const footerHeight = useStore(s => s.ui.footerSize);
    const applicationMode = useStore(s => s.ui.selectedMode);

    const margin = {
        tool: `${vogues.common.editorPad}px 0`,
        sideLeft: `${vogues.common.editorPad}px ${vogues.common.editorPad}px ${vogues.common.editorPad}px 0`,
        sideMid: `0 ${vogues.common.editorPad}px 0 0`,
        sideRight: `0 0 ${vogues.common.editorPad}px ${vogues.common.editorPad}px`,
        editor: `0 ${vogues.common.editorMargin}px`,
    }

    React.useEffect(() => {
        const token = routeTokenSnapshot.current;

        if (token && token.length > 0) {
            dispatch(loadDiagramFromServer({ tokenToRead: token, navigate: false }));
        } else {
            dispatch(newDiagram(false));
        }
    }, [dispatch]);

    React.useEffect(() => {
        const handleContextmenu = (e: MouseEvent) => { e.preventDefault() };
        document.addEventListener('contextmenu', handleContextmenu);
        
        return function cleanup() {
            document.removeEventListener('contextmenu', handleContextmenu)
        }
    }, [])

    return (
        <ConfigProvider
            theme={{
                components: {
                    Dropdown: {
                        paddingBlock: 7,
                    },
                    Layout: {
                        headerHeight: vogues.common.headerHeight,
                    },
                    Tabs: {
                        horizontalItemGutter: 16,
                    }
                },
                token: {
                    borderRadiusLG: 16,
                    borderRadiusSM: 12,
                },
            }}
        >
            <OverlayContainer>
                <ClipboardContainer>
                    <Layout className='screen-mode'>
                        <Layout.Header>
                            <HeaderView />
                        </Layout.Header>

                        <Layout className='content' style={{ padding: margin.editor }}>
                            <Layout.Header 
                                className='header-toolbar-left' 
                                style={{ margin: margin.tool }}>
                                    <ToolView item={selectedItem} set={selectedSet} mode={applicationMode}  />
                            </Layout.Header>

                            <Layout>
                                <Layout style={{ margin: margin.sideMid }}>
                                    <Layout.Sider width={vogues.common.sidebarShape} className='sidebar-shape'>
                                        <ShapeView />
                                    </Layout.Sider>

                                    <Layout.Content >
                                        <EditorView spacing={vogues.common.editorMargin} />
                                    </Layout.Content>
                                </Layout>

                                <Layout.Sider 
                                    width={vogues.common.sidebarCode} className='sidebar-right'
                                    style={{ display: sidebarWidth == 0 ? 'none' : '', margin: margin.sideRight }}
                                >
                                    <AnimationView />
                                </Layout.Sider>
                            </Layout>
                        </Layout>

                        <Layout.Footer style={{ padding: 0, display: footerHeight == 0 ? 'none' : '' }} >
                            <PagesView prevWidth={vogues.common.previewWidth} prevHeight={vogues.common.previewHeight} />
                        </Layout.Footer>
                    </Layout>
                    <CustomDragLayer />
                </ClipboardContainer>
            </OverlayContainer>
        </ConfigProvider>
    );
};
