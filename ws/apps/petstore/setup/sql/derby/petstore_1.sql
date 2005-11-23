
create table category_1 (
    categoryid VARCHAR(10) NOT NULL,
    name VARCHAR(25) NOT NULL,
    description VARCHAR(255) NOT NULL,
    imageurl VARCHAR(55),
    primary key (categoryid)
);

CREATE TABLE product_1 (
 productid VARCHAR(10) NOT NULL,
 categoryid VARCHAR(10) NOT NULL,
 name VARCHAR(25) NOT NULL,
 description VARCHAR(255) NOT NULL,
 imageurl VARCHAR(55),
 primary key (productid),
 foreign key (categoryid) references category_1(categoryid)
);

CREATE TABLE item_1 (
 itemid VARCHAR(10) NOT NULL,
 productid VARCHAR(10) NOT NULL,
 name VARCHAR(25) NOT NULL,
 description VARCHAR(255) NOT NULL,
 imageurl VARCHAR(55),
 listprice FLOAT NOT NULL,
 unitcost FLOAT NOT NULL,
 primary key (itemid),
 foreign key (productid) references product_1(productid)
);


INSERT INTO category_1 VALUES('CATS', 'Cats', 'Loving and furry friends', 'cats_icon.gif');
INSERT INTO category_1 VALUES('DOGS','Dogs', 'Loving and furry friends', 'dogs_icon.gif');

INSERT INTO product_1 VALUES('cat001', 'CATS', 'Manx', 'Great for reducing mouse populations', 'cat.gif');
INSERT INTO product_1 VALUES('cat002', 'CATS', 'Persian', 'Friendly house cat', 'cat.gif');
INSERT INTO product_1 VALUES('dog001', 'DOGS', 'Bull Dog', 'Friendly dog from England', 'dog.gif');
INSERT INTO product_1 VALUES('dog002', 'DOGS', 'Poodle', 'Great Companion Dog','dog.gif');


INSERT INTO item_1 VALUES('EST-1','dog001','Male Puppy','Friendly dog from England','dog.gif',2570,2000);
INSERT INTO item_1 VALUES('EST-2','dog001','Female Puppy','Friendly dog from England','dog.gif',2590,2100);
INSERT INTO item_1 VALUES('EST-3','dog002','Male Puppy','Great Companion Dog','dog.gif',2570,2000);
INSERT INTO item_1 VALUES('EST-4','dog002','Female Puppy','Great Companion Dog','dog.gif',2590,2100);
INSERT INTO item_1 VALUES('EST-5','cat001','Tailless','Great for reducing mouse populations','cat.gif',2570,2000);
INSERT INTO item_1 VALUES('EST-6','cat001','With tail','Great for reducing mouse populations','cat.gif',2590,2100);
INSERT INTO item_1 VALUES('EST-7','cat002','Adult Male','Friendly house cat','cat.gif',2570,2000);
INSERT INTO item_1 VALUES('EST-8','cat002','Adult Female','Friendly house cat','cat.gif',2590,2100);


