import { db } from "../database/database.connection.js"

export async function getClients(req, res) {
    try {
      const customers = await db.query(`SELECT * FROM customers`);
      res.send(customers.rows);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  export async function getClientById(req, res) {
    const { id } = req.params;
    try {
      const customers = await db.query(`SELECT * FROM customers WHERE id=$1`, [id]);
      res.send(customers.rows);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  export async function postClient(req, res) {
    const { name, phone, cpf, birthday } = req.body;
    try {
      await db.query(`
      INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1,$2,$3,$4)`,
      [name, phone, cpf, birthday]
      );
      res.sendStatus(201)
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  export async function updateClient(req, res) {
    const { id } = req.params;
    const { name, phone, cpf, birthday } = req.body
    try {
      const customers = await db.query(`
      UPDATE customers SET name=$1, phone=$2, cpf=$3, birthday=$4 WHERE id=${id}`, [name, phone, cpf, birthday]);
      res.send(customers.rows);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }