
create table category (
    categoryid VARCHAR(8) NOT NULL,
    name varchar(25) not null,
    description varchar(255) not null,
    imageurl VARCHAR(55),
    primary key (categoryid)
);

CREATE TABLE products (
 productid VARCHAR(8) NOT NULL,
 categoryid VARCHAR(8) NOT NULL,
 name VARCHAR(24),
 description VARCHAR(255),
 imageurl VARCHAR(55),
 price FLOAT,
 primary key (productid),
 foreign key (categoryid) references category(categoryid)
);

CREATE TABLE customer (
 customerid VARCHAR(8) NOT NULL,
 lastname VARCHAR(24) NOT NULL,
 firstname VARCHAR(24) NOT NULL,
 address1 VARCHAR(55) NOT NULL,
 address2 VARCHAR(55) NOT NULL,
 city VARCHAR(55) NOT NULL,
 state VARCHAR(25) NOT NULL,
 zip VARCHAR(25) NOT NULL,
 primary key (customerid)
);

CREATE TABLE orders (
 orderid VARCHAR(8) NOT NULL,
 customerid VARCHAR(8) NOT NULL,
 primary key (orderid),
 foreign key (customerid) references customer(customerid)
);

CREATE TABLE lineitem (
 lineitemid VARCHAR(8) NOT NULL,
 orderid VARCHAR(8) NOT NULL,
 primary key (lineitemid),
 foreign key (orderid) references orders(orderid)
);


INSERT INTO category VALUES('cats', 'Cats', 'Loving and furry friends', 'cats_icon.gif');
INSERT INTO category VALUES('dogs', 'Dogs', 'Loving and furry friends', 'dogs_icon.gif');
INSERT INTO category VALUES('birds', 'Birds', 'Loving and furry friends', 'birds_icon.gif');
INSERT INTO category VALUES('reptiles', 'Reptiles', 'Loving and scaly friends', 'reptiles_icon.gif');
INSERT INTO category VALUES('fish', 'Fish', 'Loving aquatic friends', 'fish_icon.gif');

INSERT INTO products VALUES('cat001', 'cats', 'Lazy cat', 'A great pet', 'cat1.gif', 30.70);
INSERT INTO products VALUES('cat002', 'cats', 'Old Cat', 'A great old pet', 'cat2.gif', 20.70);
INSERT INTO products VALUES('cat003', 'cats', 'Young Cat', 'A great young pet', 'cat3.gif', 40.70);
INSERT INTO products VALUES('cat004', 'cats', 'Scrapper Cat', 'A scapper cat', 'cat4.gif', 41.70);
INSERT INTO products VALUES('cat005', 'cats', 'Alley Cat', 'A great pet', 'cat5.gif', 30.70);
INSERT INTO products VALUES('cat006', 'cats', 'Old Cat', 'A great old pet', 'cat6.gif', 20.70);
INSERT INTO products VALUES('cat007', 'cats', 'Playful Cat', 'A needy pet', 'cat7.gif', 40.70);
INSERT INTO products VALUES('cat008', 'cats', 'Long Haired Cat', 'A high maintenance cat', 'cat8.gif', 41.70);
INSERT INTO products VALUES('cat009', 'cats', 'Smelly Cat', 'A great pet', 'cat9.gif', 30.70);
INSERT INTO products VALUES('cat010', 'cats', 'Wild Cat', 'A great wild pet', 'cat10.gif', 52.70);
INSERT INTO products VALUES('cat011', 'cats', 'Saber Cat', 'A great watch pet', 'cat11.gif', 23.70);
INSERT INTO products VALUES('cat012', 'cats',' Scrapper Cat', 'A scapper cat', 'cat12.gif', 33.70);

INSERT INTO products VALUES('dog001', 'dogs', 'Lazy Dog', 'A great pet', 'dog1.gif', 25.70);
INSERT INTO products VALUES('dog002', 'dogs', 'Old Dog', 'A great old pet', 'dog2.gif', 70.70);
INSERT INTO products VALUES('dog003', 'dogs', 'Young Dog', 'A great young pet', 'dog3.gif', 30.70);
INSERT INTO products VALUES('dog004', 'dogs', 'Scrapper Dog', 'A scapper cat', 'dog4.gif', 51.70);
INSERT INTO products VALUES('dog005', 'dogs', 'Grey Hound', 'A great runner', 'dog5.gif', 30.10);
