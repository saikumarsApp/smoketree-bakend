const express = require("express");
const {open} = require("sqlite");
const path = require("path");
const sqlite3 = require("sqlite3");
const cors = require("cors");

let db;
const app = express();
app.use(express.json());
app.use(cors());


const initializeDBAndServer = async () => {
	try{
		db = await open({
			filename: path.join(__dirname, "database.db"),
			driver: sqlite3.Database,
		});
		app.listen(3000, () => {
			console.log("server is running");
		})
	} catch(error){
		console.log(`Database error is ${error.message}`);
		process.exit(1);
	}
}

initializeDBAndServer();

//GET USER API 
app.get("/users/", async(request, response) => {
	const query = `
		SELECT * 
		FROM user;
	`
	const dbResponse = await db.all(query);
	response.send(dbResponse);

})

//GET ADDRESS API
app.get("/address/", async(request, response) => {
	const query = `
		SELECT * 
		FROM address
	`;
	const dbResponse = await db.all(query);
	response.send(dbResponse);
})

//POST User API
app.post("/users/", async(request, response) => {
	const userDetails = request.body;
	const {name} = userDetails;
	const query = `
	INSERT INTO user(name)
	VALUES(
		'${name}'
	)`;
	;

	const dbResponse = await db.run(query);
	const userId = dbResponse.lastID;
	response.send({userId: userId});
})

//POST ADDRESS API
app.post("/address/", async(request, response) => {
	const addressDetails = request.body;
	const {address} = addressDetails;
	const query =` 
		INSERT INTO address(address)
		VALUES (
			'${address}'
		)`	
	const dbResponse = await db.run(query);
	const addressId = dbResponse.lastID;
	response.send({addressId: addressId});
})

//end