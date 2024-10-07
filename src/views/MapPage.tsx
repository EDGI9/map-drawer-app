import { useEffect, useRef, useState } from 'react'

import GeoTIFF from 'ol/source/GeoTIFF';
import Map from 'ol/Map.js';
import TileLayer from 'ol/layer/WebGLTile.js';
import Draw, { createRegularPolygon } from 'ol/interaction/Draw.js';
import { Vector as VectorSource} from 'ol/source.js';
import { Vector as VectorLayer} from 'ol/layer.js';
import 'ol/ol.css';

import MapService from "../domains/maps/index";
import { MapList } from "../domains/maps/__mocks__/maps";
import ShapesService from "../domains/shapes";
import { ShapeDTO } from '../domains/shapes/core/dtos/shape.dto';
import { MapDTO } from '../domains/maps/core/dtos/map.dto';


function MapPage() {
    let [geoTiffSource, setGeoTiffSource] = useState();
    let [draw, setDraw] = useState();
    let mapRef = useRef({});
    const shapes = {
        SQUARE: 'Circle', //Circle is the value to set for square in OpenLibrary
        POLYGON: 'Polygon'
    };

    const vectorSource = new VectorSource({wrapX: false});

    const vector = new VectorLayer({
        source: vectorSource,
    });
    

    async function loadGeoTiff() {
        const mapData = await MapService.getById(MapList[0].id);
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

        setGeoTiffSource(source)
    }

    function loadMap() {
        if (!geoTiffSource) {
            console.log('No Geo Tiff source');
           return
        }
        

        const tileLayer = new TileLayer({
            source: geoTiffSource,
        });

        const mapObject = new Map({
            target: 'map-area',
            layers: [
                tileLayer,
                vector
            ],
            view: geoTiffSource.getView(),
        });

        mapRef.current = mapObject;
    }

   
    function addSquare() {
        mapRef.current.removeInteraction(draw);
        let geometryFunction = createRegularPolygon(4);
        let drawData = new Draw({
            source: vectorSource,
            type: shapes.SQUARE,
            geometryFunction: geometryFunction
        });
        setDraw(drawData)
        mapRef.current.addInteraction(drawData);
    }

    function addPolygon() {
        mapRef.current.removeInteraction(draw);
        let drawData = new Draw({
            source: vectorSource,
            type: shapes.POLYGON
        });
        setDraw(drawData)
        mapRef.current.addInteraction(drawData);
    }

    useEffect(() => {
        loadGeoTiff();
    }, []);

    useEffect(() => {
        loadMap();
    }, [geoTiffSource]);

    return(
        <div>
            <h1>Map area</h1>
            <div>
                <button onClick={() => addSquare()}>Add rectangle</button>
                <button onClick={() => addPolygon()}>Add Polygon</button>
            </div>
            <div ref={mapRef} id="map-area" className='c-drawing-container' style={{ width: '100%', height: '400px' }}>

            </div>
        </div>
    )
};

export default MapPage;