const express = require("express");
const router = express.Router();
const operationController = require("../controllers/operationController");

// Routes CRUD pour les opérations
router.get("/getAllOperations", operationController.getAllOperations);
router.post("/createOperation", operationController.createOperation);
router.get("/getOperationById/:id", operationController.getOperationById);
router.put("/updateOperation/:id", operationController.updateOperation);
router.delete("/deleteOperation/:id", operationController.deleteOperation);

module.exports = router;
