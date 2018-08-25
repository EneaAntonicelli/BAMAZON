const mysql = require("mysql");
const inquirer = require("inquirer");
require("console.table");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon"
});

connection.connect(function (err) {
  if (err) throw err;
  supervisorStart();
});

const supervisorPrompts = {
    selectionOptions: {
        type: "list",
        name: "supervisorSelection",
        message: "What would you like to do? ",
        choices:[   
            
            "View Product Sales by Department", 
            "Create New Department", 
            "Exit"
        ]
    },
}

function supervisorStart() {
    console.log('------------------------------------');
    inquirer.prompt(supervisorPrompts.selectionOptions).then(answers=>{
        switch (answers.supervisorSelection) {

            case "View Product Sales by Department":
            viewSales();
            break;

            case "Create New Department":
            createDepartment();
            break;

            case "Exit":
            exit();
            break;

            default:
            console.log("Error, starting over...");
            supervisorStart();
            break;
        }
    });

};

function viewSales() {
  let query = 
  `
    SELECT  departments.department_id, 
            departments.department_name, 
            departments.over_head_costs,

    SUM(products.product_sales) AS product_sales, 
    (product_sales - departments.over_head_costs) AS total_profit

    FROM products
    INNER JOIN departments ON products.department_name = departments.department_name
    GROUP BY products.department_name;
  `
  connection.query(query, function(err, data){
    if (err) throw err;
    console.table(data);
    supervisorStart();
  })
}

function createDepartment() {
  inquirer.prompt([
    {
      name: "department_name",
      type: "input",
      message: "What is the new department's name?"
    }, {
      name: "over_head_costs",
      type: "input",
      message: "What are its overhead costs?"
    }
  ])
  .then(function(answers){
    connection.query( "INSERT INTO departments SET ?", answers, function(err, data){
      if (err) throw err;
      console.log("Department created successfully!");
      connection.query("SELECT * FROM departments WHERE department_id = " + data.department_id, function(err, data){
        console.table(data);
        supervisorStart();
      });
    })
    // connection.query(
    //     "INSERT INTO products SET ?", {
    //     product_name: '',
    //     department_name: answers.department_name, 
    //     price: 0, 
    //     stock_quantity: 0
    //     }, 
    //     function(err) {
    //         if (err) throw err;    
    //     });
  });
}

function exit() {
    console.log("Goobye! Hope to see you again soon!");
    connection.end();
}