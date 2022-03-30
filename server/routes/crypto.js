import cryptoController from '../controllers/cryptoController.js';
import express from "express";
const router = express.Router({ mergeParams: true });

// get table data
router.get("/transactions/:sort", (req, res) => {
  return cryptoController.getTransaction(req, res);
});
// create new transaction
router.post("/transaction", (req, res) => {
  return cryptoController.createTransaction(req, res);
});

// get the latest rates for the conversion functionality
router.get("/latest_rates", (req, res) => {
  return cryptoController.findLatestRates(req, res);
});

function updateDB() {
  console.log('updating db');
  return cryptoController.getLatestRates()
}

export default router;

export function startPolling(t) {
  updateDB();
  setInterval(updateDB, t);
}