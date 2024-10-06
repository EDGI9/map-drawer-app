import { describe, it, expect, vi } from 'vitest';

import { MapList }  from "../../maps/__mocks__/maps";
import { ShapeList }  from "../__mocks__/shapes";
import { ShapeDTO } from '../core/dtos/shape.dto';
import ShapesService from '../index';

describe('Shapes service', () => {
    it('Can get shapes data', async () => {
        expect(ShapesService.getById).toBeDefined();
        expect(ShapesService.getById).toBeInstanceOf(Function);

        const mapId = MapList[0].id;
        const spy = vi.spyOn(ShapesService, "getById");

        const result = await ShapesService.getById(mapId);

        expect(spy).toHaveBeenCalledOnce();

        expect(result).toEqual(
            expect.arrayContaining(<ShapeDTO[]>[
                expect.objectContaining(<ShapeDTO>{
                    angle: expect.any(Number),
                    backgroundColor: expect.any(String),
                    fill: expect.any(String) || expect.objectContaining({
                        colorStops:expect.arrayContaining([
                            expect.objectContaining({
                                offset: expect.any(Number),
                                color: expect.any(String),
                                opacity: expect.any(Number),
                            })
                        ]),
                        coords:expect.objectContaining({
                            x1: expect.any(Number),
                            y1: expect.any(Number),
                            x2: expect.any(Number),
                            y2: expect.any(Number)
                        }),
                        gradientTransform:expect.arrayContaining([expect.any(Number)]),
                        gradientUnits:expect.any(String),
                        offsetX:expect.any(Number),
                        offsetY:expect.any(Number),
                    }),
                    fillRule: expect.any(String),
                    flipX:expect.any(Boolean),
                    flipY:expect.any(Boolean),
                    globalCompositeOperation:expect.any(String),
                    height:expect.any(Number),
                    left:expect.any(Number),
                    opacity:expect.any(Number),
                    originX:expect.any(String),
                    originY:expect.any(String),
                    paintFirst:expect.any(String),
                    rx: expect.any(Number) || expect.anything(), 
                    ry: expect.any(Number) || expect.anything(),
                    /* path: expect.arrayContaining([
                            expect.arrayContaining([
                                expect.any(String), 
                                expect.any(Number)
                            ])]) || expect.anything(), */ //Issue with interface
                    scaleX:expect.any(Number),
                    scaleY:expect.any(Number),
                    /* shadow: expect.objectContaining({
                        affectStroke:expect.any(Boolean),
                        blur:expect.any(Number),
                        color:expect.any(String),
                        nonScaling:expect.any(Boolean),
                        offsetX:expect.any(Number),
                        offsetY:expect.any(Number),
                    }) || expect(null),  */ //Issue with interface
                    skewX:expect.any(Number),
                    skewY:expect.any(Number),
                    stroke: expect.any(String) || expect(null),
                    // strokeDashArray: expect.anything(), //Issue with interface
                    strokeDashOffset:expect.any(Number),
                    strokeLineCap:expect.any(String),
                    strokeLineJoin:expect.any(String),
                    strokeMiterLimit:expect.any(Number),
                    strokeUniform:expect.any(Boolean),
                    strokeWidth:expect.any(Number),
                    top:expect.any(Number),
                    type:expect.any(String),
                    version:expect.any(String),
                    visible:expect.any(Boolean),
                    width:expect.any(Number), 
                }
                )
            ])
        )

    });
    it('Can send shapes data', async () => {
        expect(ShapesService.update).toBeDefined();
        expect(ShapesService.update).toBeInstanceOf(Function);

        const mapId = MapList[0].id;
        const spy = vi.spyOn(ShapesService, "update");

        await ShapesService.update(mapId, ShapeList);
        
        expect(spy).toHaveBeenCalledOnce();
        expect(spy).toHaveBeenCalledWith(mapId, ShapeList);
    });
})