/*
 * codeslide.net
 *
 * @license
 * Forked from mydraft.cc by Sebastian Stehle
 * Copyright (c) Do Duc Quan. All rights reserved.
*/

import { ConfigProvider, Layout, Tour, TourProps } from 'antd';
import { ClipboardContainer } from '@app/core';
import { EditorView, ShapeView, PagesView, HeaderView, AnimationView, ToolView } from '@app/wireframes/components';
import { getSelection, newDiagram, setIsTourOpen, useStore } from '@app/wireframes/model';
import { vogues } from './const';
import { CustomDragLayer } from './wireframes/components/CustomDragLayer';
import { OverlayContainer } from './wireframes/contexts/OverlayContext';
import { useEffect, useRef } from 'react';
import { useAppDispatch } from './store';

export const App = () => {
    const dispatch = useAppDispatch();
    const selectedSet = useStore(getSelection);
    const sidebarWidth = useStore(s => s.ui.sidebarSize);
    const footerHeight = useStore(s => s.ui.footerSize);
    const applicationMode = useStore(s => s.ui.selectedMode);
    const isTourOpen = useStore(s => s.ui.isTourOpen);
    const isTourInit = useStore(s => s.ui.isTourInit);
    const tourRefs = Array(7).fill(0).map(() => useRef(null));
    const nullRef = useRef(null);

    useEffect(() => {
        dispatch(newDiagram(false));
        // dispatch(setIsTourInit(false));
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
            title: 'Get started with a presentation',
            description: 'Start a fresh presentation, open an existing one, or save your presentation to your local machine. You can also click here to see the documentation for coding syntax.',
            target: () => tourRefs[0].current,
        },
        {
            title: 'Add Objects',
            description: 'Add visual elements to your canvas by clicking on any shape.',
            placement: 'rightTop',
            target: () => tourRefs[1].current,
        },
        {
            title: 'Design Your Presentation',
            description: 'Use the canvas to layout and customize your presentation\'s structure. Canvas is where you can add shapes, text, and images.',
            target: () => tourRefs[2].current,
        },
        {
            title: 'Modify Appearance',
            description: 'Edit your objects\'s appearance such as color, font size, and stroke.',
            placement: 'bottom',
            target: () => tourRefs[3].current,
        },
        {
            title: 'Write Code',
            description: (
                applicationMode == 'design'
                    ? <p style={{ margin: 0 }}>
                        Switch to coding mode to set object's occurrences. If you're stuck on syntax, navigate to our documentation at <a href="https://github.com/code-slide/ui/wiki">GitHub Wiki</a>
                    </p>
                    : <p style={{ margin: 0 }}>
                        Write syntaxes and Python codes to animate your presentation. If you're stuck on syntax, navigate to our documentation at <a href="https://github.com/code-slide/ui/wiki">GitHub Wiki</a>.
                    </p>
            ),
            placement: 'left',
            target: () => tourRefs[4].current,
        },
        {
            title: 'Manage Pages',
            description: 'Add new pages and continue unfolding your presentation.',
            placement: 'top',
            target: () => tourRefs[5].current,
        },
        {
            title: 'Launch Presentation',
            description: 'Start your presentation. If you need to make changes, you can always come back and edit. Enjoy!',
            placement: 'bottomLeft',
            target: () => tourRefs[6].current,
        },
    ];

    const firstTour: TourProps['steps'] = [
        {
            title: 'Welcome to CodeSlide',
            description: 'CodeSlide is a tool for creating presentations with code. You can create slides with shapes, text, and images, and animate them with code.',
            cover: <img src="../thumbnail.jpg" alt="CodeSlide Thumbnail" />,
            target: null,
        },
        ...walkthroughTour
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
                            <HeaderView refs={[tourRefs[0], applicationMode == 'design' ? tourRefs[4] : nullRef, tourRefs[6]]}  />
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
                                        ref={tourRefs[1]}
                                        width={vogues.common.sidebarShape} className='sidebar-shape'>
                                            <ShapeView />
                                    </Layout.Sider>

                                    <Layout.Content ref={tourRefs[2]}>
                                        <EditorView spacing={vogues.common.editorMargin} />
                                    </Layout.Content>
                                </Layout>

                                <Layout.Sider
                                    ref={ applicationMode == 'animation' ? tourRefs[4] : nullRef }
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
                        steps={isTourInit ? firstTour : walkthroughTour}
                    />
                    <CustomDragLayer />
                </ClipboardContainer>
            </OverlayContainer>
        </ConfigProvider>
    );
};
