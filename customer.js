const mysql = require("mysql");
const inquirer = require("inquirer");

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
        this.data = data;
        for(var i = 0; i < data.length; i++) {
            console.log("\n" +
                        "ID: " +
                        data[i].item_id +
                        "\n" +
                        "PRODUCT: " +
                        data[i].product_name +
                        "\n" +
                        "DEPARTMENT: " +
                        data[i].department_name +
                        "\n" +
                        "PRICE: $" +
                        data[i].price +
                        "\n"       
        );
    }
});
}
