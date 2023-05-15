import { db } from "../database/database.connection.js";

export async function getRentals(req, res) {
  const { id } = req.params;
  try {
    const rentals = await db.query(`SELECT * FROM rentals`);
    res.send(rentals.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function postRentals(req, res) {
  const { id } = req.params;
  const { customerId , gameId, rentDate, daysRented, returnDate, originalPrice, delayFee} = req.body
  try {
    await db.query(`SELECT * FROM rentals WHERE id = $1;`,
    [customerId, gameId, rentDate, daysRented, returnDate, originalPrice, delayFee]);
    res.send(receita.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function postFinalByIdRentals(req, res) {
  const { id } = req.params;
  try {
    const receita = await db.query(`SELECT * FROM games WHERE id = $1;`, [id]);
    res.send(receita.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function deleteRental(req, res) {
  const { id } = req.params;
  try {
    const exist = await db.query(`SELECT * FROM rentals WHERE id=${id}`)
    if(exist.rowCount === 0) return res.sendStatus(404)

    await db.query(`DELETE FROM rentals WHERE id = ${id}`);
    res.sendStatus(200);
  } catch (err) {
    res.status(500).send(err.message);
  }
}
