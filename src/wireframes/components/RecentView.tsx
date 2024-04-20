/*
 * codeslide.net
 *
 * @license
 * Forked from mydraft.cc by Sebastian Stehle
 * Copyright (c) Do Duc Quan. All rights reserved.
*/

import { Empty } from 'antd';
import * as React from 'react';
import { useEventCallback } from '@app/core';
import { texts } from '@app/const';
import { loadDiagramFromServer, RecentDiagram, useStore } from '@app/wireframes/model';
import { useAppDispatch } from '@app/store';
import { RecentItem } from './menu';
import './styles/RecentView.scss';

export const RecentView = () => {
    const dispatch = useAppDispatch();
    const recent = useStore(x => x.loading.recentDiagrams);

    const doLoad = useEventCallback((item: RecentDiagram) => {
        dispatch(loadDiagramFromServer({ tokenToRead: item.tokenToRead, tokenToWrite: item.tokenToWrite, navigate: true }));
    });

    const orderedRecent = React.useMemo(() => {
        const result = Object.entries(recent).map(([tokenToRead, value]) => {
            return { ...value, tokenToRead };
        });

        result.sort((lhs, rhs) => rhs.date - lhs.date);

        return result;
    }, [recent]);

    return (
        <>
            <div className='recent-list'>
                {orderedRecent.map((item) =>
                    <RecentItem item={item} onLoad={doLoad} />,
                )}

                {orderedRecent.length === 0 &&
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={texts.common.noRecentDocument} />
                }
            </div>
        </>
    );
};
