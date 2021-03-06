const Sequelize = require('sequelize');
let sequelize = require("./database");
const institucion = require('./institucion');

let nametable = 'PROGRAMA';

let programa = sequelize.define(
    nametable,
    {
        ID_PROGRAMA: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        ID_FACULTAD: Sequelize.INTEGER,
        ID_INSTITUCION: {
            type: Sequelize.INTEGER,
            primaryKey: true
        },
        NOMBRE: Sequelize.STRING,
        IMAGEN: Sequelize.BLOB,
        ANTICIPACION_DISPONIBILIDAD: {
            type: Sequelize.INTEGER,
            defaultValue: 0 
        },
        ANTICIPACION_CANCELAR_CITA: {
            type: Sequelize.INTEGER,
            defaultValue: 0 
        },
        ESTADO: {
            type: Sequelize.TINYINT,
            defaultValue: 1 
        } 
    },
    {
        timestamps: false,
        freezeTableName: true
    }
);

// programa.belongsTo(institucion, {foreignKey:{name:"ID_INSTITUCION"}});
// programa.belongsTo(programa, {as: 'FACULTAD', foreignKey:'ID_FACULTAD'})
module.exports = programa;