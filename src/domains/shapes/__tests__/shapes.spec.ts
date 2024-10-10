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

        if (!result) {
            expect(result).toBe(null)
        } else {
            expect(result).toEqual(
                expect.arrayContaining(<ShapeDTO[]>[ expect.any(String)])
            )
        }

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