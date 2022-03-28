import cryptoController from '../controllers/cryptoController.js';
import express from "express";
const router = express.Router({ mergeParams: true });

router.get("/transactions/:sort", (req, res) => {
  console.log('getting transactions');
  return cryptoController.getTransaction(req, res);
});

router.post("/transaction", (req, res) => {
  console.log('create transaction');
  return cryptoController.createTransaction(req, res);
});

router.get("/", (req, res) => {
  return cryptoController.findAll(req, res);
});

function updateDB() {
  console.log('updating db');
  //return cryptoController.getLatestRates()
}

export default router;

export function startPolling(t) {
  updateDB();
  setInterval(updateDB, t);
}