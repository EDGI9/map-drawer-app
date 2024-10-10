import { useEffect, useRef, useState } from 'react'

import olMap from 'ol/Map.js';
import TileLayer from 'ol/layer/WebGLTile.js';
import { Draw, Snap, Modify, Select} from 'ol/interaction';
import { createRegularPolygon } from 'ol/interaction/Draw.js';
import { Vector as VectorSource} from 'ol/source.js';
import { Vector as VectorLayer} from 'ol/layer.js';
import {Style, Stroke, Fill} from 'ol/style';
import 'ol/ol.css';

export default function Map(props) {
    let [vectorSource, setVectorSource] = useState();
    let [selectedShape, setSelectedShape] = useState(null);
    let [shapes, setShapes] = useState([]);
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
        loadShapes();
    }

    function loadShapes() {
        const shapeFeatures = props.shapes.map((item) => {
            const rectangleStyle = new Style({
                stroke: new Stroke({
                    color: 'blue',
                    width: 2,
                }),
                fill: new Fill({
                color: 'rgba(0, 0, 255, 0.1)',
                }),
            });
        
            item.setStyle(rectangleStyle)
            return item
        });

        setShapes(shapeFeatures)
        
        const innerVectorSource = new VectorSource({
            features: shapeFeatures,
        });
        
        const vectorLayer = new VectorLayer({
            source: innerVectorSource,
        });

        setVectorSource(innerVectorSource);
        mapRef.current.addLayer(vectorLayer);
    }

    function saveShape(feature) {
        const filteredShapeList = shapes.filter(item => item.ol_uid !== feature.ol_uid);
        setShapes(filteredShapeList)
        
        filteredShapeList.push(feature);
        props.onUpdate(filteredShapeList)
    }


    function addShape(type:string) {
        console.log(mapRef.current, vectorSource);
        if (!mapRef.current) {
            return  
        }

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

        mapRef.current.addInteraction(drawData);  
        mapRef.current.addInteraction(snap);

        drawData.on("drawend", (event) => {
            console.log(event.feature);
            
            saveShape(event.feature);
            mapRef.current.removeInteraction(drawData);
        })
    }

    function addModifiers() {
        const modify = new Modify({source: vectorSource});
        const select = new Select();
        
        mapRef.current.addInteraction(modify);
        mapRef.current.addInteraction(select);

        modify.on("modifyend", async (event) => {
            const feature = await event.features.getArray()[0];
            saveShape(feature);
        });

        select.on('select', (event) => {
            const features = event.selected;
            if (features.length > 0) {
                setSelectedShape(features[0])
            } else {
                setSelectedShape(null)
            }
        });
    }

    function removeShape() {
        if (selectedShape) {
            vectorSource.removeFeature(selectedShape);
            setSelectedShape(null)
        }
    }

    useEffect(() => {
        loadMap();
    }, [props.mapSource]);

    useEffect(() => {
        if (!vectorSource) {
            return
        }
        addModifiers();
    }, [vectorSource]);

    return (
        <>
            <div>
                <button onClick={() => addShape(shapesTypes.SQUARE)}>Add rectangle</button>
                <button onClick={() => addShape(shapesTypes.POLYGON)}>Add Polygon</button>
                <button onClick={() => removeShape()}>Delete selected shape</button>
            </div>
            <div ref={mapRef} id="map" className='c-drawing-container' style={{ width: '100%', height: '700px' }}></div>   
        </>
    )
}