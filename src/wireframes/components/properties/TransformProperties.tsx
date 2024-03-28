/*
 * codeslide.net
 *
 * @license
 * Forked from mydraft.cc by Sebastian Stehle
 * Copyright (c) Do Duc Quan. All rights reserved.
*/

import { Col, InputNumber, Row } from 'antd';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import { Rotation, useEventCallback, Vec2 } from '@app/core';
import { getDiagram, getDiagramId, getSelectionSet, Transform, transformItems, useStore } from '@app/wireframes/model';

export const TransformProperties = () => {
    const dispatch = useDispatch();
    const selectedDiagram = useStore(getDiagram)!;
    const selectedDiagramId = useStore(getDiagramId);
    const selectedIds = selectedDiagram?.selectedIds;
    const selectedSet = useStore(getSelectionSet)!;
    const selectedSetItems = selectedSet?.allItems;
    const [rotation, setRotation] = React.useState(Rotation.ZERO);

    const doTransform = useEventCallback((update: (oldBounds: Transform) => Transform) => {
        const oldBounds = transform;

        if (!oldBounds) {
            return;
        }

        const newBounds = update(oldBounds);
        
        if (newBounds.equals(oldBounds)) {
            return;
        }

        dispatch(transformItems(selectedDiagram, selectedSetItems, oldBounds, newBounds));

    });

    const [x, setX] = useDebounceCallback(value => {
        doTransform(oldBounds => {
            const dx = value - (oldBounds.position.x - 0.5 * oldBounds.size.x);

            // Move by the delta between new and old position, because we move relative to the bounding box.
            return oldBounds.moveBy(new Vec2(dx, 0));
        });
    }, 0);

    const [y, setY] = useDebounceCallback(value => {
        doTransform(oldBounds => {
            const dy = value - (oldBounds.position.y - 0.5 * oldBounds.size.y);
            
            // Move by the delta between new and old position, because we move relative to the bounding box.
            return oldBounds.moveBy(new Vec2(0, dy));
        });
    }, 0);

    const [w, setW] = useDebounceCallback(value => {
        doTransform(oldBounds => {
            const size = new Vec2(value, oldBounds.size.y);
            
            // Size by keeping the left top corner sticky.
            return oldBounds.resizeTopLeft(size);
        });
    }, 0);

    const [h, setH] = useDebounceCallback(value => {
        doTransform(oldBounds => {
            const size = new Vec2(oldBounds.size.x, value);
            
            // Size by keeping the left top corner sticky.
            return oldBounds.resizeTopLeft(size);
        });
    }, 0);

    const [r, setR] = useDebounceCallback(value => {
        doTransform(oldBounds => {
            const rotation = Rotation.fromDegree(value);
        
            // Rotate to the value.
            return oldBounds.rotateTo(rotation);
        });
    }, 0);

    React.useEffect(() => {
        setRotation(Rotation.ZERO);
    }, [selectedIds]);

    const transform = React.useMemo(() => {
        if (!selectedSetItems) {
            return;
        }
        if (selectedSetItems.length === 0) {
            return Transform.ZERO;
        } else if (selectedSetItems.length === 1) {
            return selectedSetItems[0].bounds(selectedDiagram);
        } else {
            const bounds = selectedSetItems.map(x => x.bounds(selectedDiagram!));

            return Transform.createFromTransformationsAndRotation(bounds, rotation);
        }
    }, [rotation, selectedDiagram, selectedSetItems]);
    
    React.useEffect(() => {
        if (!transform) {
            return;
        }
    
        setX(transform.position.x - 0.5 * transform.size.x);
        setY(transform.position.y - 0.5 * transform.size.y);
        setW(transform.size.x);
        setH(transform.size.y);
        setR(transform.rotation.degree);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [transform]);

    if (!selectedDiagramId) {
        return null;
    }

    return (
        <>
            <Row className='property' gutter={4}>
                <Col span={12}>
                    <InputNumber prefix='x' value={x} disabled />
                </Col>
                <Col span={12}>
                    <InputNumber prefix='w' value={w} disabled />
                </Col>
            </Row>

            <Row className='property' gutter={4}>
                <Col span={12}>
                    <InputNumber prefix='y' value={y} disabled />
                </Col>
                <Col span={12}>
                    <InputNumber prefix='h' value={h} disabled />
                </Col>
            </Row>

            <Row className='property' gutter={4}>
                <Col span={12}>
                    <InputNumber prefix='r' value={r} disabled />
                </Col>
            </Row>
        </>
    );
};

function useDebounceCallback<T>(callback: ((value: T) => void), initial: T): [T, (value: T) => void] {
    const [state, setState] = React.useState<T>(initial);

    const callbackHook = useEventCallback(callback);

    React.useEffect(() => {
        const currentState = state;

        const timer = setTimeout(() => {
            callbackHook(currentState);
        }, 500);

        return () => {
            clearTimeout(timer);
        };
    }, [callbackHook, state]);

    return [state, setState];
}