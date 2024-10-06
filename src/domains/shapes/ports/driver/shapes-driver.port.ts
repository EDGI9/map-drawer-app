import { ShapeDTO } from "../../core/dtos/shape.dto";

export interface ShapesDriverPort {
    getById(id: string): Promise<ShapeDTO[] | null>
    update(id: string, dto:ShapeDTO[]): Promise<void>
}