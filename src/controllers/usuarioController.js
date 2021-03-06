const controllers = {}
const Sequelize = require("sequelize");
let sequelize = require('../models/database');
let usuario = require('../models/usuario');
let rolXUsuarioXPrograma = require('../models/rolXUsuarioXPrograma')
let programa = require('../models/programa')
let rol = require('../models/rol');
const alumno = require("../models/alumno");
const tutor = require("../models/tutor");
const fsPath =  require('fs-path');
const fs =  require('fs');
const path = require('path');

const Op = Sequelize.Op;

controllers.buscarPorCorreo = async (req, res) => {
    try{
        const user = await usuario.findOne({
            where: {CORREO: req.params.correo},
            include: [{
                model: rolXUsuarioXPrograma,
                where: {ESTADO: 1},
                include: [{
                    model:programa,
                    include: [{
                        model: programa,
                        as: 'FACULTAD',
                        attributes: ["NOMBRE"]
                    }]
                }, rol]
            }]
        })
        if(user){
            if (user.IMAGEN){
                let cadena = user.IMAGEN.split(".")
                user.IMAGEN = fs.readFileSync(user.IMAGEN, "base64")
            }
        }

        res.status(201).json({usuario:user, idRol:user.ROL_X_USUARIO_X_PROGRAMAs[0].ROL.ID_ROL,rol:user.ROL_X_USUARIO_X_PROGRAMAs[0].ROL.DESCRIPCION});
    }catch (error){
        res.json({error: error.message});    
    }
}

controllers.buscarPorCodigo = async (req, res) => {
    try{
        const user = await usuario.findOne({
            where: {CODIGO: req.params.codigo},
            include: [{
                model: rolXUsuarioXPrograma,
                include: [programa, rol]
           }]
        })
        res.status(201).json({usuario:user});
    }catch (error){
        res.json({error: error.message});    
    }
}

controllers.validarUsuarioUnico = async (req, res) => {
    try{
        const user = await usuario.findOne({
            where: {USUARIO: req.params.usuario}           
        })
        res.status(201).json({usuario:user});
    }catch (error){
        res.json({error: error.message});    
    }
}


controllers.listarRolesPorPrograma = async (req,res) => {
    try {
        const roles = await rolXUsuarioXPrograma.findAll({
            where: {
                ID_USUARIO: req.params.idUsuario,
                ID_PROGRAMA: req.params.idPrograma
            },
            include: [rol],
            attributes: []
        })
        res.status(201).json({roles: roles});
    }catch (error) {
        res.json({error: error.message})
    }
}


controllers.asignarRol = async (req,res) => {
    const transaccion = await sequelize.transaction();
    const {ID_USUARIO, ID_ROLES, ID_PROGRAMA} = req.body.asignacion;
    try {

        await rolXUsuarioXPrograma.destroy({
            where:{ID_USUARIO: ID_USUARIO, ID_PROGRAMA: ID_PROGRAMA},
            transaction: transaccion            
        })

        for (role of ID_ROLES){
            await rolXUsuarioXPrograma.create({
                ID_USUARIO: ID_USUARIO,
                ID_ROL: role,
                ID_PROGRAMA: ID_PROGRAMA,
                ESTADO: 1
            }, {transaction: transaccion})

            let descripcionRol = await rol.findOne({
                where:{ID_ROL: role}
            })
            if(descripcionRol.DESCRIPCION==="Alumno"){
                let alu = await alumno.findOne({
                    where: {ID_ALUMNO: ID_USUARIO}
                })
                if (!alu){
                    await alumno.create({
                        ID_ALUMNO: ID_USUARIO
                    }, {transaction: transaccion})
                }
            } else if(descripcionRol.DESCRIPCION==="Tutor"){
                let tut = await tutor.findOne({
                    where: {ID_TUTOR: ID_USUARIO}
                })
                console.log("tut: ", tut)
                if(!tut){
                    await tutor.create({
                        ID_TUTOR: ID_USUARIO
                    }, {transaction: transaccion})
                }
            }
        }        

        await transaccion.commit();
        res.status(201).json({nuevaAsignacion: req.body.asignacion});
    }catch (error) {
        await transaccion.rollback();
        res.json({error: error.message})
    }
}

controllers.guardarImagen = async (req,res) => {
    const transaccion = await sequelize.transaction();
    const {ID_USUARIO, IMAGEN} = req.body.imagen;
    try {
        let ruta = IMAGEN?path.join("..","Imagenes","Usuarios",ID_USUARIO.toString(),"perfil.jpeg"):null;
        if(IMAGEN){
            let data = new Buffer(IMAGEN, "base64");  
            fsPath.writeFile(ruta, data, function (err) {
                if (err) {
                    return console.log(err);
                }
            })            
        }
        const usuarioModificado = await usuario.update({
            IMAGEN: ruta
        }, {
            where: {ID_USUARIO: ID_USUARIO},
            transaction: transaccion
        })
        await transaccion.commit();
        res.status(201).json({estado: "registro exitoso"});
    }catch(error) {
        await transaccion.rollback();
        res.json({error: error.message})
    }
}

controllers.modificarPerfil = async (req,res) => {
    const transaccion = await sequelize.transaction();
    const {ID_USUARIO, TELEFONO, DIRECCION} = req.body.usuario;
    try {
       
        const usuarioModificado = await usuario.update({
            TELEFONO: TELEFONO,
            DIRECCION: DIRECCION
        }, {
            where: {ID_USUARIO: ID_USUARIO}
        }, {transaction: transaccion})

        await transaccion.commit();
        res.status(201).json({usuario: req.body.usuario});
    }catch (error) {
        await transaccion.rollback();
        res.json({error: error.message})
    }
}

controllers.login = async (req, res) => {
    const {USUARIO, CONTRASENHA} = req.body.usuario;
    try{
       const data = await usuario.findOne({ 
            where: {[Op.or]: {USUARIO: USUARIO, CORREO:USUARIO}},
            include:{
                model: rolXUsuarioXPrograma,
                where: {ESTADO: 1}
            }
        })
        .then(async result => { 
            let user = null
            if(result){
                if(await result.validPassword(CONTRASENHA)){
                    // console.log("correcto")
                    user = await usuario.findOne({
                        where: {[Op.or]: {USUARIO: USUARIO, CORREO:USUARIO}},
                        include: [{
                            model: rolXUsuarioXPrograma,
                            include: [{
                                model:programa,
                                include: [{
                                    model: programa,
                                    as: 'FACULTAD',
                                    attributes: ["NOMBRE"]
                                }]
                            }, rol],
                            where: {ESTADO: 1}
                        }]
                    })  
                    if(user){
                        if (user.IMAGEN){
                            let cadena = user.IMAGEN.split(".")
                            user.IMAGEN = fs.readFileSync(user.IMAGEN, "base64")
                        }
                    }              
                }
            }
            res.status(201).json({usuario:user, idRol:user.ROL_X_USUARIO_X_PROGRAMAs[0].ROL.ID_ROL,rol:user.ROL_X_USUARIO_X_PROGRAMAs[0].ROL.DESCRIPCION});
        })
    }catch (error){
        res.json({error: error.message});    
    }
}


module.exports = controllers;