import { ShapeEntity } from "../../core/entities/shape.entity";

export interface ShapesDrivenReaderPort {
    getById(id: string): Promise<ShapeEntity[] | null>
}