import {describe, it, vi, expect} from 'vitest';

import { MapList } from '../__mocks__/maps'
import { MapDTO } from '../core/dtos/map.dto';
import MapService from '../index';

describe('Maps Service', () => {
    it('Get map by id', async () => {
        expect(MapService.getById).toBeDefined();
        expect(MapService.getById).toBeInstanceOf(Function);

        const spy = vi.spyOn(MapService, "getById");

        const result = await MapService.getById(MapList[0].id);

        expect(spy).toHaveBeenCalledOnce();
        
        expect(result).toBeTruthy();
        expect(result).toStrictEqual(
            expect.objectContaining(<MapDTO>{
                id: expect.any(String),
                src: expect.any(String),
            })
        )
    })

    it('Returns null if no id', async () => {
        expect(MapService.getById).toBeDefined();
        expect(MapService.getById).toBeInstanceOf(Function);

        const spy = vi.spyOn(MapService, "getById");
        //@ts-ignore
        const result = await MapService.getById();

        expect(spy).toHaveBeenCalledOnce();
        
        expect(result).toBe(null)
    })
})