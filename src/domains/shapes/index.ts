import ShapeReaderAdapter from "./adapters/shapes-reader.adapter";
import ShapeWriterAdapter from "./adapters/shapes-writer.adapter";
import ShapesService from "./services/shapes.service";

export default ShapesService(ShapeReaderAdapter(), ShapeWriterAdapter());
