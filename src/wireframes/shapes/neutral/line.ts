/*
 * codeslide.net
 *
 * @license
 * Copyright (c) Sebastian Stehle. All rights reserved.
*/

import SVGPathCommander from 'svg-path-commander';
import { ConfigurableFactory, DefaultAppearance, RenderContext, ShapePlugin } from '@app/wireframes/interface';
import { CommonTheme } from './_theme';

type NodeType = 'None' | 'Arrow' | 'Triangle';
type EgdeType = 'Linear' | 'Quadratic' | 'Bounding Box';
type CurveType = 'Up' | 'Down';
type PivotType = 'Top Left' | 'Bottom Left';
type Position = 'x1' | 'x2' | 'y1' | 'y2';

const LINE_START = 'LINE_START';
const LINE_END = 'LINE_END';
const LINE_TYPE = 'LINE_TYPE';
const LINE_CURVE = 'LINE_CURVE';
const LINE_PIVOT = 'LINE_PIVOT';

const LINE_STYLE: { [index: string]: NodeType | EgdeType | CurveType | PivotType } = {
    None: 'None',
    Arrow: 'Arrow',
    Triangle: 'Triangle',
    Linear: 'Linear',
    Quadratic: 'Quadratic',
    BoundingBox: 'Bounding Box',
    Up: 'Up',
    Down: 'Down',
    TopLeft: 'Top Left',
    BottomLeft: 'Bottom Left',
};

const DEFAULT_APPEARANCE = {
    [DefaultAppearance.BACKGROUND_COLOR]: 0xEEEEEE,
    [DefaultAppearance.FONT_SIZE]: CommonTheme.CONTROL_FONT_SIZE,
    [DefaultAppearance.FOREGROUND_COLOR]: 0,
    [DefaultAppearance.STROKE_COLOR]: CommonTheme.CONTROL_BORDER_COLOR,
    [DefaultAppearance.STROKE_THICKNESS]: 2,
    [DefaultAppearance.TEXT_ALIGNMENT]: 'center',
    [DefaultAppearance.TEXT]: '',
    [LINE_START]: LINE_STYLE.None,
    [LINE_END]: LINE_STYLE.Arrow,
    [LINE_TYPE]: LINE_STYLE.Linear,
    [LINE_CURVE]: LINE_STYLE.Down,
    [LINE_PIVOT]: LINE_STYLE.TopLeft,
};

export class Line implements ShapePlugin {
    public identifier(): string {
        return 'Line';
    }

    public defaultAppearance() {
        return DEFAULT_APPEARANCE;
    }

    public defaultSize() {
        return { x: 200, y: 100 };
    }

    public configurables(factory: ConfigurableFactory) {
        return [
            factory.selection(LINE_START, 'Start', [
                LINE_STYLE.None,
                LINE_STYLE.Arrow,
                LINE_STYLE.Triangle,
            ]),
            factory.selection(LINE_END, 'End', [
                LINE_STYLE.None,
                LINE_STYLE.Arrow,
                LINE_STYLE.Triangle,
            ]),
            factory.selection(LINE_TYPE, 'Type', [
                LINE_STYLE.Linear,
                LINE_STYLE.Quadratic,
                LINE_STYLE.BoundingBox,
            ]),
            factory.selection(LINE_CURVE, 'Curve', [
                LINE_STYLE.Up,
                LINE_STYLE.Down,
            ]),
            factory.selection(LINE_PIVOT, 'Pivot', [
                LINE_STYLE.TopLeft,
                LINE_STYLE.BottomLeft,
            ]),
        ];
    }

    public render(ctx: RenderContext) {
        this.createShape(ctx);
        this.createText(ctx);
    }

    private createText(ctx: RenderContext) {
        ctx.renderer2.text(ctx.shape, ctx.rect.deflate(10, 10), p => {
            p.setForegroundColor(ctx.shape);
            p.setBackgroundColor(ctx.shape);
        });
    }

