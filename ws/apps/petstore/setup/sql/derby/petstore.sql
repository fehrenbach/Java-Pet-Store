

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

CREATE TABLE Address (
 addressid VARCHAR(10) NOT NULL,
 street1 VARCHAR(55) NOT NULL,
 street2 VARCHAR(55) NOT NULL,
 city VARCHAR(55) NOT NULL,
 state VARCHAR(25) NOT NULL,
 zip VARCHAR(5) NOT NULL,
 latitude DECIMAL(14,10) NOT NULL,
 longitude DECIMAL(14,10) NOT NULL,
 primary key (addressid)
);

CREATE TABLE SellerContactInfo (
 contactinfoid VARCHAR(10) NOT NULL,
 lastname VARCHAR(24) NOT NULL,
 firstname VARCHAR(24) NOT NULL,
 email VARCHAR(24) NOT NULL,
 primary key (contactinfoid)
);

CREATE TABLE item (
 itemid VARCHAR(10) NOT NULL,
 productid VARCHAR(10) NOT NULL,
 name VARCHAR(25) NOT NULL,
 description VARCHAR(255) NOT NULL,
 imageurl VARCHAR(55),
 listprice FLOAT NOT NULL,
 unitcost FLOAT NOT NULL,
 address_addressid VARCHAR(10) NOT NULL,
 contactinfo_contactinfoid VARCHAR(10) NOT NULL,
 primary key (itemid),
 foreign key (address_addressid) references Address(addressid),
 foreign key (productid) references product(productid),
 foreign key (contactinfo_contactinfoid) references SellerContactInfo(contactinfoid)
);

