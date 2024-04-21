/*
 * codeslide.net
 *
 * @license
 * Forked from mydraft.cc by Sebastian Stehle
 * Copyright (c) Do Duc Quan. All rights reserved.
*/

import { ConfigProvider, Layout, Tour, TourProps } from 'antd';
import * as React from 'react';
import { useRouteMatch } from 'react-router';
import { ClipboardContainer } from '@app/core';
import { EditorView, ShapeView, PagesView, HeaderView, AnimationView, ToolView } from '@app/wireframes/components';
import { getSelection, loadDiagramFromServer, newDiagram, setIsTourOpen, useStore } from '@app/wireframes/model';
import { vogues } from './const';
import { CustomDragLayer } from './wireframes/components/CustomDragLayer';
import { OverlayContainer } from './wireframes/contexts/OverlayContext';
import { useEffect, useRef } from 'react';
import { useAppDispatch } from './store';

export const App = () => {
    const dispatch = useAppDispatch();
    const route = useRouteMatch<{ token?: string }>();
    const routeToken = route.params.token || null;
    const routeTokenSnapshot = React.useRef(routeToken);
    const selectedSet = useStore(getSelection);
    const sidebarWidth = useStore(s => s.ui.sidebarSize);
    const footerHeight = useStore(s => s.ui.footerSize);
    const applicationMode = useStore(s => s.ui.selectedMode);
    const isTourOpen = useStore(s => s.ui.isTourOpen);
    const tourRefs = Array(7).fill(0).map(() => useRef(null));

    useEffect(() => {
        const token = routeTokenSnapshot.current;

        if (token && token.length > 0) {
            dispatch(loadDiagramFromServer({ tokenToRead: token, navigate: false }));
        } else {
            dispatch(newDiagram(false));
        }
    }, [dispatch]);

    const margin = {
        tool: `${vogues.common.editorPad}px 0`,
        sideLeft: `${vogues.common.editorPad}px ${vogues.common.editorPad}px ${vogues.common.editorPad}px 0`,
        sideMid: `0 ${vogues.common.editorPad}px 0 0`,
        sideRight: `0 0 ${vogues.common.editorPad}px ${vogues.common.editorPad}px`,
        editor: `0 ${vogues.common.editorMargin}px`,
    }

    const walkthroughTour: TourProps['steps'] = [
        {
            title: 'Step 1: Starting Your Project',
            description: 'Start a fresh project, open an existing one, or save your work to your local machine. You can also click here to see the documentation for coding syntax.',
            target: () => tourRefs[0].current,
        },
        {
            title: 'Step 2: Designing Your Presentation',
            description: 'Use the canvas to layout and customize your presentation\'s structure.',
            target: () => tourRefs[1].current,
        },
        {
            title: 'Step 3: Adding Shapes',
            description: 'Add visual elements to your canvas by clicking on any shape.',
            target: () => tourRefs[2].current,
        },
        {
            title: 'Step 4: Modifying Appearance',
            description: 'Edit your objects\'s appearance such as color, font size, and stroke.',
            target: () => tourRefs[3].current,
        },
        {
            title: 'Step 5: Writing Code',
            description: 'Switch to coding mode to set object\'s occurrences. If you\'re stuck on syntax, the documentation is under the button at the top left corner.',
            target: () => tourRefs[4].current,
        },
        {
            title: 'Step 6: Managing Pages',
            description: 'Add new pages and continue unfolding your presentation.',
            target: () => tourRefs[5].current,
        },
        {
            title: 'Step 7: Launching Your Presentation',
            description: 'Start your presentation. If you need to make changes, you can always come back and edit.',
            target: () => tourRefs[6].current,
        },
    ];

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
                            <HeaderView refs={[tourRefs[0], tourRefs[4], tourRefs[6]]}  />
                        </Layout.Header>

                        <Layout className='content' style={{ padding: margin.editor }}>
                            <Layout.Header
                                ref={tourRefs[3]}
                                className='header-toolbar-left'
                                style={{ margin: margin.tool }}>
                                    <ToolView set={selectedSet} mode={applicationMode} />
                            </Layout.Header>

                            <Layout>
                                <Layout style={{ margin: margin.sideMid }}>
                                    <Layout.Sider 
                                        ref={tourRefs[2]}
                                        width={vogues.common.sidebarShape} className='sidebar-shape'>
                                            <ShapeView />
                                    </Layout.Sider>

                                    <Layout.Content ref={tourRefs[1]}>
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

                        <Layout.Footer 
                            ref={tourRefs[5]}
                            style={{ padding: 0, display: footerHeight == 0 ? 'none' : '' }} >
                                <PagesView prevWidth={vogues.common.previewWidth} prevHeight={vogues.common.previewHeight} />
                        </Layout.Footer>
                    </Layout>
                    <Tour
                        open={isTourOpen}
                        onClose={() => dispatch(setIsTourOpen(false))}
                        steps={walkthroughTour}
                    />
                    <CustomDragLayer />
                </ClipboardContainer>
            </OverlayContainer>
        </ConfigProvider>
    );
};
