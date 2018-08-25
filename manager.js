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
    managerStart();
}) // END OF CONNECT

const managerPrompts = {
    selectionOptions: {
        type: "list",
        name: "managerSelection",
        message: "What would you like to do? ",
        choices:[   "View Products", 
                    "View Low Inventory", 
                    "Update Current Inventory Stock", 
                    "Add New Product to Inventory",
                    "Delete Product", 
                    "Exit"
                ]
    },
    productId: {
        type: "input",
        name: "productId",
        message: "Please enter the product ID of the item you would like to update: ",
        validate: validateNumber
    },
    productDelete: {
        type: "input",
        name: "productDelete",
        message: "Please enter the product ID of the item you would like to delete: ",
        validate: validateNumber
    },
    productName: {
        type: "input",
        name:"productName",
        message: "Please enter the product name of the item you would like to update: ",
        validate: validateName
    },
    departmentName: {
        type: "input",
        name:"departmentName",
        message: "Please enter the product's department name: ",
        validate: validateName
    },
    productPrice: {
        type: "input",
        name:"productPrice",
        message: "Please enter the price of the product: ",
        validate: validateNumber
    },
    productQuantity: {
        type: "input",
        name:"productQuantity",
        message: "Please enter the quantity you would like to stock: ",
        validate: validateNumber
    },

} // END OF managerPrompts

function validateName(name){
    return name !== '';
}
function validateNumber(value){
    if(isNaN(value) === false && value !=='') {
        return true;
    }
    return false;
}

function managerStart() {
    console.log('------------------------------------');
    inquirer.prompt(managerPrompts.selectionOptions).then(answers=>{
        switch (answers.managerSelection) {
            case "View Products":
            showInventory();
            break;

            case "View Low Inventory":
            viewLowInventory();
            break;

            case "Update Current Inventory Stock":
            updateInventory();
            break;

            case "Add New Product to Inventory":
            addNewProduct();
            break;

            case "Delete Product":
            deleteProduct();
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
    managerStart();
    }); // END OF QUERY
} // END OF showInventory()


function viewLowInventory() {
    console.log('------------------------------------');
    console.log('\nSearching for database...\n');
    connection.query("SELECT * FROM products HAVING stock_quantity <= 5 ORDER BY item_id", function(err, data) {
        if (err) throw err;
        console.table(data);
    managerStart();
    }); // END OF QUERY
} // END OF showInventory()


function updateInventory() {
    console.log('------------------------------------');
    inquirer.prompt([
        managerPrompts.productId, 
        managerPrompts.productQuantity
    ]).then(answers=>{

        connection.query(
            "SELECT item_id, product_name, stock_quantity FROM products WHERE ?",
            {item_id: answers.productId}, function(err, data) { 
            if (err) throw err;
            if (data.length === 0) {
                console.log("\n404 Product ID not found.\n");
                
                updateInventory();

            } else if (data.length > 0) {
                var updateInventory = parseInt(answers.productQuantity) + data[0].stock_quantity;
                var id = answers.productId;
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
                        "Product: " + 
                        productName + 
                        "'s stock has been successfully updated to: " +
                        updateInventory +
                        "."       
                    )
                    managerStart();
                });
            } // END OF IF ELSE
        }); // END OF QUERY
    }); // END OF PROMPT
} // END OF showInventory()

function addNewProduct() {
    console.log('------------------------------------');
    console.log('------------------------------------');
    inquirer.prompt([
        managerPrompts.productName, 
        managerPrompts.departmentName,
        managerPrompts.productPrice, 
        managerPrompts.productQuantity
    ]).then(answers=>{

    connection.query(
        "INSERT INTO products SET ?", {
        product_name: answers.productName,
        department_name: answers.departmentName, 
        price: answers.productPrice, 
        stock_quantity: answers.productQuantity 
        }, 
        function(err) {
            if (err) throw err;
            console.log("Success!");    
    managerStart();
        });
    }); // END OF QUERY
} // END OF showInventory()

function exit() {
    console.log("Goobye! Hope to see you again soon!");
    connection.end();
}

function deleteProduct() {
    inquirer.prompt(
        managerPrompts.productDelete
    ).then((answers) => {
        connection.query(
            'SELECT * FROM products WHERE ?', 
            { item_id: answers.productDelete }, 
            (err, data) => {

            inquirer.prompt({
                name: 'confirm',
                type: 'confirm',
                message:    
                    `You would like to delete ` + 
                    data[0].product_name + 
                    ` from the database, Is this correct?`

            }).then((answers) => {
                if (answers.confirm) {
                    itemToDelete = {
                        item_id: data[0].item_id
                    };
                    connection.query('DELETE FROM products WHERE ?', { item_id: itemToDelete.item_id }, (err, data) => {
                        if (err) throw err;
                        console.log('\nItem successfully removed!\n');
                        managerStart();
                    });
                } else {
                    deleteProduct();
                }
            
            });
        });
    });
}