import { useEffect, useState } from 'react'
import { fabric } from "fabric";
import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";
import MapService from "../domains/maps/index";
import { MapList } from "../domains/maps/__mocks__/maps";
import ShapesService from "../domains/shapes";
import { ShapeDTO } from '../domains/shapes/core/dtos/shape.dto';
import { MapDTO } from '../domains/maps/core/dtos/map.dto';


function MapPage() {
    let [map, setMap] = useState<MapDTO>();
    let [shapesList, setShapesList] = useState<ShapeDTO[]>([]);
    let history = [];
    const { editor, onReady } = useFabricJSEditor();


    const onAddRectangle = () => {
        if (!editor || !fabric) {
            return;
        }
        
        editor.addRectangle();
    };

    const undo = () => {
        if (!editor || !fabric) {
            return;
        }

        if (editor.canvas._objects.length > 0) {
            history.push(editor.canvas._objects.pop());
        }
        editor.canvas.renderAll();
    };

    const redo = () => {
        if (!editor || !fabric) {
            return;
        }

        if (history.length > 0) {
          editor.canvas.add(history.pop());
        }
    };

    const clear = () => {
        if (!editor || !fabric) {
            return;
        }
        editor.canvas._objects.splice(0, editor.canvas._objects.length);
        history.splice(0, history.length);
        editor.canvas.renderAll();
    };

    const deleteSelectedObject = () => {
        editor.canvas.remove(editor.canvas.getActiveObject());
    };

    async function update() {
        
        if (!map || !editor) {
            console.log('Invalid paramater for update');
            return  
        }
        await ShapesService.update(map.id, editor.canvas._objects)
    }

    function setCanvasProperties() {
        if (!editor || !fabric) {
            return;
        }
        editor.canvas.setHeight(900);
        editor.canvas.setWidth(900);
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
    }, [shapesList?.length]);

    useEffect(() => {
        loadMap();
    }, []);

    setCanvasProperties();

    
    return(
        <div>
            <h1>Map area</h1>
            <div>
                <button onClick={() => onAddRectangle()}>Add Rect</button>
                <button>Add Polygon</button>
                <button onClick={() => undo()}>Undo</button>
                <button onClick={() => redo()}>Redo</button>
                <button onClick={() => clear()}>Clear</button>
                <button onClick={() => deleteSelectedObject()}>Delete</button>

                <button onClick={() => update()}>Save</button>
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