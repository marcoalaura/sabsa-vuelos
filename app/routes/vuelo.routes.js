module.exports = app => {
    const vuelos = require("../controllers/vuelo.controller.js");
    var router = require("express").Router();
    // Crea un nuevo Vuelo
    // router.post("/", vuelos.create);
    router.post("/", vuelos.cargar);
    // Retorna todos los vuelos
    // router.get("/", vuelos.findAll);
    router.get("/", vuelos.cargar);
    // Retorna todos los vuelos publicados
    router.get("/published", vuelos.findAllPublished);
    // Retorna a Vuelo segun id
    router.get("/:id", vuelos.findOne);
    // Actualiza un Vuelo segun id
    router.put("/:id", vuelos.update);
    // Elimina un Vuelo segun id
    router.delete("/:id", vuelos.delete);
    // Elimina todos los Vuelos
    router.delete("/", vuelos.deleteAll);
    app.use('/api/vuelos', router);
  };