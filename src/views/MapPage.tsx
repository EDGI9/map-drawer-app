import { useEffect, useRef, useState } from 'react'

import GeoTIFF from 'ol/source/GeoTIFF';
import Map from 'ol/Map.js';
import TileLayer from 'ol/layer/WebGLTile.js';
import Feature from 'ol/Feature';  
import { Draw, Snap, Modify} from 'ol/interaction';
import { createRegularPolygon } from 'ol/interaction/Draw.js';
import { Vector as VectorSource} from 'ol/source.js';
import { Vector as VectorLayer} from 'ol/layer.js';
import {Style, Stroke, Fill} from 'ol/style';
import { Polygon } from 'ol/geom'; 
import { fromLonLat, transform } from 'ol/proj'; 
import 'ol/ol.css';

import MapComponent from "../components/Map";
import MapService from "../domains/maps/index";
import ShapesService from "../domains/shapes";
import { MapList } from "../domains/maps/__mocks__/maps";
import { ShapeDTO } from '../domains/shapes/core/dtos/shape.dto';
import { MapDTO } from '../domains/maps/core/dtos/map.dto';

function MapPage() {
    let [shapes, setShapes] = useState<ShapeDTO[]>([]);
    let [map, setMap] = useState({});

    async function getShapes() {
        const shapesData = await ShapesService.getById(MapList[0].id);
        if (!shapesData) {
            console.log('No Shape data found');
            return
        };

        setShapes(shapesData);
    }

    async function getGeoTiff() {
        const mapData: MapDTO | null = await MapService.getById(MapList[0].id) ;
        if (!mapData) {
            console.log('No Map data');
            return
        }

        const source = new GeoTIFF({
            sources: [
                {
                    url: mapData.src,
                },
            ],
        });

        setMap(source)
    }

    function updateShapes(params:type) {
        ShapesService.update(MapList[0].id, params) 
    }

    useEffect(() => {
        getGeoTiff();
        getShapes();
    }, []);

    return(
        <div>
            <h1>Map area</h1>
            <MapComponent shapes={shapes} mapSource={map} onUpdate={updateShapes}/>
        </div>
    )
};

export default MapPage;