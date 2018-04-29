//cascarón para crear esquemas de mongoose
const mongoose = require('mongoose');
//ayuda en la validación, particularmente vamos a validar la unicidad del email
const uniqueValidator = require('mongoose-unique-validator');
let Schema = mongoose.Schema;
let objectId = Schema.Types.ObjectId;
//definimos el esquema de la categoria
let categoriaSchema = new Schema({
    nombre: {
        type: String,
        //unique: true,
        required: [true, 'El nombre es necesario']
    },
    usuario: {
        type: objectId,
        ref: 'Usuario',
        required: [true, "El usuario es necesario"]
    }
});

categoriaSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único!' })

module.exports = mongoose.model('Categoria', categoriaSchema);
//la Categoría exportada, tiene toda la configuración de categoriaSchema