CREATE TABLE id_gen (
 gen_key VARCHAR(20) NOT NULL,
 gen_value INTEGER NOT NULL,
 primary key (gen_key)
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

INSERT INTO Address VALUES('1', 'Street1', 'Street2', 'ABC City','ABC State','9999',8.123456,9.123456);
INSERT INTO Address VALUES('2', 'Street1', 'Street2', 'ABC City','ABC State','9999',8.123456,9.123456);
INSERT INTO Address VALUES('3', 'Street1', 'Street2', 'ABC City','ABC State','9999',8.123456,9.123456);
INSERT INTO Address VALUES('4', 'Street1', 'Street2', 'ABC City','ABC State','9999',8.123456,9.123456);
INSERT INTO Address VALUES('5', 'Street1', 'Street2', 'ABC City','ABC State','9999',8.123456,9.123456);
INSERT INTO Address VALUES('6', 'Street1', 'Street2', 'ABC City','ABC State','9999',8.123456,9.123456);
INSERT INTO Address VALUES('7', 'Street1', 'Street2', 'ABC City','ABC State','9999',8.123456,9.123456);
INSERT INTO Address VALUES('8', 'Street1', 'Street2', 'ABC City','ABC State','9999',8.123456,9.123456);
INSERT INTO Address VALUES('9', 'Street1', 'Street2', 'ABC City','ABC State','9999',8.123456,9.123456);
INSERT INTO Address VALUES('10', 'Street1', 'Street2', 'ABC City','ABC State','9999',8.123456,9.123456);
INSERT INTO Address VALUES('11', 'Street1', 'Street2', 'ABC City','ABC State','9999',8.123456,9.123456);
INSERT INTO Address VALUES('12', 'Street1', 'Street2', 'ABC City','ABC State','9999',8.123456,9.123456);
INSERT INTO Address VALUES('13', 'Street1', 'Street2', 'ABC City','ABC State','9999',8.123456,9.123456);
INSERT INTO Address VALUES('14', 'Street1', 'Street2', 'ABC City','ABC State','9999',8.123456,9.123456);
INSERT INTO Address VALUES('15', 'Street1', 'Street2', 'ABC City','ABC State','9999',8.123456,9.123456);
INSERT INTO Address VALUES('16', 'Street1', 'Street2', 'ABC City','ABC State','9999',8.123456,9.123456);

INSERT INTO SellerContactInfo VALUES('1', 'Duke', 'Duke', 'abc@abc.xyz');
INSERT INTO SellerContactInfo VALUES('2', 'Duke', 'Duke', 'abc@abc.xyz');
INSERT INTO SellerContactInfo VALUES('3', 'Duke', 'Duke', 'abc@abc.xyz');
INSERT INTO SellerContactInfo VALUES('4', 'Duke', 'Duke', 'abc@abc.xyz');
INSERT INTO SellerContactInfo VALUES('5', 'Duke', 'Duke', 'abc@abc.xyz');
INSERT INTO SellerContactInfo VALUES('6', 'Duke', 'Duke', 'abc@abc.xyz');
INSERT INTO SellerContactInfo VALUES('7', 'Duke', 'Duke', 'abc@abc.xyz');
INSERT INTO SellerContactInfo VALUES('8', 'Duke', 'Duke', 'abc@abc.xyz');
INSERT INTO SellerContactInfo VALUES('9', 'Duke', 'Duke', 'abc@abc.xyz');
INSERT INTO SellerContactInfo VALUES('10', 'Duke', 'Duke', 'abc@abc.xyz');
INSERT INTO SellerContactInfo VALUES('11', 'Duke', 'Duke', 'abc@abc.xyz');
INSERT INTO SellerContactInfo VALUES('12', 'Duke', 'Duke', 'abc@abc.xyz');
INSERT INTO SellerContactInfo VALUES('13', 'Duke', 'Duke', 'abc@abc.xyz');
INSERT INTO SellerContactInfo VALUES('14', 'Duke', 'Duke', 'abc@abc.xyz');
INSERT INTO SellerContactInfo VALUES('15', 'Duke', 'Duke', 'abc@abc.xyz');
INSERT INTO SellerContactInfo VALUES('16', 'Duke', 'Duke', 'abc@abc.xyz');

INSERT INTO item VALUES('1', 'feline01', 'Lazy cat', 'A great pet', 'cat1.gif', 307, 290,'1','1');
INSERT INTO item VALUES('2', 'feline01', 'Old Cat', 'A great old pet', 'cat2.gif', 207, 200,'2','2');
INSERT INTO item VALUES('3', 'feline01', 'Young Cat', 'A great young pet', 'cat3.gif', 407, 350,'3','3');
INSERT INTO item VALUES('4', 'feline01', 'Scrapper Cat', 'A scapper cat', 'cat4.gif', 417, 370,'4','4');
INSERT INTO item VALUES('5', 'feline01', 'Alley Cat', 'A great pet', 'cat5.gif', 307, 290,'5','5');
INSERT INTO item VALUES('6', 'feline02', 'Playful Cat', 'A needy pet', 'cat7.gif', 190, 150,'6','6');
INSERT INTO item VALUES('7', 'feline02', 'Long Haired Cat', 'A high maintenance cat', 'cat8.gif', 199, 175,'7','7');
INSERT INTO item VALUES('8', 'feline02', 'Smelly Cat', 'A great pet', 'cat9.gif', 303, 200,'8','8');
INSERT INTO item VALUES('9', 'feline02', 'Wild Cat', 'A great wild pet', 'cat10.gif', 527, 240,'9','9');
INSERT INTO item VALUES('10', 'feline02', 'Saber Cat', 'A great watch pet', 'cat11.gif', 237, 200,'10','10');
INSERT INTO item VALUES('11', 'feline02',' Scrapper Cat', 'A scapper cat', 'cat12.gif', 337, 190,'11','11');
INSERT INTO item VALUES('12', 'canine01', 'Lazy Dog', 'A great pet', 'dog1.gif', 257, 201,'12','12');
INSERT INTO item VALUES('13', 'canine01', 'Old Dog', 'A great old pet', 'dog2.gif', 70, 50,'13','13');
INSERT INTO item VALUES('14', 'canine01', 'Young Dog', 'A great young pet', 'dog3.gif', 301, 210,'14','14');
INSERT INTO item VALUES('15', 'canine02', 'Scrapper Dog', 'A scapper dog', 'dog4.gif', 410, 210,'15','15');
INSERT INTO item VALUES('16', 'canine02', 'Grey Hound', 'A great runner', 'dog5.gif', 200, 210,'16','16');

INSERT INTO id_gen VALUES('ITEM_ID',16);
INSERT INTO id_gen VALUES('ADDRESS_ID',16);
INSERT INTO id_gen VALUES('CONTACT_INFO_ID',16);