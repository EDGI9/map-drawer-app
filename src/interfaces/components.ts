export interface ButtonInterface {
    text: string;
    onClick: () => void;
}

export interface MapInterface {
    mapSource: object;
    shapes: object[];
    onUpdate: (items: object[]) => void;
}