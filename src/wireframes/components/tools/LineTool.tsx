/*
 * codeslide.net
 *
 * @license
 * Forked from mydraft.cc by Sebastian Stehle
 * Copyright (c) Do Duc Quan. All rights reserved.
*/

import { Button, Tooltip } from 'antd';
import * as React from 'react';
import { getDiagramId, getSelection, useStore } from '@app/wireframes/model';
import { useAppearance } from '../actions';
import { IconOutline, CurveBotLeftIcon, CurveUpRightIcon, LineDownIcon, LineEndArrowIcon, LineEndNoneIcon, LineEndTriangleIcon, LineStartArrowIcon, LineStartNoneIcon, LineStartTriangleIcon, LineUpIcon, CurveBotRightIcon, CurveUpLeftIcon } from '@app/icons/icon';
import { shapes } from '@app/const';
import { LineCurve, LineEdge, LineNode, LinePivot } from '@app/wireframes/interface';

export const LineTool = React.memo((props: {lineType: LineEdge}) => {
    const selectedDiagramId = useStore(getDiagramId);
    const selectedSet = useStore(getSelection);

    const [lineStart, setLineStart] = useAppearance<LineNode>(selectedDiagramId, selectedSet, shapes.key.lineStart);
    const [lineEnd, setLineEnd] = useAppearance<LineNode>(selectedDiagramId, selectedSet, shapes.key.lineEnd);
    const [lineCurve, setLineCurve] = useAppearance<LineCurve>(selectedDiagramId, selectedSet, shapes.key.lineCurve);
    const [linePivot, setLinePivot] = useAppearance<LinePivot>(selectedDiagramId, selectedSet, shapes.key.linePivot);

    if (!selectedDiagramId) {
        return null;
    }

    return (
        <>
            <Tooltip mouseEnterDelay={1} title={ 'Line Start' }>
                <Button 
                    type='text' disabled={lineStart.empty} 
                    aria-label='Set Line Start'
                    icon={
                        lineStart.value == 'None'
                        ? <IconOutline icon={LineStartNoneIcon} />
                        : lineStart.value == 'Arrow'
                        ? <IconOutline icon={LineStartArrowIcon} />
                        : <IconOutline icon={LineStartTriangleIcon} />
                    } 
                    onClick={() => {
                        lineStart.value == 'None'
                        ? setLineStart('Arrow')
                        : lineStart.value == 'Arrow'
                        ? setLineStart('Triangle')
                        : setLineStart('None')
                    }}
                />
            </Tooltip>

            <Tooltip mouseEnterDelay={1} title={ 'Line End' }>
                <Button 
                    type='text' disabled={lineEnd.empty} 
                    aria-label='Set Line End'
                    icon={
                        lineEnd.value == 'None'
                        ? <IconOutline icon={LineEndNoneIcon} />
                        : lineEnd.value == 'Arrow'
                        ? <IconOutline icon={LineEndArrowIcon} />
                        : <IconOutline icon={LineEndTriangleIcon} />
                    } 
                    onClick={() => {
                        lineEnd.value == 'None'
                        ? setLineEnd('Arrow')
                        : lineEnd.value == 'Arrow'
                        ? setLineEnd('Triangle')
                        : setLineEnd('None')
                    }}
                />
            </Tooltip>

            <Tooltip mouseEnterDelay={1} title={ 'Line Direction' }>
                <Button 
                    type='text' disabled={linePivot.empty}
                    aria-label='Set Line Direction'
                    style= {{ display: props.lineType == 'Quadratic' ? 'none' : '' }} 
                    icon={
                        linePivot.value == 'Top'
                        ? <IconOutline icon={LineDownIcon} />
                        : <IconOutline icon={LineUpIcon} />
                    } 
                    onClick={() => {
                        linePivot.value == 'Top'
                        ? setLinePivot('Bottom')
                        : setLinePivot('Top')
                    }}
                />
            </Tooltip>

            <Tooltip mouseEnterDelay={1} title={ 'Curve Direction' }>
                <Button 
                    type='text' disabled={lineCurve.empty} 
                    aria-label='Set Curve Direction'
                    style= {{ display: props.lineType == 'Linear' ? 'none' : '' }} 
                    icon={
                        lineCurve.value == 'Down' && linePivot.value == 'Bottom'
                        ? <IconOutline icon={CurveUpLeftIcon} />
                        : lineCurve.value == 'Up' && linePivot.value == 'Top'
                        ? <IconOutline icon={CurveUpRightIcon} />
                        : lineCurve.value == 'Down' && linePivot.value == 'Top'
                        ? <IconOutline icon={CurveBotLeftIcon} />
                        : <IconOutline icon={CurveBotRightIcon} />
                    } 
                    onClick={() => {
                        if (linePivot.value == 'Bottom')
                            setLinePivot('Top');
                        if (linePivot.value == 'Top')
                            setLinePivot('Bottom');
                        else if (lineCurve.value == 'Down')
                            setLineCurve('Up');
                        else
                            setLineCurve('Down');
                    }}
                />
            </Tooltip>
        </>
    );
});