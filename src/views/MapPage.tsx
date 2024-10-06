import { useEffect, useRef, useState } from 'react'
import { fabric } from "fabric";
import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";
import MapService from "../domains/maps/index";
import { MapList } from "../domains/maps/__mocks__/maps";
import ShapesService from "../domains/shapes";
import { ShapeDTO } from '../domains/shapes/core/dtos/shape.dto';
import { MapDTO } from '../domains/maps/core/dtos/map.dto';


function MapPage() {
    let [map, setMap] = useState<MapDTO>();
    let [shapesList, setShapesList] = useState<ShapeDTO[]>();
    const { editor, onReady } = useFabricJSEditor();


    const onAddRectangle = () => {
        if (!editor || !fabric) {
            return;
        }
        
        editor.addRectangle();
    };

    function setCanvasProperties() {
        if (!editor || !fabric) {
            return;
        }
        editor.canvas.setHeight(1000);
        editor.canvas.setWidth(1000);
        editor.canvas.renderAll();
    }

    async function loadMap() {
        const resultMap = await MapService.getById(MapList[0].id);
        
        if (!resultMap) {
            console.log('Map not found');
            return  
        }
        setMap(resultMap)
    }

    async function loadShapes() {
        if (!map) {
            console.log('No Map data');
            return  
        }
        const resultsShapes = await ShapesService.getById(map.id)

        if (!resultsShapes) {
            console.log('Shapes not found');
            return  
        }

        setShapesList(resultsShapes)
    }


    useEffect(() => {
        loadShapes(); 
    }, [map]);

    useEffect(() => {
        if (!shapesList) {
            return   
        }

        if (!editor || !fabric) {
            return;
        }
        shapesList.forEach((shape) => {
            if (shape.type == "rect") {
                const rect = new fabric.Rect(shape);
            
                editor.canvas.add(rect)
            }

            if (shape.type == "path") {
                const path = new fabric.Path(shape.path);
                path.set(shape)
            
                 editor.canvas.add(path)
            }
        })
    }, [shapesList]);

    useEffect(() => {
        setCanvasProperties();
        loadMap();
    }, []);

    
    return(
        <div>
            <h1>Map area</h1>
            <div>
                <button onClick={() => onAddRectangle()}>Add Rect</button>
                <button>Add Polygon</button>
            </div>
            <div className='c-drawing-container'>
                <FabricJSCanvas className="c-canvas" onReady={onReady} />
                {map ? (
                    <img src={map.src} height={400} width={400} className='c-image'/>
                    ) : (
                    <p>Loading...</p>
                    )
                }
            </div>
        </div>
    )
};

export default MapPage;