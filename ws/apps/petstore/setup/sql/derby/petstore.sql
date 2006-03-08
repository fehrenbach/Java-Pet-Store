

create table category(
    categoryid VARCHAR(10) NOT NULL,
    name VARCHAR(25) NOT NULL,
    description VARCHAR(255) NOT NULL,
    imageurl VARCHAR(55),
    primary key (categoryid)
);

CREATE TABLE product (
 productid VARCHAR(10) NOT NULL,
 categoryid VARCHAR(10) NOT NULL,
 name VARCHAR(25) NOT NULL,
 description VARCHAR(255) NOT NULL,
 imageurl VARCHAR(55),
 primary key (productid),
 foreign key (categoryid) references category(categoryid)
);

CREATE TABLE item (
 itemid VARCHAR(10) NOT NULL,
 productid VARCHAR(10) NOT NULL,
 name VARCHAR(25) NOT NULL,
 description VARCHAR(255) NOT NULL,
 imageurl VARCHAR(55),
 listprice FLOAT NOT NULL,
 unitcost FLOAT NOT NULL,
 primary key (itemid),
 foreign key (productid) references product(productid)
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


INSERT INTO category VALUES('CATS', 'Cats', 'Loving and furry friends', 'cats_icon.gif');
INSERT INTO category VALUES('DOGS', 'Dogs', 'Loving and furry friends', 'dogs_icon.gif');
INSERT INTO category VALUES('BIRDS', 'Birds', 'Loving and furry friends', 'birds_icon.gif');
INSERT INTO category VALUES('REPTILES', 'Reptiles', 'Loving and scaly friends', 'reptiles_icon.gif');
INSERT INTO category VALUES('FISH', 'Fish', 'Loving aquatic friends', 'fish_icon.gif');

INSERT INTO product VALUES('feline01', 'CATS', 'Long Hair', 'Great for reducing mouse populations', 'cat1.gif');
INSERT INTO product VALUES('feline02', 'CATS', 'Short Hair', 'Friendly house cat', 'cat2.gif');
INSERT INTO product VALUES('canine01', 'DOGS', 'Medium Dogs', 'Friendly dog from England', 'dog1.gif');
INSERT INTO product VALUES('canine02', 'DOGS', 'Small Dogs', 'Great Companion Dog','dog2.gif');

INSERT INTO item VALUES('1', 'feline01', 'Lazy cat', 'A great pet', 'cat1.gif', 307, 290);
INSERT INTO item VALUES('2', 'feline01', 'Old Cat', 'A great old pet', 'cat2.gif', 207, 200);
INSERT INTO item VALUES('3', 'feline01', 'Young Cat', 'A great young pet', 'cat3.gif', 407, 350);
INSERT INTO item VALUES('4', 'feline01', 'Scrapper Cat', 'A scapper cat', 'cat4.gif', 417, 370);
INSERT INTO item VALUES('5', 'feline01', 'Alley Cat', 'A great pet', 'cat5.gif', 307, 290);
INSERT INTO item VALUES('6', 'feline02', 'Playful Cat', 'A needy pet', 'cat7.gif', 190, 150);
INSERT INTO item VALUES('7', 'feline02', 'Long Haired Cat', 'A high maintenance cat', 'cat8.gif', 199, 175);
INSERT INTO item VALUES('8', 'feline02', 'Smelly Cat', 'A great pet', 'cat9.gif', 303, 200);
INSERT INTO item VALUES('9', 'feline02', 'Wild Cat', 'A great wild pet', 'cat10.gif', 527, 240);
INSERT INTO item VALUES('10', 'feline02', 'Saber Cat', 'A great watch pet', 'cat11.gif', 237, 200);
INSERT INTO item VALUES('11', 'feline02',' Scrapper Cat', 'A scapper cat', 'cat12.gif', 337, 190);

INSERT INTO item VALUES('12', 'canine01', 'Lazy Dog', 'A great pet', 'dog1.gif', 257, 201);
INSERT INTO item VALUES('13', 'canine01', 'Old Dog', 'A great old pet', 'dog2.gif', 70, 50);
INSERT INTO item VALUES('14', 'canine01', 'Young Dog', 'A great young pet', 'dog3.gif', 301, 210);
INSERT INTO item VALUES('15', 'canine02', 'Scrapper Dog', 'A scapper dog', 'dog4.gif', 410, 210);
INSERT INTO item VALUES('16', 'canine02', 'Grey Hound', 'A great runner', 'dog5.gif', 200, 210);
