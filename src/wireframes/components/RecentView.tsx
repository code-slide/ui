/*
 * codeslide.net
 *
 * @license
 * Forked from mydraft.cc by Sebastian Stehle
 * Copyright (c) Do Duc Quan. All rights reserved.
*/

import { Empty } from 'antd';
import * as React from 'react';
import { texts } from '@app/const';
import { useStore } from '@app/wireframes/model';
import './styles/RecentView.scss';

export const RecentView = () => {
    const recent = useStore(x => x.loading.recentDiagrams);

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
                {orderedRecent.length === 0 &&
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={texts.common.noRecentDocument} />
                }
            </div>
        </>
    );
};
