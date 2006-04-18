

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
 description VARCHAR(500) NOT NULL,
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

INSERT INTO category VALUES('CATS', 'Cats', 'Loving and finicky friends', 'cats_icon.gif');
INSERT INTO category VALUES('DOGS', 'Dogs', 'Loving and furry friends', 'dogs_icon.gif');
INSERT INTO category VALUES('BIRDS', 'Birds', 'Loving and feathery friends', 'birds_icon.gif');
INSERT INTO category VALUES('REPTILES', 'Reptiles', 'Loving and scaly friends', 'reptiles_icon.gif');
INSERT INTO category VALUES('FISH', 'Fish', 'Loving aquatic friends', 'fish_icon.gif');

INSERT INTO product VALUES('feline01', 'CATS', 'Long Hair', 'Great for reducing mouse populations', 'cat1.gif');
INSERT INTO product VALUES('feline02', 'CATS', 'Short Hair', 'Friendly house cat keeps you away from the vacuum', 'cat2.gif');
INSERT INTO product VALUES('canine01', 'DOGS', 'Medium Dogs', 'Friendly dog from England', 'dog1.gif');
INSERT INTO product VALUES('canine02', 'DOGS', 'Small Dogs', 'Great companion dog to sit on your lap','dog2.gif');
INSERT INTO product VALUES('avian01', 'BIRDS', 'Parrot', 'Friend for a lifetime.', 'bird1.gif');
INSERT INTO product VALUES('avian02', 'BIRDS', 'Exotic', 'Impress your friends with your colorful friend.','bird2.gif');

INSERT INTO Address VALUES('1', '11 Main Steet', '', 'Milpitas','CA','95035',37.431194,-121.907096);
INSERT INTO Address VALUES('2', '22 Main Steet', '', 'Santa Clara','CA','95054',37.34578,-121.9438);
INSERT INTO Address VALUES('3', '33 Main Steet', '', 'Fremont','CA','94536',37.53398,-121.95448);
INSERT INTO Address VALUES('4', '44 Main Steet', '', 'Palo Alto','CA','94301',37.442051,-122.141434);
INSERT INTO Address VALUES('5', '55 Main Steet', '', 'Mountain View','CA','94035',37.385349,-122.081451);
INSERT INTO Address VALUES('6', '66 Main Steet', '', 'Sunnyvale','CA','94085',37.369019,-122.035019);
INSERT INTO Address VALUES('7', '77 Main Steet', '', 'Hayward','CA','94540',37.68002,-122.09016);
INSERT INTO Address VALUES('8', '88 Main Steet', '', 'Capitola','CA','95010',36.975739,-121.952797);
    INSERT INTO Address VALUES('9', '99 Main Steet', '', 'San Francisco','CA','94101',37.792097,-122.394991);
INSERT INTO Address VALUES('10', '1010 Main Steet', '', 'Los Altos','CA','94022',37.37754,-122.11824);
INSERT INTO Address VALUES('11', '1111 Main Steet', '', 'Cambell','CA','95008',37.287109,-121.948647);
INSERT INTO Address VALUES('12', '200 Main Steet', '', 'Foster City','CA','94404',37.566407,-122.322727);
INSERT INTO Address VALUES('13', '1313 Main Steet', '', 'Redwood City','CA','94061',37.480764,-122.22432);
INSERT INTO Address VALUES('14', '1414 Main Steet', '', 'Cupertino','CA','95014',37.32304,-122.032303);
INSERT INTO Address VALUES('15', '1515 Main Steet', '', 'Gilroy','CA','95020',37.005829,-121.567291);
INSERT INTO Address VALUES('16', '1616 Main Steet', '', 'San Leandro','CA','94577',37.724979,-122.155762);

