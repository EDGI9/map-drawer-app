import { describe, it, expect, afterAll, vi, beforeEach } from "vitest";
import { render, cleanup, RenderResult } from '@testing-library/react';
import GeoJSON from 'ol/format/GeoJSON';
import GeoTIFF from 'ol/source/GeoTIFF';

import MapComponent from "../Map.js";

import { MapList } from "../../domains/maps/__mocks__/maps.js"
import { ShapeList } from "../../domains/shapes/__mocks__/shapes.js"
import { TransformedShapeDTO } from "../../domains/shapes/core/dtos/shape.dto.js";
import { MapInterface } from "../../interfaces/components.js";

describe('Map component', () => {
    let map = new GeoTIFF({sources: [{url: MapList[0].src}]});
    let shapes: TransformedShapeDTO = ShapeList.map(item => new GeoJSON().readFeature(item));
    let component: RenderResult;
    let mapElement: HTMLElement;
    const props: MapInterface = {
        mapSource: map,
        shapes: shapes,
        onUpdate: vi.fn()
    }

    beforeEach(()=> {
        component = render(<MapComponent {...props} />);
    });

    afterAll(() => {
        cleanup();
    });

    it('Renders Component', () => {
        mapElement = component.getByTestId('qa-map_container');
        expect(mapElement).toBeTruthy();
    });

    it.skip('Component receives correct props', () => {
        //
    });
    it.skip('Component emits update with shape data', () => {
       //
    });
    
});