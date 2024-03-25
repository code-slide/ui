/*
 * codeslide.net
 *
 * @license
 * Copyright (c) Sebastian Stehle. All rights reserved.
*/

import { ConfigProvider, Layout } from 'antd';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import { useRouteMatch } from 'react-router';
import { ClipboardContainer } from '@app/core';
import { EditorView, ShapeView, ToolDesignView, PagesView, HeaderView, PropertiesView, AnimationView, ToolAnimationView } from '@app/wireframes/components';
import { getSelectedItems, getSelectedShape, loadDiagramFromServer, newDiagram, useStore } from '@app/wireframes/model';
import { CustomDragLayer } from './wireframes/components/CustomDragLayer';
import { OverlayContainer } from './wireframes/contexts/OverlayContext';

export const App = () => {
    const dispatch = useDispatch();
    const route = useRouteMatch();
    // @ts-ignore
    const routeToken = route.params['token'] || null;
    const routeTokenSnapshot = React.useRef(routeToken);
    const selectedItem = useStore(getSelectedShape);
    const selectedSet = useStore(getSelectedItems);
    const sidebarLeftWidth = useStore(s => s.ui.sidebarLeftSize);
    const sidebarRightWidth = useStore(s => s.ui.sidebarRightSize);
    const applicationMode = useStore(s => s.ui.selectedMode);

    const SHAPE_WIDTH = 38;
    const PREVIEW_WIDTH = 128;
    const PREVIEW_HEIGHT = 72;
    const EDITOR_MARGIN = 13;

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
                        headerHeight: 56,
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
                                style={{ visibility: sidebarLeftWidth == 0 ? 'hidden' : 'visible' }}
                                className='sidebar-left'>
                                <PropertiesView />
                            </Layout.Sider>

                            {applicationMode == 'animation'
                                ?
                                <Layout>
                                    <Layout>
                                        <Layout.Header className='header-toolbar-left'>
                                            <ToolDesignView item={selectedItem} set={selectedSet} />
                                        </Layout.Header>

                                        <EditorView spacing={EDITOR_MARGIN} />
                                    </Layout>
                                    <Layout.Sider 
                                        width={sidebarRightWidth} 
                                        style={{ visibility: sidebarRightWidth == 0 ? 'hidden' : 'visible' }}
                                        className='sidebar-right'>
                                            <Layout.Header className='header-toolbar-right'>
                                                <ToolAnimationView />
                                            </Layout.Header>

                                            <AnimationView />
                                    </Layout.Sider>
                                </Layout>
                                :
                                <Layout>
                                    <Layout.Header className='header-toolbar-left'>
                                        <ToolDesignView item={selectedItem} set={selectedSet} />
                                    </Layout.Header>
                                    <Layout>
                                        <Layout.Sider width={SHAPE_WIDTH} className='sidebar-shape'>
                                            <ShapeView />
                                        </Layout.Sider>

                                        <EditorView spacing={EDITOR_MARGIN} />
                                    </Layout>
                                </Layout>
                            }
                        </Layout>

                        <Layout.Footer style={{ padding: 0 }} >
                            <PagesView prevWidth={PREVIEW_WIDTH} prevHeight={PREVIEW_HEIGHT} />
                        </Layout.Footer>
                    </Layout>
                    <CustomDragLayer />
                </ClipboardContainer>
            </OverlayContainer>
        </ConfigProvider>
    );
};
