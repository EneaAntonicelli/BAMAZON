DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE products(
	item_id INTEGER NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(100) NOT NULL,
    department_name VARCHAR(100) NOT NULL,
    price INTEGER DEFAULT 0,
    stock_quantity INTEGER DEFAULT 0,
    PRIMARY KEY (item_id)
);
ALTER TABLE products 
MODIFY price DECIMAL(10,2);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Dart Board", "Sports", 35.99, 21),
("Where The Wild Things Are - Hardcover", "Books", 19.99, 9),
("Roger Loves Jordan - Paperback", "Books", 7.45, 1),
("Collin and the Chipmunks (Children's Book) - Hardcover", "Books", 11.99, 15),
("The Return of Vadim - Hardcover", "Books", 8.99, 110),
("Jordan's Electric Monkey", "Toys & Games", 58.99, 12),
("Elaine's Tears", "Beauty & Personal Care", 109.95, 30),
("The ROGER PENDER 5000", "Tools & Home Improvement", 219.99, 15),
("Ron's 20 Cars He Keeps Talking About", "Automotive", 4999, 20),
("Josh's Fine Crafted Salumes", "Home and Kitchen", 14.99, 311)