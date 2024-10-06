import { ShapeDTO } from "../core/dtos/shape.dto";
import { ShapeEntity } from "../core/entities/shape.entity";
import { ShapesDrivenReaderPort } from "../ports/driven/shapes-driven-reader.port";
import { ShapesDrivenWriterPort } from "../ports/driven/shapes-driven-writer.port";
import { ShapesDriverPort } from "../ports/driver/shapes-driver.port";

export default function ShapesService(reader:ShapesDrivenReaderPort, writer: ShapesDrivenWriterPort): ShapesDriverPort {

   async function getById(id:string): Promise<ShapeEntity[] | null> {
        const entities = await reader.getById(id);
        console.log("entities", entities);
        

        if (!entities) {
            return null
        }

        return <ShapeDTO[]>entities;
   } 

   async function update(id:string, dto: ShapeDTO[]): Promise<void> {
    if (Object.values(dto).length == 0 && !id) {
        console.log("Invalid parameters", id, dto);
        return
    }

    await writer.update(id, dto)
   } 


   return {
    getById,
    update
   }
}