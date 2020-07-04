const controllers = {}

let sequelize = require('../models/database');
let areaApoyo = require('../models/areaApoyo');

controllers.listar = async (req, res) => { 
    try{
        const areasApoyo = await areaApoyo.findAll();
        res.status(201).json({areasApoyo:areasApoyo});         
    }    
    catch (error) {
        res.json({error: error.message});    
    }
};


/**
 * @returns La nueva tutoria creado en formato Json()
 * HTTP status code 201 significa que se creo exitosamente
 */
controllers.registrar = async (req, res) => {  
    const transaccion = await sequelize.transaction();
    const {NOMBRE, TELEFONO, CORREO} = req.body.areaApoyo; 
    try {
        const nuevaAreaApoyo = await areaApoyo.create({
            NOMBRE: NOMBRE,
            TELEFONO: TELEFONO,
            CORREO: CORREO
        }, {transaction: transaccion})

        await transaccion.commit();
        res.status(201).json({areaApoyo: nuevaAreaApoyo}); 
    }catch (error) {
        await transaccion.rollback();
        res.json({error: error.message})
    }
    
};


controllers.modificar = async (req, res) => {  
    
    const transaccion = await sequelize.transaction();
    const {ID_AREA_APOYO, NOMBRE, TELEFONO, CORREO} = req.body.areaApoyo;
    try {
        const etiquetaModificada = await areaApoyo.update({
            NOMBRE: NOMBRE,
            TELEFONO: TELEFONO,
            CORREO: CORREO
        }, {
            where: {ID_AREA_APOYO: ID_AREA_APOYO},
            transaction: transaccion
        })

        await transaccion.commit();
        res.status(201).json({areaApoyo: req.body.areaApoyo});
    }catch (error) {
        await transaccion.rollback();
        res.json({error: error.message})
    }
    
};

module.exports = controllers;