/*
 * codeslide.net
 *
 * @license
 * Copyright (c) Sebastian Stehle. All rights reserved.
*/

/*
 * codeslide.net
 *
 * @license
 * Copyright (c) Sebastian Stehle. All rights reserved.
*/

import { texts } from '@app/texts';
import { DefaultAppearance, Rect2, RenderContext, Shape, ShapePlugin } from '@app/wireframes/interface';
import { DiagramItem } from '@app/wireframes/model';
import { CommonTheme } from './_theme';

const DELIMITER_ROW = texts.common.tableDelimiterRow;  // ;
const DELIMITER_COL = texts.common.tableDelimiterCol;  // ,
const SELECTED_CELL_X = 'SELECTED_CELL_X';
const SELECTED_CELL_Y = 'SELECTED_CELL_Y';
const DEFAULT_APPEARANCE = {
    [DefaultAppearance.BACKGROUND_COLOR]: '#fff',
    [DefaultAppearance.FONT_SIZE]: CommonTheme.CONTROL_FONT_SIZE,
    [DefaultAppearance.FOREGROUND_COLOR]: CommonTheme.CONTROL_TEXT_COLOR,
    [DefaultAppearance.STROKE_COLOR]: CommonTheme.CONTROL_BORDER_COLOR,
    [DefaultAppearance.STROKE_THICKNESS]: CommonTheme.CONTROL_BORDER_THICKNESS,
    [DefaultAppearance.TEXT_ALIGNMENT]: 'center',
    [DefaultAppearance.TEXT]: '',
    [SELECTED_CELL_X]: 0,
    [SELECTED_CELL_Y]: 0,
};

export class Table implements ShapePlugin {
    public identifier(): string {
        return 'Table';
    }

    public defaultAppearance() {
        return DEFAULT_APPEARANCE;
    }

    public defaultSize() {
        return { x: 500, y: 400 };
    }

    public render(ctx: RenderContext) {
        const w = ctx.rect.width;
        const h = ctx.rect.height;

        const { rows, columnCount, rowCount } = this.parseText(ctx.shape);

        const cellWidth = w / columnCount;
        const cellHeight = h / rowCount;

        this.createFrame(ctx);
        this.createBorders(ctx, columnCount, cellWidth, rows, cellHeight);
        this.createTexts(rows, cellWidth, cellHeight, ctx);
    }

    private createTexts(rows: string[][], cellWidth: number, cellHeight: number, ctx: RenderContext) {
        let y = 0;

        for (const row of rows) {
            let x = 0;

            for (const cell of row) {
                const rect = new Rect2(x, y, cellWidth, cellHeight);

                ctx.renderer2.text(ctx.shape, rect, p => {
                    p.setText(cell);
                    p.setForegroundColor(ctx.shape);
                });

                x += cellWidth;
            }

            y += cellHeight;
        }
    }

    private createBorders(ctx: RenderContext, columnCount: number, cellWidth: number, rows: string[][], cellHeight: number) {
        const strokeColor = ctx.shape.getAppearance(DefaultAppearance.STROKE_COLOR);
        const strokeWidth = ctx.shape.getAppearance(DefaultAppearance.STROKE_THICKNESS);

        for (let x = 0; x < columnCount; x++) {
            for (let y = 0; y < rows.length; y++) {
                const offsetX = Math.round(x * cellWidth);
                const offsetY = Math.round(y * cellHeight - strokeWidth * 0.25 - strokeWidth * 0.25);

                // Top
                const rectX = new Rect2(offsetX, offsetY, cellWidth, strokeWidth);
                ctx.renderer2.rectangle(0, 0, rectX, p => {
                    p.setBackgroundColor(strokeColor);
                });

                // Bottom
                const rectY = new Rect2(offsetX, offsetY + cellHeight, cellWidth, strokeWidth);
                ctx.renderer2.rectangle(0, 0, rectY, p => {
                    p.setBackgroundColor(strokeColor);
                });
            }
        }
    }

    private createFrame(ctx: RenderContext) {
        ctx.renderer2.rectangle(ctx.shape, CommonTheme.CONTROL_BORDER_RADIUS, ctx.rect, p => {
            p.setBackgroundColor(ctx.shape);
        });
    }

