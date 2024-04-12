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
import { EditorView, ShapeView, ToolDesignView, PagesView, HeaderView, AnimationView, ToolAnimationView } from '@app/wireframes/components';
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
    const sidebarRightWidth = useStore(s => s.ui.sidebarRightSize);
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
                            {applicationMode == 'animation'
                                ?
                                <Layout>
                                    <Layout style={{ margin: margin.sideMid }}>
                                        <Layout.Header 
                                            className='header-toolbar-left' 
                                            style={{ margin: margin.tool }}>
                                                <ToolDesignView item={selectedItem} set={selectedSet} />
                                        </Layout.Header>

                                        <EditorView spacing={vogues.common.editorMargin} />
                                    </Layout>
                                    <Layout.Sider 
                                        width={sidebarRightWidth} 
                                        style={{ visibility: sidebarRightWidth == 0 ? 'hidden' : 'visible', margin: margin.sideRight }}
                                        className='sidebar-right'>
                                            <Layout.Header 
                                                className='header-toolbar-right'
                                                style={{ margin: margin.tool }}>
                                                    <ToolAnimationView />
                                            </Layout.Header>

                                            <AnimationView />
                                    </Layout.Sider>
                                </Layout>
                                :
                                <Layout>
                                    <Layout.Header 
                                        className='header-toolbar-left'
                                        style={{ margin: margin.tool }}>
                                            <ToolDesignView item={selectedItem} set={selectedSet} />
                                    </Layout.Header>
                                    <Layout>
                                        <Layout.Sider width={vogues.common.shapeWidth} className='sidebar-shape'>
                                            <ShapeView />
                                        </Layout.Sider>

                                        <EditorView spacing={vogues.common.editorMargin} />
                                    </Layout>
                                </Layout>
                            }
                        </Layout>

                        <Layout.Footer style={{ padding: 0 }} >
                            <PagesView prevWidth={vogues.common.previewWidth} prevHeight={vogues.common.previewHeight} />
                        </Layout.Footer>
                    </Layout>
                    <CustomDragLayer />
                </ClipboardContainer>
            </OverlayContainer>
        </ConfigProvider>
    );
};
