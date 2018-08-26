# BAMAZON - README
---
### Last Update: 8/25/2018
---

# CUSTOMER

### The customer module lets users view a current inventory of products, select a product to purchase, enter the quantity they wish to purchase, and then complete the purchase.

### The current inventory (stored in a SQL database) is then updated and can be viewed immediately with a new view call.

### The purchase function also aggregates the total product sales for a department and passes this value to department level stats. These stats can only be viewed with supervisory level clearance.

#### To run this module in the terminal:

```node customer.js```

![GitHub Logo](./CustomerGif.gif)

# MANAGER

### The manager module lets users view products, view low inventory, update the current inventory's stock quantity, add a new product to the inventory, and delete a product.

#### To run this module in the terminal:

```node manager.js```

![GitHub Logo](./ManagerGif.gif)

# SUPERVISOR

### The supervisor module lets users view the totals sales by department. It also lets you create entirely new departments.

#### To run this module in the terminal:

```node supervisor.js```

![GitHub Logo](./SupervisorGif.gif)

## Technologies used

```Node.js
Inquire NPM Package (https://www.npmjs.com/package/inquirer)
MYSQL NPM Package (https://www.npmjs.com/package/mysql)
```

### Prerequisites

- Node.js - Download the latest version of Node https://nodejs.org/en/
- Create a MYSQL database called 'Bamazon', reference schema.sql

### Built With

* Sublime Text - Text Editor
* MySQLWorkbench
* Terminal/Gitbash

### Author

Enea Antonicelli - JS/MySQL/Node.js - Enea Antonicelli