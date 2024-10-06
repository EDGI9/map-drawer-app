type FillColorStops = { 
    offset: number; 
    color: string;
    opacity: number;
} 

type ShapeShadow = {
    affectStroke:boolean;
    blur:number;
    color:string;
    nonScaling:boolean;
    offsetX:number;
    offsetY:number;
}

type ShapeFill = string | {
    colorStops: FillColorStops[];
    coords: {x1: number, y1: number, x2: number, y2: number};
    gradientTransform: number[];
    gradientUnits:string;
    offsetX:number;
    offsetY:number;
    type:string;
}

export interface ShapeDTO {
    angle: number;
    backgroundColor: string;
    fill: string | ShapeFill;
    fillRule: string;
    flipX:boolean;
    flipY:boolean;
    globalCompositeOperation:string;
    height:number;
    left:number;
    opacity:number;
    originX:string;
    originY:string;
    paintFirst:string;
    rx?:number;
    ry?:number;
    path?:(string|number)[][];
    scaleX:number;
    scaleY:number;
    shadow: ShapeShadow | null;
    skewX:number;
    skewY:number;
    stroke:string | null;
    strokeDashArray: string[] | null;
    strokeDashOffset:number;
    strokeLineCap:string;
    strokeLineJoin:string;
    strokeMiterLimit:number;
    strokeUniform:boolean;
    strokeWidth:number;
    top:number;
    type:string;
    version:string;
    visible:boolean;
    width:number;
}