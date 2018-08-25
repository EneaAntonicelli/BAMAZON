const mysql = require("mysql");
const inquirer = require("inquirer");
require("console.table");

const connection = mysql.createConnection ({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon"
}); // END OF createConnection

connection.connect(function(err){
    console.log ("Connected as ID: " + connection.threadId);
    if (err) throw err; 
    customerStart();
}) // END OF CONNECT

function customerStart() {
    inquirer.prompt ([
        {
            name: "confirm",
            type: "confirm",
            message: "Would you like to view our inventory and place an order?"
        }
    ]).then(answers  =>{
        
        if (answers.confirm == true){
            showInventory();
        } else {
        console.log("Have a nice day then! ");
        connection.end();
        }
    });
} // END OF customerStart FUNCTION

function showInventory() {
    console.log('------------------------------------');
    console.log('\nSearching for database...\n');
    connection.query("SELECT * FROM products", function(err, data) {
        if (err) throw err;
        console.table(data);

        purchaseProduct();

    }); // END OF QUERY
} // END OF showInventory()

function purchaseProduct(){

    console.log('------------------------------------');
    inquirer.prompt([
		{
        type: 'input',
        name: 'item_id',
        message: 'Please enter the product ID for the item you would like to purchase.',
        validate: validateInput,
        filter: Number
        },
        {
        type: 'input',
        name: 'quantity',
        message: 'Please specify a quantity for your order',
        validate: validateInput,
        filter: Number
		}
	]).then(function(answer) {
        
        connection.query("SELECT * FROM products", function(err, data) {

            if (err) throw err;
            var theIndexedRow;
            for (var i=0; i<data.length; i++){
                if(data[i].item_id == answer.item_id) {
                    theIndexedRow = data[i];
                } // END OF IF
            } // END OF FOR
            
            var id = answer.item_id
            var quantity = answer.quantity
            var sales = theIndexedRow.price * quantity
            
            if (quantity <= theIndexedRow.stock_quantity) {

                console.log(
                    "Your order was placed successfully. Your total for " + 
                    "(" + 
                    quantity + 
                    ")" + 
                    " - " + 
                    theIndexedRow.product_name + 
                    " is: " + 
                    theIndexedRow.price.toFixed(2) * 
                    quantity
                ); // END OF LOG

                connection.query("UPDATE products SET ? WHERE ?", [{
                    stock_quantity: theIndexedRow.stock_quantity - quantity,
                    product_sales: theIndexedRow.product_sales + sales
                }, 
                {
                    item_id: id
                }], 
                function(err, data) {
                    if (err) throw err;
                    customerStart();
                });

            } else {
                console.log(
                    "Sorry, insufficient Quanity at this time. All we have is " + 
                    theIndexedRow.stock_quantity + 
                    " in our Inventory."
                );
                purchaseProduct();

            } // END OF ELSE
        }) // END OF QUERY
    }) // END OF THEN
} // END OF purchaseProduct()


function validateInput(value) {

	var integer = Number.isInteger(parseFloat(value));
	var sign = Math.sign(value);

	if (integer && (sign === 1)) {
		return true;
	} else {
		return 'Please enter a whole non-zero number.';
	}
} // END OF validateInput()