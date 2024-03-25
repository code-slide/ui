/*
 * codeslide.net
 *
 * @license
 * Copyright (c) Sebastian Stehle. All rights reserved.
*/

import * as svg from '@svgdotjs/svg.js';
import { Color } from '@app/core';
import { SnapLine, SnapResult, Transform } from '@app/wireframes/model';

const COLOR_RED = Color.RED.toString();
const COLOR_BLUE = Color.RED.toString();
const COLOR_PURPLE = '#a020f0';

const MIN_VALUE = -1000;
const MAX_VALUE = 1000;

export class InteractionOverlays {
    private readonly lines: svg.Line[] = [];
    private readonly labels: svg.G[] = [];
    // private readonly textWidthCache: { [fontSize: string]: number } = {};
    // private indexLabels = 0;
    private indexLines = 0;
    private zoom = 1;

    constructor(
        private readonly layer: svg.Container,
    ) {
    }

    public setZoom(zoom: number) {
        this.zoom = zoom;
    }

    public showSnapAdorners(snapResult: SnapResult) {
        if (snapResult.snapX) {
            this.renderXLine(snapResult.snapX);
        }

        if (snapResult.snapY) {
            this.renderYLine(snapResult.snapY);
        }
    }

    public renderXLine(line: SnapLine) {
        const lineWidth = 1 / this.zoom;

        if (!line.positions) {
            // Use rounding at the propery side and a offset of 0.5 pixels to have clear lines.
            const x = getLinePosition(line, lineWidth);

            this.renderLine(x, MIN_VALUE, x, MAX_VALUE, getLineColor(line), lineWidth);
        } else if (line.diff) {
            const dx = line.diff.x;

            // The label dimensions needs to be calculated based on the zoom factor.
            // const labelOffset = 6 / this.zoom;
    
            for (const position of line.positions) {
                const x = Math.round(position.x);
                const y = Math.round(position.y);

                this.renderLine(x, y, x + dx, y, COLOR_PURPLE, lineWidth);
                // this.renderLabel(x + 0.5 * dx, y + labelOffset, line.diff.x.toString(), COLOR_PURPLE, 10, true, false, 2);
            }
        }
    }

    public renderYLine(line: SnapLine) {
        const lineWidth = 1 / this.zoom;
    
        if (!line.positions) {
            // Use rounding at the propery side and a offset of 0.5 pixels to have clear lines.
            const y = getLinePosition(line, lineWidth);

            this.renderLine(MIN_VALUE, y, MAX_VALUE, y, getLineColor(line), lineWidth);
        } else if (line.diff) {
            const dy = line.diff.y;

            // const labelOffset = 6 / this.zoom;
    
            for (const position of line.positions) {
                const x = Math.round(position.x);
                const y = Math.round(position.y);

                this.renderLine(x, y, x, y + dy, COLOR_PURPLE, lineWidth);
                // this.renderLabel(x + labelOffset, y + 0.5 * dy, line.diff.y.toString(), COLOR_PURPLE, 10, false, true, 2);
            }
        }
    }

    public showBox(transform: Transform, offsetX: number, offsetY: number, width: number, height: number) {
        const STROKE_COLOR = '#080';
        const STROKE_THICKNESS = 1;

        const left = transform.aabb.left + offsetX;
        const right = left + width;
        const top = transform.aabb.top + offsetY;
        const bottom = top + height;

        this.renderLine(left, top, left, bottom, STROKE_COLOR, STROKE_THICKNESS);
        this.renderLine(right, top, right, bottom, STROKE_COLOR, STROKE_THICKNESS);
        this.renderLine(left, top, right, top, STROKE_COLOR, STROKE_THICKNESS);
        this.renderLine(left, bottom, right, bottom, STROKE_COLOR, STROKE_THICKNESS);
    }

    public showGrid(transform: Transform, numCol: number, numRow: number) {
        const STROKE_COLOR = '#c4ffc4';
        const STROKE_THICKNESS = 1;

        for (let i = 1; i < numCol; i++) {
            const left = transform.aabb.left + transform.aabb.width / numCol * i;
            const top = transform.aabb.top;
            const bottom = top + transform.aabb.height;
            this.renderLine(left, top, left, bottom, STROKE_COLOR, STROKE_THICKNESS);
        }

        for (let i = 1; i < numRow; i++) {
            const top = transform.aabb.top + transform.aabb.height / numRow * i;
            const left = transform.aabb.left;
            const right = left + transform.aabb.width;
            this.renderLine(left, top, right, top, STROKE_COLOR, STROKE_THICKNESS);
        }
    }

