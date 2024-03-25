/*
 * codeslide.net
 *
 * @license
 * Copyright (c) Sebastian Stehle. All rights reserved.
*/

import * as React from 'react';
import { Keys, Vec2, sizeInPx } from '@app/core';
import { DefaultAppearance } from '@app/wireframes/interface';
import { Diagram, DiagramItem } from '@app/wireframes/model';
import { InteractionHandler, InteractionService, SvgEvent } from './interaction-service';
import { getSelectedCell, getTableAttributes } from '../shapes/dependencies';
import { texts } from '@app/texts';

export interface TextAdornerProps {
    // The current zoom value.
    zoom: number;

    // The selected diagram.
    selectedDiagram: Diagram;

    // The selected items.
    selectedItems: DiagramItem[];

    // The interaction service.
    interactionService: InteractionService;

    // A function to change the appearance of a visual.
    onChangeItemsAppearance: (diagram: Diagram, visuals: DiagramItem[], key: string, val: any) => any;
}

export class TextAdorner extends React.PureComponent<TextAdornerProps> implements InteractionHandler {
    private readonly style = { display: 'none ' };
    private selectedShape: DiagramItem | null = null;
    private textareaElement: HTMLTextAreaElement = null!;
    private selectedRow = 0;
    private selectedCol = 0;

    public componentDidMount() {
        this.props.interactionService.addHandler(this);

        window.addEventListener('mousedown', this.handleMouseDown);
    }

    public componentWillUnmount() {
        this.props.interactionService.removeHandler(this);

        window.removeEventListener('mousedown', this.handleMouseDown);
    }

    public componentDidUpdate(prevProps: TextAdornerProps) {
        if (this.props.selectedItems !== prevProps.selectedItems) {
            this.updateText();
        }
    }

    private handleMouseDown = (e: MouseEvent) => {
        if (e.target !== this.textareaElement) {
            this.hide();
        }
    };

    public onDoubleClick(event: SvgEvent) {
        if (event.shape && !event.shape.isLocked && this.textareaElement) {
            if (event.shape.textDisabled) {
                return;
            }

            const zoom = this.props.zoom;
            const { content, sizeX, sizeY, positionX, positionY } = this.getAttribute(event.shape, event.position);
            const x = sizeInPx(zoom * (positionX - 0.5 * sizeX) - 2);
            const y = sizeInPx(zoom * (positionY - 0.5 * sizeY) - 2);
            const w = sizeInPx(zoom * sizeX + 4);
            const h = sizeInPx(zoom * sizeY + 4);

            this.textareaElement.value = content;
            this.textareaElement.style.top = y;
            this.textareaElement.style.left = x;
            this.textareaElement.style.width = w;
            this.textareaElement.style.height = h;
            this.textareaElement.style.resize = 'none';
            this.textareaElement.style.display = 'block';
            this.textareaElement.style.position = 'absolute';
            this.textareaElement.focus();

            this.props.interactionService.hideAdorners();

            this.selectedShape = event.shape;
        }
    }

    private doInitialize = (textarea: HTMLTextAreaElement) => {
        this.textareaElement = textarea;
    };

    private doHide = () => {
        this.hide();
    };

    private doSubmit = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if ((Keys.isEnter(event) && !event.shiftKey) || Keys.isEscape(event)) {
            if (Keys.isEnter(event)) {
                this.updateText();
            } else {
                this.hide();
            }

            this.hide();

            event.preventDefault();
            event.stopPropagation();
        }
    };

    private updateText() {
        if (!this.selectedShape) {
            return;
        }

        if (this.selectedShape.renderer == 'Table') {
            const newText = this.textareaElement.value
                .replace(texts.common.tableDelimiterRow, '&#59;')
                .replace(texts.common.tableDelimiterCol, '&#44;');
            const oldText = getTableAttributes(this.selectedShape.text).rows[this.selectedRow][this.selectedCol];
    
            if (newText !== oldText) {
                let tableText = getTableAttributes(this.selectedShape.text).rows;
                tableText[this.selectedRow][this.selectedCol] = newText;

                let fullText: string[] = [];
                tableText.forEach((e) => {
                    fullText.push(e.join(','));
                })

                this.props.onChangeItemsAppearance(this.props.selectedDiagram, [this.selectedShape], DefaultAppearance.TEXT, fullText.join(texts.common.tableDelimiterRow));
            }
        } else {
            const newText = this.textareaElement.value;
            const oldText = this.selectedShape.text;

            if (newText !== oldText) {
                this.props.onChangeItemsAppearance(this.props.selectedDiagram, [this.selectedShape], DefaultAppearance.TEXT, newText);
            }
        }
        this.hide();
    }

    private hide() {
        this.selectedShape = null;

        this.textareaElement.style.width = '0';
        this.textareaElement.style.display = 'none';

        this.props.interactionService.showAdorners();
    }

    private getAttribute(shape: DiagramItem, position: Vec2) {
        let content: string, sizeX: number, sizeY: number, positionX: number, positionY: number;
        const transform = shape.transform;

        if (shape.renderer == 'Table') {
            // Size
            const parseTable = getTableAttributes(shape.text);
            sizeX = shape.transform.aabb.width / parseTable.columnCount;
            sizeY = shape.transform.aabb.height / parseTable.rowCount;

            // Position
            const cell = getSelectedCell(
                {'x': parseInt(position.getX()), 'y': parseInt(position.getY())},
                {'x': shape.transform.left, 'y': shape.transform.top},
                {'x': sizeX, 'y': sizeY},
                {'x': parseTable.columnCount, 'y': parseTable.rowCount});
            positionX = shape.transform.left + sizeX * (cell.indexCol + 0.5);
            positionY = shape.transform.top + sizeY * (cell.indexRow + 0.5);

            // Text
            this.selectedRow = cell.indexRow;
            this.selectedCol = cell.indexCol;
            content = getTableAttributes(shape.text).rows[this.selectedRow][this.selectedCol];
        } else {
            // Size
            sizeX = transform.size.x;
            sizeY = transform.size.y;

            // Position
            positionX = transform.position.x;
            positionY = transform.position.y;

            // Text
            content = shape.text;
        }

        return { sizeX, sizeY, positionX, positionY, content }
    }

    public render() {
        return (
            <textarea className='ant-input no-border-radius' style={this.style}
                ref={this.doInitialize}
                onBlur={this.doHide}
                onKeyDown={this.doSubmit} />
        );
    }
}
