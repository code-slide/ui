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
import { EditorView, ShapeView, ToolDesignView, PagesView, HeaderView, PropertiesView, AnimationView, ToolAnimationView } from '@app/wireframes/components';
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
    const sidebarLeftWidth = useStore(s => s.ui.sidebarLeftSize);
    const sidebarRightWidth = useStore(s => s.ui.sidebarRightSize);
    const applicationMode = useStore(s => s.ui.selectedMode);

    const margin = {
        toolLeft: `${vogues.common.editorPad}px ${vogues.common.editorMargin}px ${vogues.common.editorPad}px ${vogues.common.editorPad}px`,
        toolRight: `${vogues.common.editorPad}px 0`,
        sideLeft: `${vogues.common.editorPad}px ${vogues.common.editorPad / 2}px ${vogues.common.editorPad / 2}px ${vogues.common.editorMargin}px`,
        sideRight: `0 ${vogues.common.editorMargin}px ${vogues.common.editorPad}px ${vogues.common.editorPad / 2}px`,
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

                        <Layout className='content'>
                            <Layout.Sider
                                width={sidebarLeftWidth}
                                style={{ visibility: sidebarLeftWidth == 0 ? 'hidden' : 'visible', margin: margin.sideLeft }}
                                className='sidebar-left'>
                                <PropertiesView />
                            </Layout.Sider>

                            {applicationMode == 'animation'
                                ?
                                <Layout>
                                    <Layout>
                                        <Layout.Header 
                                            className='header-toolbar-left' 
                                            style={{ margin: margin.toolLeft }}>
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
                                                style={{ margin: margin.toolRight }}>
                                                    <ToolAnimationView />
                                            </Layout.Header>

                                            <AnimationView />
                                    </Layout.Sider>
                                </Layout>
                                :
                                <Layout>
                                    <Layout.Header 
                                        className='header-toolbar-left'
                                        style={{ margin: margin.toolLeft }}>
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