INSERT INTO SellerContactInfo VALUES('1', 'Brydon', 'Sean', 'abc@abc.xyz');
INSERT INTO SellerContactInfo VALUES('2', 'Singh', 'Inderjeet', 'abc@abc.xyz');
INSERT INTO SellerContactInfo VALUES('3', 'Basler', 'Mark', 'abc@abc.xyz');
INSERT INTO SellerContactInfo VALUES('4', 'Yoshida', 'Yutaka', 'abc@abc.xyz');
INSERT INTO SellerContactInfo VALUES('5', 'Kangath', 'Smitha', 'abc@abc.xyz');
INSERT INTO SellerContactInfo VALUES('6', 'Freeman', 'Larry', 'abc@abc.xyz');
INSERT INTO SellerContactInfo VALUES('7', 'Kaul', 'Jeet', 'abc@abc.xyz');
INSERT INTO SellerContactInfo VALUES('8', 'Burns', 'Ed', 'abc@abc.xyz');
INSERT INTO SellerContactInfo VALUES('9', 'McClanahan', 'Craig', 'abc@abc.xyz');
INSERT INTO SellerContactInfo VALUES('10', 'Duke', 'Duke', 'abc@abc.xyz');
INSERT INTO SellerContactInfo VALUES('11', 'Duke', 'Duke', 'abc@abc.xyz');
INSERT INTO SellerContactInfo VALUES('12', 'Duke', 'Duke', 'abc@abc.xyz');
INSERT INTO SellerContactInfo VALUES('13', 'Duke', 'Duke', 'abc@abc.xyz');
INSERT INTO SellerContactInfo VALUES('14', 'Duke', 'Duke', 'abc@abc.xyz');
INSERT INTO SellerContactInfo VALUES('15', 'Duke', 'Duke', 'abc@abc.xyz');
INSERT INTO SellerContactInfo VALUES('16', 'Duke', 'Duke', 'abc@abc.xyz');

