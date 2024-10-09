import { useEffect, useRef, useState } from 'react'

import olMap from 'ol/Map.js';
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

export default function Map(props) {
    let [draw, setDraw] = useState();
    let [vectorSource, setVectorSource] = useState([]);
    let mapRef = useRef({});
    const shapesTypes = {
        SQUARE: 'Circle', //Circle is the value to set for square in OpenLibrary
        POLYGON: 'Polygon'
    };

    async function loadMap() {
        if (!props.mapSource || !Object.entries(props.mapSource).length) {
            console.log('No Geo Tiff source');
           return
        }

        const tileLayer = new TileLayer({
            source: props.mapSource,
        });

        const mapObject = new olMap({
            target: 'map',
            layers: [
                tileLayer,
            ],
            view: props.mapSource.getView(),
        });

        mapRef.current = mapObject;
    }

    function loadShapes() {
        if (!props.shapes.length) {
            console.log('No Shape data to load');
            return
        };
        
        props.shapes.forEach((shape) => {
            const transformedCoords = shape.map(coord =>
                fromLonLat(coord)
            );
            
            const rectangleGeometry = new Polygon([transformedCoords]);
            
            const rectangleFeature = new Feature({
                geometry: rectangleGeometry,
            });
            
            const vectorSource = new VectorSource({
                features: [rectangleFeature],
            });
            
            

            const rectangleStyle = new Style({
                stroke: new Stroke({
                    color: 'blue',
                    width: 2,
                }),
                fill: new Fill({
                color: 'rgba(0, 0, 255, 0.1)',
                }),
            });
        
            rectangleFeature.setStyle(rectangleStyle);
        
            const vectorLayer = new VectorLayer({
                source: vectorSource,
            });

            
            mapRef.current.addLayer(vectorLayer);

            const modify = new Modify({source: vectorSource});

            mapRef.current.addInteraction(modify);

            setVectorSource(vectorSource);

            modify.on("modifyend", (event) => {
                const data = {
                    feature: event.features.array_[0]
                }
                saveShape(data);
            });
        });
    }

    function saveShape(event) {
        const feature = event.feature;  
        const geometry = feature.getGeometry();  
        
        const coordinates = geometry.getCoordinates();
        
        const geographicCoords = coordinates[0].map((coord) =>
            transform(coord, 'EPSG:3857', 'EPSG:4326')
        );
        
        let updatedShapeList = [...props.shapes, geographicCoords];

        props.onUpdate(updatedShapeList)
    }


    function addShape(type:string) {
        let geometryFunction = createRegularPolygon(4);

        let drawOptions= {
            source: vectorSource,
            type: type
        };

        switch (type) {
            case shapesTypes.SQUARE:
                drawOptions = {...drawOptions, geometryFunction: geometryFunction }
                break;
            default:
                break;
        }
        let drawData = new Draw(drawOptions);
        const snap = new Snap({source: vectorSource});

        setDraw(drawData);
        mapRef.current.addInteraction(snap);
        mapRef.current.addInteraction(drawData);  

        drawData.on("drawend", (e) => {
            saveShape(e);
            mapRef.current.removeInteraction(drawData);
        })
    }

    useEffect(() => {
        loadMap();
        loadShapes();
    }, [props.mapSource]);
    return (
        <>
            <div>
                <button onClick={() => addShape(shapesTypes.SQUARE)}>Add rectangle</button>
                <button onClick={() => addShape(shapesTypes.POLYGON)}>Add Polygon</button>
            </div>
            <div ref={mapRef} id="map" className='c-drawing-container' style={{ width: '100%', height: '700px' }}>

            </div>   
        </>
    )
}