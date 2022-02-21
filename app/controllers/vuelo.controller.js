const db = require("../models");
const Vuelo = db.vuelos;
const Op = db.Sequelize.Op;
const axios = require('axios');

// Cargar vuelos
exports.cargar = async (req, res) => {
  // Validate request
  if (!req.body.title) {
    res.status(400).send({
      message: "No puede estar vacio el cuerpo!"
    });
    return;
  }
  // Array de registros para consultar
  const tiposVuelos = [
    { tipo: 'L', aeropuerto: '1' },
    { tipo: 'L', aeropuerto: '2' },
    { tipo: 'L', aeropuerto: '3' },
    { tipo: 'S', aeropuerto: '1' },
    { tipo: 'S', aeropuerto: '2' },
    { tipo: 'S', aeropuerto: '3' }
  ];
  let totalActualizados = 0;
  let totalInsertados = 0;

  for (const tipoVuelo of tiposVuelos) {
    // consulta servicio de sabsa
    const resultado = await axios.post('http://www.sabsa.aero/itinerario/quick', {
      idTipoVuelo: tipoVuelo.tipo,
      idAeropuerto: tipoVuelo.aeropuerto
    });

    if (resultado?.data?.vuelos) {
      for (const vuelo of resultado.data.vuelos) {
        // consultamos si existe el registro
        const vueloExiste = await Vuelo.findAll({ where: { nroVuelo: parseInt(vuelo.NRO_VUELO[0]) } });
        // Create a Vuelo
        const datosVuelo = {
          idItinerario: parseInt(vuelo.ID_ITINERARIO[0]) || null,
          fechaHora: vuelo.FECHA_HORA[0],
          fecha: vuelo.FECHA[0],
          idEmpresa: vuelo.ID_EMPRESA[0],
          tipoOperacion: vuelo.TIPO_OPERACION[0],
          nroVuelo: parseInt(vuelo.NRO_VUELO[0]) || null,
          horaEstimada: vuelo.HORA_ESTIMADA[0],
          horaReal: vuelo.HORA_REAL[0],
          nroPuerta: parseInt(vuelo.NRO_PUERTA[0]) || null,
          observacion: typeof vuelo.OBSERVACION[0] === 'object' ? JSON.stringify(vuelo.OBSERVACION[0]) : vuelo.OBSERVACION[0],
          nombreAerolinea: vuelo.NOMBRE_AEROLINEA[0],
          ruta: vuelo.RUTA[0],
          aeropuerto: vuelo.AEROPUERTO[0],
        };
        // console.log('::::::::::::::::::::::: datosVuelo:', datosVuelo);

        // Insertamos o actualizamos
        if (vueloExiste[0]?.dataValues.id) {
          try {
            await Vuelo.update(datosVuelo, {
              where: { id: vueloExiste[0]?.dataValues.id }
            })
          } catch (error) {
            return res.status(400).send({
              message: "No se pudo actualizar el vuelo"
            });
          }
          totalActualizados ++;
        } else {
          // Save Vuelo in the database
          try {
            await Vuelo.create(datosVuelo);
          } catch (error) {
            return res.status(400).send({
              message: "No se pudo registrar el vuelo"
            });
          }
          totalInsertados ++;
        }
      }
    }
  };
  return res.status(200).send({
    registrosInsertados: `Se ha registrado ${totalInsertados} vuel(os)`,
    registrosActualizados: `Se ha registrado ${totalActualizados} vuel(os)`
  });
};

// Create and Save a new Vuelo
exports.create = (req, res) => {
    // Validate request
    if (!req.body.title) {
      res.status(400).send({
        message: "No puede estar vacio el cuerpo!"
      });
      return;
    }
    // Create a Vuelo
    const vuelo = {
      title: req.body.title,
      description: req.body.description,
      published: req.body.published ? req.body.published : false
    };
    // Save Vuelo in the database
    Vuelo.create(vuelo)
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Existio un error al crear el Vuelo."
        });
      });
  };
// Retrieve all Vuelos from the database.
exports.findAll = (req, res) => {
    const title = req.query.title;
    var condition = title ? { title: { [Op.iLike]: `%${title}%` } } : null;
    Vuelo.findAll({ where: condition })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Ocurrio un error al devolver vuelos."
        });
      });
  };
// Find a single Vuelo with an id
exports.findOne = (req, res) => {
    const id = req.params.id;
    Vuelo.findByPk(id)
      .then(data => {
        if (data) {
          res.send(data);
        } else {
          res.status(404).send({
            message: `No pudo encontrar el vuelo con id=${id}.`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error al devolver el vuelo con id=" + id
        });
      });
  };
// Update a Vuelo by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;
    Vuelo.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "El vuelo fue actualizado correctamente."
          });
        } else {
          res.send({
            message: `No pudo actualizar vuelo con id=${id}. Quizas el vuelo no fue encontrado o los parametros de consulta estabn vacios!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error actualizando vuelo con id=" + id
        });
      });
  };
// Delete a Vuelo with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
    Vuelo.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Vuelo eliminado correctamente!"
          });
        } else {
          res.send({
            message: `No puedo ser eliminado vuelo con id=${id}. Quiza el vuelo no fue encontrado!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "No pudo eliminar vuelo con id=" + id
        });
      });
  };
// Delete all Vuelos from the database.
exports.deleteAll = (req, res) => {
    Vuelo.destroy({
      where: {},
      truncate: false
    })
      .then(nums => {
        res.send({ message: `${nums} Vuelos fueron borrados exitosamentes!` });
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Algun error ocurrio al eliminar los vuelos."
        });
      });
  };
// Find all published Vuelos
exports.findAllPublished = (req, res) => {
    Vuelo.findAll({ where: { published: true } })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Algun error ocurrio al devolver vuelos."
        });
      });
  };