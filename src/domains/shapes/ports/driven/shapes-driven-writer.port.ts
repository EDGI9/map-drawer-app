
import { ShapeDTO } from "../../core/dtos/shape.dto";

export interface ShapesDrivenWriterPort {
    update(id: string, entity: ShapeDTO[]): Promise<void>
}