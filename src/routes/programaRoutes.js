const express = require('express');
const morgan = require('morgan');
const router = express.Router();

router.use(express.json());
const programaController = require('../controllers/programaController');

router.get("/", (req, res)=>{
    res.end(`express running on the server ${app.get("port")}`);
})

router.get("/api/programa", programaController.listar);

router.get("/api/programa&facultad", programaController.listarProgramasYFacultades);

router.get("/api/programa/lista/:idCoordinador/:idFacultad", programaController.listarProgramasDeUnCoordinador);

router.get("/api/facultad/coordinador/:idCoordinador", programaController.listarFacultadesDeUnCoordinador);

router.get("/api/facultad/tutor/:idTutor", programaController.listarFacultadesDeUnTutor);

router.get("/api/facultad", programaController.listarFacultad);

router.get("/api/facultad/:id", programaController.getFacultad);

router.get("/api/programa/lista/:id", programaController.listarPorFacultad);

router.get("/api/programa&facultad/coordinador/:id", programaController.listarProgramasYFacultadesPorCoordinador);

router.get("/api/programa/coordinador/:id", programaController.listarProgramasPorCoordinadorConFormato);

router.get("/api/facultad/lista/:idCoordinador", programaController.listarFacultadesDeUnCoordinadorPrograma);

router.post("/api/facultad", programaController.registrarFacultad);

router.post("/api/programa", programaController.registrarPrograma);

router.post("/api/programa/modificar", programaController.modificarPrograma);

router.post("/api/facultad/modificar", programaController.modificarFacultad);

router.get("/api/programa/tutor/:idTutor", programaController.listarProgramasDeUnTutor);

router.get("/api/programa/alumno/:idAlumno", programaController.listarProgramasDeUnAlumno);

router.get("/api/facultad/politicas/:idFacultad", programaController.listarPoliticasPorFacultad);

router.get("/api/programa/lista/tutor/:idTutor/:idFacultad", programaController.listarProgramasDeUnTutorSegunFacultad);

router.post("/api/facultad/eliminar/:id", programaController.eliminarFacultad);

router.post("/api/programa/eliminar/:id", programaController.eliminarPrograma);

router.get("/api/facultad/alumno/:idAlumno", programaController.listarFacultadesDeUnAlumno);

router.get("/api/programas/alumno/:idAlumno/:idFacultad", programaController.listarProgramasDeUnAlumnoSegunFacultad);

module.exports = router;