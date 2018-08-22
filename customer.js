const mysql = require("mysql");
const inquirer = require("inquirer");
require("console.table");

const connection = mysql.createConnection ({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon"
});

connection.connect(function(err){
    console.log ("Connected as ID: " + connection.threadId);
    // if (err) throw err; TODO This error is not working.
    start();
})

function start() {
    inquirer.prompt ([
        {
            name: "confirm",
            type: "confirm",
            message: "Would you like to view our inventory and place an order?"
        }
    ])
    .then(answers  =>{
        showInventory();
    });
} // END OF START FUNCTION

function showInventory() {
    console.log('------------------------------------');
    console.log('\nSearching for database...\n');
    connection.query("SELECT * FROM products", function(err, data) {
        // if (err) throw err; TODO This error is not working.
        console.table(data);
        /*
        //this.data = data;
        for(var i = 0; i < data.length; i++) {
            // console.log("\n" +
            //             "ID: " +
            //             data[i].item_id +
            //             "\n" +
            //             "PRODUCT: " +
            //             data[i].product_name +
            //             "\n" +
            //             "DEPARTMENT: " +
            //             data[i].department_name +
            //             "\n" +
            //             "PRICE: $" +
            //             data[i].price +
            //             "\n"       
            // );
            
        }
        */
        purchaseProduct();
    });
}

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

            var theRow;

            for(var i=0; i<data.length; i++){
                if(data[i].item_id == answer.item_id) {
                    theRow = data[i];
                }
            }
            

            var data = data[0];
            var id = answer.item_id
            var quantity = answer.quantity
            
            if (quantity <= theRow.stock_quantity) {

                console.log("Your total for " + 
                            "(" + 
                            quantity + 
                            ")" + 
                            " - " + 
                            theRow.product_name + 
                            " is: " + 
                            data.price.toFixed(2) * 
                            quantity);

                connection.query("UPDATE products SET ? WHERE ?", [{
                    stock_quantity: data.stock_quantity - quantity
                }, 
                {
                    item_id: id
                }], 
                function(err, data) {
                    if (err) throw err;
                    purchaseProduct();
                });

            } else {
                console.log("Sorry, insufficient Quanity at this time. All we have is " + 
                            data.stock_quantity + 
                            " in our Inventory.");

                purchaseProduct();
            }
        })
    })
}


function validateInput(value) {

	var integer = Number.isInteger(parseFloat(value));
	var sign = Math.sign(value);

	if (integer && (sign === 1)) {
		return true;
	} else {
		return 'Please enter a whole non-zero number.';
	}
}