INSERT INTO item VALUES('1', 'feline01', 'Lazy cat', 'A great pet to lounge with. If you want a friend to watch TV with, this is the cat for you. Plus, he wont even ask for the remote!', 'images/cat1.gif','images/cat1.gif', 307,'1','1');
INSERT INTO item VALUES('2', 'feline01', 'Old Cat', 'A great old pet retired from duty in the circus. This fully-trained tiger is looking for a place to retire. Loves to roam free and loves to eat other animals.', 'images/cat2.gif','images/cat2.gif', 200,'2','2');
INSERT INTO item VALUES('3', 'feline01', 'Young Cat', 'A great young pet to chase around. Loves to play with a ball of string.', 'images/cat3.gif','images/cat3.gif', 350,'3','3');
INSERT INTO item VALUES('4', 'feline01', 'Scrapper Cat', 'A scappy cat that likes to cause trouble. If you are looking for a challenge to your cat training skills, this scapper is the test!', 'images/cat4.gif','images/cat4.gif', 417,'4','4');
INSERT INTO item VALUES('5', 'feline01', 'Alley Cat', 'Meow Meow in the back alley cat fights! This cat keeps the racoons away, but still has class.', 'images/cat5.gif','images/cat5.gif', 307, '5','5');
INSERT INTO item VALUES('6', 'feline02', 'Playful Cat', 'A needy pet. This cat refuses to grow up. Do you like playful spirits?  ', 'images/cat7.gif','images/cat7.gif', 190, '6','6');
INSERT INTO item VALUES('7', 'feline02', 'Long Haired Cat', 'A high maintenance cat for an owner with time. This cat needs pampering: comb it hair, brush its teeth, wash its fur, paint its claws. For all you debutantes, let the world know you have arrived in style with this snooty cat in your purse!', 'images/cat8.gif', 'images/cat8.gif', 199,'7','7');
INSERT INTO item VALUES('8', 'feline02', 'Smelly Cat', 'A great pet with its own song to sing with your fiends. "Smelly cat, Smelly cat ..." Need an excuse for that funky odor in your house? Smelly cat is the answer.', 'images/cat9.gif','images/cat9.gif', 303,'8','8');
INSERT INTO item VALUES('9', 'feline02', 'Wild Cat', 'This little tiger thinks it has big teeth. A great wild pet for an adventurous person. May eat your other pets so be careful.', 'images/cat10.gif', 'images/cat10.gif', 527,'9','9');
INSERT INTO item VALUES('10', 'feline02', 'Saber Cat', 'A great watch pet. Want to keep your roommates from stealing the beer from your refrigerator? This big-toothed crazy cat is better than a watchdog. Just place him on top of the refrigerator and watch him pounce when so-called friends try to sneak a beer. This cat is great fun at parties.', 'images/cat11.gif', 'images/cat11.gif', 237,'10','10');
INSERT INTO item VALUES('11', 'feline02', 'Snappy Cat', 'Fastest and coolest cat in town. If you always wanted to own a cheetah, this cat is even faster and better looking.', 'images/cat12.gif', 'images/cat12.gif', 337,'11','11');
INSERT INTO item VALUES('12', 'canine01', 'Lazy Dog', 'A great pet', 'images/dog1.gif','images/dog1.gif', 257,'12','12');
INSERT INTO item VALUES('13', 'canine01', 'Old Dog', 'A great old pet', 'images/dog2.gif','images/dog2.gif', 70,'13','13');
INSERT INTO item VALUES('14', 'canine01', 'Young Dog', 'A great young pet', 'images/dog3.gif','images/dog3.gif', 301,'14','14');
INSERT INTO item VALUES('15', 'canine02', 'Scrapper Dog', 'A scapper dog', 'images/dog4.gif','images/dog4.gif', 410,'15','15');
INSERT INTO item VALUES('16', 'canine02', 'Grey Hound', 'A great runner', 'images/dog5.gif', 'images/dog5.gif', 200,'16','16');
INSERT INTO item VALUES('17', 'avian01', 'Squaky Bird', 'A great noisey bird to drive your parents crazy. If you think playing a stereo loud will test your parents patience, wait till you try this screeching bird. It will fly around and cause a commotion that will have you laughing for days. This is a sure-fire way to get your parents to get you your own apartment.', 'images/CIMG9127.jpg', 'images/CIMG9127-s.jpg', 303,'8','8');
INSERT INTO item VALUES('18', 'avian01', 'Pink Bird', 'A beautiful pink bird.', 'images/CIMG9104.jpg', 'images/CIMG9104-s.jpg', 3003,'8','8');
INSERT INTO item VALUES('19', 'avian02', 'Wild Bird', 'A great wild pet', 'images/CIMG9109.jpg', 'images/CIMG9109-s.jpg', 527,'9','9');
INSERT INTO item VALUES('20', 'avian02', 'Really Wild Bird', 'A really wild pet. This thing is like a zombie in a horror movie it is so wild. I tried for 2 years to tame this beast and all that happened was I got peck marks all over my hands. Maybe you are a former circus trainer looking for a challenge? If so this birdy needs a home.', 'images/CIMG9109.jpg', 'images/CIMG9109-s.jpg', 527,'9','9');
INSERT INTO item VALUES('21', 'avian02', 'Crazy Bird', 'A great crazy pet', 'images/CIMG9109.jpg', 'images/CIMG9109-s.jpg', 527,'9','9');
INSERT INTO item VALUES('22', 'avian02', 'Smart Bird', 'A great smart pet. Perfect for an engineer. This pet is so smart it can do your coding for you. Just dont tell your boss!', 'images/CIMG9084.jpg','images/CIMG9084-s.jpg', 527,'9','9');
INSERT INTO item VALUES('23', 'avian02', 'Funny Bird', 'A great funny pet. Ever hear the joke about a bird, a hacker, and Java book? Well, this bird can tell it to you. It will make you laugh until you cry. Plus, it can teach you jokes which you can use at parties to impress your friends. That is right sir, this bird will make even you funny!', 'images/CIMG9109.jpg','images/CIMG9109-s.jpg', 527,'9','9');
INSERT INTO item VALUES('24', 'avian02', 'Active Bird', 'A great active pet', 'images/CIMG9088.jpg','images/CIMG9088-s.jpg', 527,'9','9');
INSERT INTO item VALUES('25', 'avian02', 'Curious Bird', 'A great curious pet', 'images/CIMG9138.jpg','images/CIMG9109-s.jpg', 1527,'9','9');

INSERT INTO id_gen VALUES('ITEM_ID',25);
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