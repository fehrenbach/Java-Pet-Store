

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
 imagethumburl VARCHAR(55),
 price FLOAT NOT NULL,
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

CREATE TABLE ziplocation (
 zipcode INTEGER NOT NULL,
 city VARCHAR(30) NOT NULL,
 state VARCHAR(2) NOT NULL,
 primary key (zipcode)
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
INSERT INTO product VALUES('avian01', 'BIRDS', 'Parrot', 'Friend for a lifetime.', 'bird1.gif');
INSERT INTO product VALUES('avian02', 'BIRDS', 'Exotic', 'Impress your friends with your feathered friend.','bird2.gif');

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

INSERT INTO item VALUES('1', 'feline01', 'Lazy cat', 'A great pet', 'images/cat1.gif','images/cat1.gif', 307,'1','1');
INSERT INTO item VALUES('2', 'feline01', 'Old Cat', 'A great old pet', 'images/cat2.gif','images/cat2.gif', 200,'2','2');
INSERT INTO item VALUES('3', 'feline01', 'Young Cat', 'A great young pet', 'images/cat3.gif','images/cat3.gif', 350,'3','3');
INSERT INTO item VALUES('4', 'feline01', 'Scrapper Cat', 'A scapper cat', 'images/cat4.gif','images/cat4.gif', 417,'4','4');
INSERT INTO item VALUES('5', 'feline01', 'Alley Cat', 'A great pet', 'images/cat5.gif','images/cat5.gif', 307, '5','5');
INSERT INTO item VALUES('6', 'feline02', 'Playful Cat', 'A needy pet', 'images/cat7.gif','images/cat7.gif', 190, '6','6');
INSERT INTO item VALUES('7', 'feline02', 'Long Haired Cat', 'A high maintenance cat', 'images/cat8.gif', 'images/cat8.gif', 199,'7','7');
INSERT INTO item VALUES('8', 'feline02', 'Smelly Cat', 'A great pet', 'images/cat9.gif','images/cat9.gif', 303,'8','8');
INSERT INTO item VALUES('9', 'feline02', 'Wild Cat', 'A great wild pet', 'images/cat10.gif', 'images/cat10.gif', 527,'9','9');
INSERT INTO item VALUES('10', 'feline02', 'Saber Cat', 'A great watch pet', 'images/cat11.gif', 'images/cat11.gif', 237,'10','10');
INSERT INTO item VALUES('11', 'feline02',' Scrapper Cat', 'A scapper cat', 'images/cat12.gif', 'images/cat12.gif', 337,'11','11');
INSERT INTO item VALUES('12', 'canine01', 'Lazy Dog', 'A great pet', 'images/dog1.gif','images/dog1.gif', 257,'12','12');
INSERT INTO item VALUES('13', 'canine01', 'Old Dog', 'A great old pet', 'images/dog2.gif','images/dog2.gif', 70,'13','13');
INSERT INTO item VALUES('14', 'canine01', 'Young Dog', 'A great young pet', 'images/dog3.gif','images/dog3.gif', 301,'14','14');
INSERT INTO item VALUES('15', 'canine02', 'Scrapper Dog', 'A scapper dog', 'images/dog4.gif','images/dog4.gif', 410,'15','15');
INSERT INTO item VALUES('16', 'canine02', 'Grey Hound', 'A great runner', 'images/dog5.gif', 'images/dog5.gif', 200,'16','16');

INSERT INTO item VALUES('a001', 'avian01', 'Squaky Bird', 'A great noisey bird', 'images/CIMG9127.jpg', 'images/CIMG9127-s.jpg', 303,'8','8');
INSERT INTO item VALUES('a002', 'avian01', 'Pink Bird', 'A beautiful pink bird', 'images/CIMG9104.jpg', 'images/CIMG9104-s.jpg', 3003,'8','8');
INSERT INTO item VALUES('a003', 'avian02', 'Wild Bird', 'A great wild pet', 'images/CIMG9109.jpg', 'images/CIMG9109-s.jpg', 527,'9','9');
INSERT INTO item VALUES('a004', 'avian02', 'Really Wild Bird', 'A great wild pet', 'images/CIMG9109.jpg', 'images/CIMG9109-s.jpg', 527,'9','9');
INSERT INTO item VALUES('a005', 'avian02', 'Crazy Bird', 'A great crazy pet', 'images/CIMG9109.jpg', 'images/CIMG9109-s.jpg', 527,'9','9');
INSERT INTO item VALUES('a006', 'avian02', 'Smart Bird', 'A great smart pet', 'images/CIMG9084.jpg','images/CIMG9084-s.jpg', 527,'9','9');
INSERT INTO item VALUES('a007', 'avian02', 'Funny Bird', 'A great funny pet', 'images/CIMG9109.jpg','images/CIMG9109-s.jpg', 527,'9','9');
INSERT INTO item VALUES('a008', 'avian02', 'Active Bird', 'A great active pet', 'images/CIMG9088.jpg','images/CIMG9088-s.jpg', 527,'9','9');
INSERT INTO item VALUES('a009', 'avian02', 'Curious Bird', 'A great curious pet', 'images/CIMG9138.jpg','images/CIMG9109-s.jpg', 1527,'9','9');


INSERT INTO id_gen VALUES('ITEM_ID',16);
INSERT INTO id_gen VALUES('ADDRESS_ID',16);
INSERT INTO id_gen VALUES('CONTACT_INFO_ID',16);

INSERT INTO ziplocation VALUES(42601, 'Aaron', 'KY');
INSERT INTO ziplocation VALUES(16820, 'Aaronsburg', 'PA');
INSERT INTO ziplocation VALUES(31794, 'Abac', 'GA');
INSERT INTO ziplocation VALUES(36310, 'Abbeville', 'AL');
INSERT INTO ziplocation VALUES(31001, 'Abbeville', 'GA');
INSERT INTO ziplocation VALUES(38601, 'Abbeville', 'MS');
INSERT INTO ziplocation VALUES(29620, 'Abbeville', 'SC');
INSERT INTO ziplocation VALUES(04406, 'Abbot Village', 'ME');
INSERT INTO ziplocation VALUES(54405, 'Abbotsford', 'WI');
INSERT INTO ziplocation VALUES(76621, 'Abbott', 'TX');