    private parseText(shape: Shape) {
        const key = shape.text;
        // @ts-ignore
        let result = shape.renderCache['PARSED'] as { key: string; parsed: Parsed };

        if (!result || result.key !== key) {
            const { rows, columnCount, rowCount } = getTableAttributes(key);
            result = { parsed: { rows, columnCount, rowCount }, key };
            // @ts-ignore
            shape.renderCache['PARSED'] = result;
        }

        return result.parsed;
    }
}

export function getTableAttributes(text: string) {
    const rows = text.split(DELIMITER_ROW).map(x => x.split(DELIMITER_COL).map(c => c.trim()));
    const rowCount = rows.length;

    let columnCount = 0;
    for (const row of rows) {
        columnCount = Math.max(columnCount, row.length);
    }

    for (const row of rows) {
        while (row.length < columnCount) {
            row.push('');
        }
    }

    return { rows, columnCount, rowCount };
}

export function getAddToTable(item: DiagramItem, index: number, delimiter: string) {
    const text = item.text;
    let newText = '';

    if (item.renderer == 'Table') {
        let counter = 0;
        let startString = 0;
        let writeEnable = true;

        // FSA for adding delimiter to the specific position
        switch (delimiter) {
            // Add new col into every rows
            case DELIMITER_COL:
                for (let i = 0; i <= text.length; i++) {
                    const isLastChar = (counter == index) || (text[i] == DELIMITER_ROW) || (i == text.length);
                    if (writeEnable && isLastChar) {
                        newText += `${text.substring(startString, i)}${delimiter} `;
                        startString = i;
                        writeEnable = false;
                    }
                    counter = (text[i] != DELIMITER_ROW) ? (text[i] != delimiter) ? counter : counter + 1 : 0;
                    writeEnable = (text[i] != DELIMITER_ROW) ? writeEnable : true;
                }
                break;
            // Add new row into the table
            case DELIMITER_ROW:
                for (let i = 0; i <= text.length; i++) {
                    const isLastChar = (counter == index) || (i == text.length);
                    if (writeEnable && isLastChar) {
                        newText += `${text.substring(startString, i)}${delimiter} `;
                        startString = i;
                        writeEnable = false;
                    }
                    counter = (text[i] != delimiter) ? counter : counter + 1;
                }
                break;
            default:
                break;
        }

        // Add the rest
        if (startString != text.length - 1) {
            newText += `${text.substring(startString, text.length)}`;
        }
    }

    return newText;
}

export function getRemoveFromTable(item: DiagramItem, index: number, delimiter: string) {
    const text = item.text;
    let newText = (text.includes(delimiter)) ? '' : text;

    if (item.renderer == 'Table' && text.includes(delimiter)) {
        const FIRST_CELL = 0;
        let counter = 0;

        // FSA for deleting texts in the specific position
        switch (delimiter) {
            // Delete a col in every row
            case DELIMITER_COL:
                for (let i = 0; i <= text.length; i++) {
                    const startString = (index == FIRST_CELL) ? i : i - 1;
                    if (counter != index) {
                        newText += `${text.substring(startString, startString + 1)}`;
                    }
                    counter = (text[i] != DELIMITER_ROW) ? (text[i] != delimiter) ? counter : counter + 1 : 0;
                }
                break;
            // Delete an entire row
            case DELIMITER_ROW:
                for (let i = 0; i <= text.length; i++) {
                    const startString = (index == FIRST_CELL) ? i : i - 1;
                    if (counter != index) {
                        newText += `${text.substring(startString, startString + 1)}`;
                    }
                    counter = (text[i] != delimiter) ? counter : counter + 1;
                }
                break;
            default:
                break;
        }
    }

    return newText;
}

export function getSelectedCell(position: Record<string, number>, start: Record<string, number>, offset: Record<string, number>, count: Record<string, number>) {
    let indexRow = 0;
    let indexCol = 0;
    
    for (let i = 1; i < count['y']; i++) {
        if (position['y'] > start['y'] + offset['y'] * i) {
            indexRow++;
        }
    }

    for (let i = 1; i < count['x']; i++) {
        if (position['x'] > start['x'] + offset['x'] * i) {
            indexCol++;
        }
    }

    return { indexRow, indexCol };
}

type Parsed = { rows: string[][]; columnCount: number; rowCount: number };