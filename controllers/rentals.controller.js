import { db } from "../database/database.connection.js";

export async function getRentals(req, res) {
  try {
    const rentals = await db.query(`SELECT rentals.*, 
    JSON_BUILD_OBJECT('customer', customers.*) AS customers ,
    JSON_BUILD_OBJECT('games',games.*) AS games
    FROM rentals
    INNER JOIN customers ON rentals."customerId" = customers.id
	  INNER JOIN games ON rentals."gameId" = games.id
    `);
    res.send(rentals.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function postRentals(req, res) {
  const { customerId , gameId, daysRented} = req.body

  try {
    const game = await db.query(`SELECT id, name,"stockTotal","pricePerDay" FROM games WHERE id=$1;`,[gameId])
    if(game.rows[0].stockTotal == 0) return res.status(400).send("stockTotal is 0")
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

    if(rentals.rows[0].returnDate) return res.sendStatus(400);

    const rentDateString = JSON.stringify(rentals.rows[0].rentDate).substring(1,11)

    const data = new Date()
    const year = data.getFullYear();
    let month = data.getMonth()+1;
    let day = data.getDate();
    

    if (month < 10) {month = '0' + month;}
    if (day < 10) {day = '0' + day;}

    const returnDateString = `${year}-${month}-${day}`
    console.log(returnDateString)

    const rentDate = new Date(rentDateString);
    const returnDate = new Date(returnDateString);

    const daysPayString = rentDate.getTime() + rentals.rows[0].daysRented*(1000 * 60 *60 * 24)
    const daysPay = new Date(daysPayString);

    const diffTime = daysPay.getTime() - returnDate.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 *60 * 24))
    
    const delayFee = diffDays * (rentals.rows[0].originalPrice/rentals.rows[0].daysRented)

    const daysRented = rentals.rows[0].daysRented-1

    
    await db.query(`UPDATE rentals SET "returnDate"=$1, "delayFee"=$2,"daysRented"=$3 WHERE id=$4`,[rentDateString, delayFee,daysRented, id]);


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


