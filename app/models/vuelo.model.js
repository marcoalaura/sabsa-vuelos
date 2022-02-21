module.exports = (sequelize, Sequelize) => {
    const Vuelo = sequelize.define("vuelo", {
      idItinerario: {
        type: Sequelize.INTEGER,
        field: 'id_itinerario'
      },
      fechaHora: {
        type: Sequelize.DATE,
        field: 'fecha_hora'
      },
      fecha: {
        type: Sequelize.DATEONLY
      },
      idEmpresa: {
        type: Sequelize.STRING(20),
        field: 'id_empresa'
      },
      tipoOperacion: {
        type: Sequelize.STRING(1),
        field: 'tipo_operacion'
      },
      nroVuelo: {
        type: Sequelize.INTEGER,
        field: 'nro_vuelo'
      },
      horaEstimada: {
        type: Sequelize.STRING(10),
        field: 'hora_estimada'
      },
      horaReal: {
        type: Sequelize.STRING(10),
        field: 'hora_real'
      },
      nroPuerta: {
        type: Sequelize.INTEGER,
        field: 'nro_puerta'
      },
      observacion: {
        type: Sequelize.STRING(50)
      },
      nombreAerolinea: {
        type: Sequelize.STRING(50),
        field: 'nombre_aerolinea'
      },
      ruta: {
        type: Sequelize.STRING(50)
      },
      aeropuerto: {
        type: Sequelize.STRING(50)
      },
    });
    return Vuelo;
  };