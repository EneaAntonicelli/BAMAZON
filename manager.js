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
    start();
}) // END OF CONNECT

const managerPrompts = {
    selectionOptions: {
        type: "list",
        name: "managerSelection",
        message: "What would you like to do? ",
        choices: ["View Products", "View Low Inventory", "Update Current Inventory", "Add New Product to Inventory", "Exit"]
    },
    productId: {
        type: "input",
        name: "productId",
        message: "Please enter the product ID of the item you would like to update"
    },
    productName: {
        type: "input",
        name:"productName",
        message: "Please enter the product name of the item you would like to update"
    },
    departmentName: {
        type: "input",
        name:"departmentName",
        message: "Please enter the product's department name"
    },
    productPrice: {
        type: "input",
        name:"productPrice",
        message: "Please enter the price of the product"
    },
    productQuantity: {
        type: "input",
        name:"productQuantity",
        message: "Please enter the quantity of the product"
    },

} // END OF managerPrompts


function start() {
    console.log('------------------------------------');
    inquirer.prompt(managerPrompts.selectionOptions).then(answers=>{
        switch (answers.managerSelection) {
            case "View Products":
            showInventory();
            break;

            case "View Low Inventory":
            viewLowInventory();
            break;

            case "Update Current Inventory":
            updateInventory();
            break;

            case "Add New Product to Inventory":
            addNewProduct();
            break;

            case "Exit":
            exit();
            break;
        }
    });

};

function showInventory() {
    console.log('------------------------------------');
    console.log('\nSearching database...\n');
    connection.query("SELECT * FROM products", function(err, data) {
        if (err) throw err;
        console.table(data);
    start();
    }); // END OF QUERY
} // END OF showInventory()


function viewLowInventory() {
    console.log('------------------------------------');
    console.log('\nSearching for database...\n');
    connection.query("SELECT * FROM products HAVING stock_quantity <= 5 ORDER BY item_id", function(err, data) {
        if (err) throw err;
        console.table(data);
    start();
    }); // END OF QUERY
} // END OF showInventory()


function updateInventory() {
    console.log('------------------------------------');
    inquirer.prompt([managerPrompts.productId, managerPrompts.productQuantity]).then(answers=>{

        connection.query(
            "SELECT item_id, product_name, stock_quantity FROM products WHERE ?",
            {item_id: answers.productId}, function(err, data) { 
            if (data.length === 0) {
                console.log("\n404 Product ID not found.\n");
                
                updateInventory();

            } else if (data.length > 0) {
                var updateInventory = parseInt(answers.productQuantity) + data[0].stock_quantity;
                var id = answers.item_id;
                var productName = data[0].product_name;
                connection.query("UPDATE products SET ? WHERE ?", [{
                    stock_quantity: updateInventory
                }, 
                {
                    item_id: id
                }], 
                function(err, data) {
                    if (err) throw err;
                    console.log(
                        "Product " + 
                        productName + 
                        "'s stock has been successfully updated to: " +
                        updateInventory +
                        "."       
                    )
                    start();
                });
            } // END OF IF ELSE
        }); // END OF QUERY
    }); // END OF PROMPT
} // END OF showInventory()