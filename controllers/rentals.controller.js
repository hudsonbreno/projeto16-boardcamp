import { db } from "../database/database.connection.js";

export async function getRentals(req, res) {
  try {
    const rentals = await db.query(`SELECT * FROM rentals`);
    res.send(rentals.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function postRentals(req, res) {
  const { customerId , gameId, daysRented} = req.body

  try {
    const game = await db.query(`SELECT id, name,"stockTotal","pricePerDay" FROM games WHERE id=$1;`,[gameId])
    console.log()
    if(game.rowCount==0) return res.status(400).send("Game not exist")

    const gamePrice = game.rows[0].pricePerDay
    const originalPrice = gamePrice * daysRented

    const data = new Date()
    const year = data.getFullYear();
    let month = data.getMonth()+1;
    let day = data.getDate();
    
    if (month < 10) {month = '0' + month;}
    if (day < 10) {day = '0' + day;}

    const rentDate = `${year}-${month}-${day}`
    
    const validateCustomer = await db.query(`SELECT * FROM customers WHERE id=${customerId}`)
    if(!validateCustomer) return res.status(400).send("Usuario not exist")

    const delayFee = null;
    const returnDate = null;

    await db.query(`INSERT INTO rentals("customerId" , "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee")
       VALUES ($1,$2,$3,$4,$5,$6,$7)`,
       [customerId, gameId, rentDate, daysRented, returnDate, originalPrice, delayFee]);
    res.sendStatus(201);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function postFinalByIdRentals(req, res) {
  const { id } = req.params;

  // [
  //   {
  //     "id": 5,
  //     "customerId": 3,
  //     "gameId": 2,
  //     "rentDate": "2023-05-15T03:00:00.000Z",
  //     "daysRented": 3,
  //     "returnDate": null,
  //     "originalPrice": 4500,
  //     "delayFee": null
  //   }
  // ]

  try {
    const rentals = await db.query(`SELECT * FROM rentals WHERE id = $1;`, [id]);
    if(rentals.rowCount==0) return res.sendStatus(404)

    if(!rentals.rows[0].returnDate == null) return res.sendStatus(400);

    const rentDateString = JSON.stringify(rentals.rows[0].rentDate).substring(1,11)

    const data = new Date()
    const year = data.getFullYear();
    let month = data.getMonth()+1;
    let day = data.getDate();
    
    if (month < 10) {month = '0' + month;}
    if (day < 10) {day = '0' + day;}

    const returnDateString = `${year}-${month}-${day}`

    const rentDate = new Date(rentDateString);
    const returnDate = new Date(returnDateString);

    const diffTime = returnDate.getTime() - rentDate.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 *60 * 24))
    
    const delayFee = diffDays * (rentals.rows[0].originalPrice/rentals.rows[0].daysRented)

    
     await db.query(`UPDATE rentals SET "returnDate"=$1, "delayFee"=$2 WHERE id=$3`,[rentDateString, delayFee, id]);


    res.sendStatus(200);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function deleteRental(req, res) {
  const { id } = req.params;
  try {
    const exist = await db.query(`SELECT * FROM rentals WHERE id=${id}`)
    if(exist.rowCount === 0) return res.sendStatus(404)

    if(exist.rows[0].returnDate === null) return res.status(400).send("Return Date is null")

    await db.query(`DELETE FROM rentals WHERE id = ${id}`);
    res.sendStatus(200);
  } catch (err) {
    res.status(500).send(err.message);
  }
}