    public showInfo() {
    // public showInfo(transform: Transform, text: string, offsetX: number, offsetY: number, top: boolean, left: boolean) {
        // const aabb = transform.aabb;
        // const horizontal = (left) ? aabb.left : aabb.right;
    //     const vertical = (top) ? aabb.top : aabb.bottom;

    //     this.renderLabel(horizontal + offsetX, vertical + offsetY, text, '#080');
    }

    private renderLine(x1: number, y1: number, x2: number, y2: number, color: string, width: number) {
        let line = this.lines[this.indexLines];

        // Reuse the rect and text if it alreadx exists to avoid creating unnecessary DOM elements.
        if (!line) {
            line = this.layer.line();
            this.lines.push(line);
        } else {
            line.show();
        }

        line.plot(x1, y1, x2, y2).stroke({ width, color });
        this.indexLines++;
    }

    // private renderLabel(x: number, y: number, text: string, color: string, fontSize = 12, centerX = false, centerY = false, padding = 4) {
    //     let labelGroup = this.labels[this.indexLabels];
    //     let labelRect: svg.Rect;
    //     let labelText: svg.ForeignObject;

    //     // Reuse the rect and text if it alreadx exists to avoid creating unnecessary DOM elements.
    //     if (!labelGroup) {
    //         labelGroup = this.layer.group();

    //         labelRect = new svg.Rect().addTo(labelGroup);
    //         labelText = SVGHelper.createText(text, fontSize, 'center', 'middle').attr('color', color).addTo(labelGroup);

    //         this.labels.push(labelGroup);
    //     } else {
    //         labelGroup.show();

    //         labelRect = labelGroup.children().at(0) as svg.Rect;
    //         labelText = labelGroup.children().at(1) as svg.ForeignObject;
    //     }

    //     let characterWidthKey = fontSize.toString();
    //     let characterWidthValue = this.textWidthCache[characterWidthKey];

    //     if (!characterWidthValue) {
    //         // We use a monospace, so we can calculate the text width ourself, which saves a lot of performance.
    //         characterWidthValue = SVGRenderer2.INSTANCE.getTextWidth('a', fontSize, 'monospace');

    //         this.textWidthCache[characterWidthKey] = characterWidthValue;
    //     }

    //     // The width is just calculated by the width of a single character (therefore monospace) and the total length.
    //     const w = characterWidthValue * text.length / this.zoom;

    //     // We assume a line height of 1.5 here.
    //     const h = fontSize / this.zoom;

    //     if (centerX) {
    //         x -= 0.5 * w;
    //     }

    //     if (centerY) {
    //         y -= 0.5 * h;
    //     }

    //     const labelContent = labelText.node.children[0] as HTMLDivElement;

    //     labelContent.style.fontSize = sizeInPx(fontSize / this.zoom);
    //     labelContent.style.fontFamily = 'monospace';
    //     labelContent.textContent = text;
    //     labelRect.fill('none');

    //     // The label dimensions needs to be calculated based on the zoom factor.
    //     padding /= this.zoom;

    //     SVGHelper.transformBy(labelGroup, {
    //         x: x - padding,
    //         y: y - padding,
    //     });

    //     SVGHelper.transformBy(labelText, {
    //         x: padding,
    //         y: padding,
    //         w: w,
    //         h: h,
    //     });

    //     SVGHelper.transformBy(labelRect, {
    //         w: w + 2 * padding,
    //         h: h + 2 * padding,
    //     });

    //     // Increment by one because we create one group per label.
    //     this.indexLabels += 1;
    // }

    public reset() {
        // this.indexLabels = 0;
        this.indexLines = 0;

        for (const line of this.lines) {
            line.hide();
        }

        for (const label of this.labels) {
            label.hide();
        }
    }
}

function getLineColor(line: SnapLine) {
    return line.isCenter ? COLOR_BLUE : COLOR_RED;
}

function getLinePosition(line: SnapLine, lineWidth: number) {
    const isLeftOrTop = line.side === 'Left' || line.side === 'Top';

    return Math.floor(line.value) + (isLeftOrTop ? -0.5 : 0.5) * lineWidth;
}