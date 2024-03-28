/*
 * codeslide.net
 *
 * @license
 * Forked from mydraft.cc by Sebastian Stehle
 * Copyright (c) Do Duc Quan. All rights reserved.
*/

import { Checkbox, Col, InputNumber, Row, Select } from 'antd';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';
import { useDispatch } from 'react-redux';
import { Color, ColorPalette, ColorPicker, useEventCallback } from '@app/core';
import { changeItemsAppearance, ColorConfigurable, Configurable, getColors, getDiagramId, getSelectedConfigurables, getSelectedShape, NumberConfigurable, selectColorTab, SelectionConfigurable, SliderConfigurable, TextConfigurable, ToggleConfigurable, useStore } from '@app/wireframes/model';
import { CustomSlider } from './CustomSlider';
import { Text } from './Text';

interface CustomPropertyProps {
    // The configurable.
    configurable: Configurable;

    // The appearance value.
    value: any;

    // The selected color tab.
    selectedColorTab: string;

    // The recent colors.
    recentColors: ColorPalette;

    // When the value has changed.
    onChange: (name: string, value: any) => void;

    // The color tab has changed.
    onColorTabChange: (key: string) => void;
}

export const CustomProperty = (props: CustomPropertyProps) => {
    const {
        configurable,
        onChange,
        onColorTabChange,
        recentColors,
        selectedColorTab,
        value,
    } = props;

    const doChangeValue = useEventCallback((newValue: any) => {
        onChange(configurable.name, newValue);
    });

    const doChangeColor = useEventCallback((color: Color) => {
        onChange(configurable.name, color.toNumber());
    });

    const doChangeBoolean = useEventCallback((event: CheckboxChangeEvent) => {
        onChange(configurable.name, event.target.checked);
    });

    return (
        <Row className='property'>
            <Col span={12} className='property-label'>
                {configurable.label}
            </Col>
            <Col span={12} className='property-value'>
                {configurable instanceof SliderConfigurable &&
                    <CustomSlider value={value}
                        min={configurable.min}
                        max={configurable.max}
                        onChange={doChangeValue} />
                }

                {configurable instanceof NumberConfigurable &&
                    <InputNumber value={value}
                        min={configurable.min}
                        max={configurable.max}
                        onChange={doChangeValue} />
                }

                {configurable instanceof TextConfigurable &&
                    <Text text={value}
                        onTextChange={doChangeValue} />
                }

                {configurable instanceof ToggleConfigurable &&
                    <Checkbox checked={value}
                        onChange={doChangeBoolean} />
                }

                {configurable instanceof SelectionConfigurable &&
                    <Select value={value}
                        onChange={doChangeValue}
                    >
                        {configurable.options.map(o =>
                            <Select.Option key={o} value={o}>{o}</Select.Option>,
                        )}
                    </Select>
                }

                {configurable instanceof ColorConfigurable &&
                    <ColorPicker activeColorTab={selectedColorTab as any} value={value}
                        onChange={doChangeColor}
                        onActiveColorTabChanged={onColorTabChange}
                        recentColors={recentColors} />
                }
            </Col>
        </Row>
    );
};

export const CustomProperties = () => {
    const dispatch = useDispatch();
    const recentColors = useStore(getColors);
    const selectedDiagramId = useStore(getDiagramId);
    const selectedColorTab = useStore(s => s.ui.selectedColor);
    const selectedConfigurables = useStore(getSelectedConfigurables);
    const selectedShape = useStore(getSelectedShape);

    const doSelectColorTab = useEventCallback((key: string) => {
        dispatch(selectColorTab(key));
    });

    const doChange = useEventCallback((key: string, value: any) => {
        if (selectedDiagramId && selectedShape) {
            dispatch(changeItemsAppearance(selectedDiagramId, [selectedShape], key, value));
        }
    });

    if (!selectedShape || !selectedDiagramId) {
        return null;
    }

    return (
        <>
            {selectedDiagramId && selectedConfigurables && selectedConfigurables.map(c =>
                <CustomProperty key={c.name}
                    selectedColorTab={selectedColorTab}
                    configurable={c}
                    onChange={doChange}
                    onColorTabChange={doSelectColorTab}
                    recentColors={recentColors}
                    value={selectedShape.appearance.get(c.name)}
                />,
            )}
        </>
    );
};
