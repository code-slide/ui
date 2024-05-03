/*
 * codeslide.net
 *
 * @license
 * Forked from mydraft.cc by Sebastian Stehle
 * Copyright (c) Do Duc Quan. All rights reserved.
*/

import * as React from 'react';

import 'prismjs/themes/prism.css';
import { Col, Row } from 'antd';
import { texts } from '@app/const';

export const AboutSetting = React.memo(() => {

    return (
        <>
            <Row className='property'>
                <h1>CodeSlide</h1>
            </Row>

            <Row className='property'>
                <p>Copyright © 2024. <a href='https://www.codeslide.net'>CodeSlide</a>. MIT License</p>
            </Row>

            <Row className='property'>
                <Col span={1} />
                <Col span={3} className='property-label'>{texts.common.version}</Col>
                <Col span={7} className='property-label'>{texts.vars.version}</Col>
            </Row>

            <Row className='property'>
                <Col span={1} />
                <Col span={3} className='property-label'>{texts.common.contactAuthor}</Col>
                <Col span={7} className='property-label'>
                    <a href='https://www.dodquan.com'>Do Duc Quan</a>
                </Col>
            </Row>
            
            <Row className='property'>
                <Col span={1} />
                <Col span={3} className='property-label'>{texts.common.contactEmail}</Col>
                <Col span={7} className='property-label'>
                    <a href='mailto:dodquan@gmail.com'>dodquan@gmail.com</a>
                </Col>
            </Row>

            <Row className='property'>
                <Col span={1} />
                <Col span={3} className='property-label'>{texts.common.reportIssue}</Col>
                <Col span={7} className='property-label'>
                    <a href='https://github.com/code-slide/ui/issues'>GitHub Issues</a>
                </Col>
            </Row>
        </>
    );
})