    private createShape(ctx: RenderContext) {
        const b = ctx.rect;

        const shapeRad = Math.atan2(b.height, b.width);
        const height = ctx.shape.strokeThickness * 6;
        const width = ctx.shape.strokeThickness * 4.5;

        const lineType = ctx.shape.getAppearance(LINE_TYPE);
        const isPivotTop = ctx.shape.getAppearance(LINE_PIVOT) == LINE_STYLE.TopLeft;

        if (lineType == LINE_STYLE.Quadratic) {
            // Quadratic line
            const ctlDir = ctx.shape.getAppearance('LINE_CURVE') == LINE_STYLE.Down ? 1 : -1;
            const ctlRad = shapeRad + ctlDir * Math.PI / 4;

            const pos: Record<Position, number> = {
                x1: b.left + height * Math.cos(ctlRad),
                x2: b.right - height * Math.cos(ctlRad - ctlDir * Math.PI / 2),
                y1: isPivotTop 
                    ? b.top + height * Math.sin(ctlRad)
                    : b.bottom - height * Math.sin(ctlRad - ctlDir * Math.PI / 2),
                y2: isPivotTop 
                    ? b.bottom - height * Math.sin(ctlRad - ctlDir * Math.PI / 2) 
                    : b.top + height * Math.sin(ctlRad),
            };

            // Control point, assuming isosceles triangle
            const ctlLen = Math.sqrt(((pos.x2 - pos.x1) ** 2 + (pos.y2 - pos.y1) ** 2) / 2);
            const ctlX = pos.x1 + ctlLen * Math.cos(ctlRad);
            const ctlY = pos.y1 + ctlLen * Math.sin(ctlRad);

            const path = `M${pos.x1} ${pos.y1} Q${ctlX} ${ctlY} ${pos.x2} ${pos.y2} Q${ctlX} ${ctlY} ${pos.x1} ${pos.y1} z`;
            this.createEdge(ctx, path);
            this.createNode(ctx, pos, ctlRad - ctlDir * Math.PI, ctlRad - ctlDir * Math.PI / 2, height, width, isPivotTop);

        } else if (lineType == LINE_STYLE.BoundingBox) {
            // Quadratic line with ctl point being the other corner
            const isCurveDown = ctx.shape.getAppearance('LINE_CURVE') == LINE_STYLE.Down;
            const ctlDir = isCurveDown ? 1 : -1;
            const ctlRad = shapeRad + ctlDir * Math.PI / 4;

            const pos: Record<Position, number> = {
                // xLeft
                x1: b.left + height * Math.cos(shapeRad),
                // xRight
                x2: b.right - height * Math.cos(shapeRad),
                // yTop
                y1: isPivotTop 
                    ? b.top + height * Math.sin(shapeRad)
                    : b.bottom - height * Math.sin(shapeRad),
                // yBottom
                y2: isPivotTop 
                    ? b.bottom - height * Math.sin(shapeRad) 
                    : b.top + height * Math.sin(shapeRad),
            };

            // Control point, assuming isosceles triangle
            const ctlX = isPivotTop ? isCurveDown ? b.left : b.right : isCurveDown ? b.right : b.left;
            const ctlY = isPivotTop ? isCurveDown ? b.bottom : b.top : isCurveDown ? b.bottom : b.top;

            const path = `M${pos.x1} ${pos.y1} Q${ctlX} ${ctlY} ${pos.x2} ${pos.y2} Q${ctlX} ${ctlY} ${pos.x1} ${pos.y1} z`;
            this.createEdge(ctx, path);
            // this.createNode(ctx, pos, shapeRad - Math.PI, shapeRad, height, width, isPivotTop);
            this.createNode(ctx, pos, ctlRad - ctlDir * Math.PI, ctlRad - ctlDir * Math.PI / 2, height, width, isPivotTop);
        } else if (lineType == LINE_STYLE.Linear) {
            // Linear line
            const pos: Record<Position, number> = {
                x1: b.left + height * Math.cos(shapeRad),
                x2: b.right - height * Math.cos(shapeRad),
                y1: isPivotTop 
                    ? b.top + height * Math.sin(shapeRad)
                    : b.bottom - height * Math.sin(shapeRad),
                y2: isPivotTop 
                    ? b.bottom - height * Math.sin(shapeRad) 
                    : b.top + height * Math.sin(shapeRad),
            };

            const path = `M${pos.x1} ${pos.y1} L${pos.x2} ${pos.y2} z`;
            this.createEdge(ctx, path);
            this.createNode(ctx, pos, shapeRad - Math.PI, shapeRad, height, width, isPivotTop);
        }
    }

    private createEdge(ctx: RenderContext, path: string) {
        ctx.renderer2.path(ctx.shape, path, p => {
            p.setStrokeColor(ctx.shape);
        });
    }

    private createNode(ctx: RenderContext, pos: Record<Position, number>, xRad: number, yRad: number, height: number, width: number, isPivotTop: boolean) {
        const startType = ctx.shape.getAppearance('LINE_START');
        const endType = ctx.shape.getAppearance('LINE_END');

        const rotatingDegree = (radian: number) => {
            const relativeRad = isPivotTop ? radian : -radian;
            return 90 + Math.round(relativeRad * 180 / Math.PI);
        };

        const shapeEdge = (x: number, y: number, rotating: number, type: NodeType) => {
            const SHAPES: Record<NodeType, string> = {
                'Triangle': `M${x} ${y} l-${width / 2} 0 l${width / 2}-${height} l${width / 2} ${height} z`,
                'Arrow': `M${x} ${y} c-${width / 4} 0-${width / 2} ${height / 4}-${width / 2} ${height / 4} l${width / 2}-${height} l${width / 2} ${height} c0 0-${width / 4}-${height / 4}-${width / 2}-${height / 4} z`,
                'None': `M${x} ${y} l0-${height} z`,
            };

            const transformedPath = new SVGPathCommander(SHAPES[type])
                .transform({ rotate: rotatingDegree(rotating),  origin: [x, y] })
                .toString();
    
            ctx.renderer2.path(ctx.shape, transformedPath, p => {
                p.setBackgroundColor(ctx.shape.strokeColor);
                p.setStrokeColor(ctx.shape.strokeColor);
            });
        };

        shapeEdge(pos.x1, pos.y1, xRad, startType);
        shapeEdge(pos.x2, pos.y2, yRad, endType);
    }
}
