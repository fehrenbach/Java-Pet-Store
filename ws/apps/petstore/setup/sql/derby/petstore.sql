

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
 street2 VARCHAR(55),
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
 name VARCHAR(30) NOT NULL,
 description VARCHAR(500) NOT NULL,
 imageurl VARCHAR(55),
 imagethumburl VARCHAR(55),
 price FLOAT NOT NULL,
 address_addressid VARCHAR(10) NOT NULL,
 contactinfo_contactinfoid VARCHAR(10) NOT NULL,
 totalscore INTEGER NOT NULL,
 numberofvotes INTEGER NOT NULL,
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
INSERT INTO product VALUES('fish01', 'FISH', 'Small Fish', 'Fits nicely in a small aquarium.','fish2.gif');
INSERT INTO product VALUES('fish02', 'FISH', 'Large Fish', 'Need a large aquarium.','fish3.gif');
INSERT INTO product VALUES('reptile01', 'REPTILES', 'Slithering Reptiles', 'Slides across the floor.','lizard1.gif');
INSERT INTO product VALUES('reptile02', 'REPTILES', 'Crawling Reptiles', 'Uses legs to move fast.','lizard2.gif');

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
INSERT INTO Address VALUES('17', 'River Oaks Pky & Village Center Dr', '', 'San Jose','CA','95134',37.398259,-121.922367);
INSERT INTO Address VALUES('18', 'S 1st St & W Santa Clara St', '', 'San Jose','CA','95113',37.336141,-121.890666);
INSERT INTO Address VALUES('19', '1st St & Market St ', '', 'San Francisco','CA','94105',37.791028,-122.399082);
INSERT INTO Address VALUES('20', 'Paseo Padre Pky & Fremont Blvd', '', 'Fremont','CA','94555',37.575035,-122.041273);
INSERT INTO Address VALUES('21', 'W el Camino Real & S Mary Ave', '', 'Sunnyvale','CA','94087',37.371641,-122.048772);
INSERT INTO Address VALUES('22', 'Grant Rd & South Dr ', '', 'Mountain view','CA','94040',37.366941,-122.078073);

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

INSERT INTO item VALUES('1', 'feline01', 'Lazy cat', 'A great pet to lounge on the sofa with. If you want a friend to watch TV with, this is the cat for you. Plus, he wont even ask for the remote!', 'images/cat1.gif','images/cat1.gif', 307,'1','1', 15, 5);
INSERT INTO item VALUES('2', 'feline01', 'Old Cat', 'A great old pet retired from duty in the circus. This fully-trained tiger is looking for a place to retire. Loves to roam free and loves to eat other animals.', 'images/cat2.gif','images/cat2.gif', 200,'2','2', 15, 5);
INSERT INTO item VALUES('3', 'feline01', 'Young Cat', 'A great young pet to chase around. Loves to play with a ball of string.', 'images/cat3.gif','images/cat3.gif', 350,'3','3', 15, 5);
INSERT INTO item VALUES('4', 'feline01', 'Scrapper Cat', 'A scappy cat that likes to cause trouble. If you are looking for a challenge to your cat training skills, this scapper is the test!', 'images/cat4.gif','images/cat4.gif', 417,'4','4', 15, 5);
INSERT INTO item VALUES('5', 'feline01', 'Alley Cat', 'Meow Meow in the back alley cat fights! This cat keeps the racoons away, but still has class.', 'images/cat5.gif','images/cat5.gif', 307, '5','5', 15, 5);
INSERT INTO item VALUES('6', 'feline02', 'Playful Cat', 'A needy pet. This cat refuses to grow up. Do you like playful spirits?  ', 'images/cat7.gif','images/cat7.gif', 190, '6','6', 15, 5);
INSERT INTO item VALUES('7', 'feline02', 'Long Haired Cat', 'A high maintenance cat for an owner with time. This cat needs pampering: comb it hair, brush its teeth, wash its fur, paint its claws. For all you debutantes, let the world know you have arrived in style with this snooty cat in your purse!', 'images/cat8.gif', 'images/cat8.gif', 199,'7','7', 15, 5);
INSERT INTO item VALUES('8', 'feline02', 'Smelly Cat', 'A great pet with its own song to sing with your fiends. "Smelly cat, Smelly cat ..." Need an excuse for that funky odor in your house? Smelly cat is the answer.', 'images/cat9.gif','images/cat9.gif', 303,'8','8', 15, 5);
INSERT INTO item VALUES('9', 'feline02', 'Wild Cat', 'This little tiger thinks it has big teeth. A great wild pet for an adventurous person. May eat your other pets so be careful.', 'images/cat10.gif', 'images/cat10.gif', 527,'9','9', 15, 5);
INSERT INTO item VALUES('10', 'feline02', 'Saber Cat', 'A great watch pet. Want to keep your roommates from stealing the beer from your refrigerator? This big-toothed crazy cat is better than a watchdog. Just place him on top of the refrigerator and watch him pounce when so-called friends try to sneak a beer. This cat is great fun at parties.', 'images/cat11.gif', 'images/cat11.gif', 237,'10','10', 15, 5);
INSERT INTO item VALUES('11', 'feline02', 'Snappy Cat', 'Fastest and coolest cat in town. If you always wanted to own a cheetah, this cat is even faster and better looking.', 'images/cat12.gif', 'images/cat12.gif', 337,'11','11', 15, 5);

INSERT INTO item VALUES('112', 'canine01', 'Lazy Dog', 'OK, I can not get this dog to fetch the newpaper. Not even for a doggy biscuit. His name is "Rhymes". He is so lazy, it drives me crazy.', 'images/dog1.gif','images/dog1.gif', 257,'12','12', 15, 5);
INSERT INTO item VALUES('113', 'canine01', 'Old Dog', 'This old geezer just wants to sleep at your feet. Slip him some food under the table and watch him wag his tail.', 'images/dog2.gif','images/dog2.gif', 70,'13','13', 15, 5);
INSERT INTO item VALUES('114', 'canine01', 'Young Dog', 'A great young pet in need of training. ', 'images/dog3.gif','images/dog3.gif', 301,'14','14', 15, 5);
INSERT INTO item VALUES('115', 'canine02', 'Scrapper Dog', 'This scapy woofer needs some clean up and some lessons. Help him out and take him home.', 'images/dog4.gif','images/dog4.gif', 410,'15','15', 15, 5);
INSERT INTO item VALUES('116', 'canine02', 'Grey Hound', 'A great runner for a fast owner. This is the fastest dog I have ever seen. Its naturally fast and does not take steroids to improve its performance.', 'images/dog5.gif', 'images/dog5.gif', 200,'16','16', 15, 5);
INSERT INTO item VALUES('117', 'canine02', 'Beach Dog', 'A great dog to lay in the Sun with, chases a frisbee like a champ, and can swim like a shark. Heck, he can ride a surfboard if you dont mind sharing.', 'images/dog6.gif', 'images/dog6.gif', 200,'16','16', 15, 5);

INSERT INTO item VALUES('201', 'avian01', 'Female Eclectus Parrot', 'This bird really loves apples. She is a great companion and is quite beautiful. Just look at those colors. The read and blue makes her look like superman! And she can fly too.!', 'images/eclectus-female-med.jpg', 'images/eclectus-female-thumb.jpg', 250,'8','8', 15, 5);
INSERT INTO item VALUES('202', 'avian01', 'Galah Parrot', 'My Galah Parrot needs a new home. This new home should have lots of trees and absolutely NO cats. I dont say that because the cats might eat the bird. Rather, I say this Galah needs to stay away from birds so that the cats dont get hurt. This Galah loves the taste of cat meat.', 'images/galah-parrot-med.jpg', 'images/galah-parrot-thumb.jpg', 900,'8','8', 15, 5);
INSERT INTO item VALUES('203', 'avian02', 'Kookaburra Bird', 'Little Kookaburra for sale. This Kookaburra is tame and likes to just sit to tree branches. A very easy to care for pet.', 'images/kookaburra-med.jpg', 'images/kookaburra-thumb.jpg', 100,'8','8', 15, 5);
INSERT INTO item VALUES('204', 'avian02', 'Orange LoveBird', 'Can this love bird bring you some love? I believe this orange lovebird will bring good luck to your life, and for just a small fee it can be yours.', 'images/lovebird-med.jpg', 'images/lovebird-thumb.jpg', 75,'8','8', 15, 5);
INSERT INTO item VALUES('205', 'avian02', 'Blue Peacock', 'Buy a blue peacock and be the envy of all your neighbors! Guaranteed to turn heads. You will meet everyone in your neighborhood as they come by to see this beauty.', 'images/peacock-blue-med.jpg', 'images/peacock-blue-thumb.jpg', 55,'8','8', 15, 5);
INSERT INTO item VALUES('206', 'avian02', 'Wild Peacock', 'OK, this peacock is wild. And I dont mean that it is not tame. I mean this thing really likes to party! Its the best dancer I have ever seen. Trust me on this.', 'images/peacock-med.jpg', 'images/peacock-thumb.jpg', 65,'8','8', 15, 5);
INSERT INTO item VALUES('207', 'avian02', 'White Peacock', 'My white peacock is like a work of art. Its beauty is refreshing. Consider this an investment, just like buying a painting.', 'images/peakcock-white-med.jpg', 'images/peacock-white-thumb.jpg', 195,'8','8', 15, 5);
INSERT INTO item VALUES('208', 'avian02', 'Rainbow Lorikeet', 'Color! Color! Color! The rainbow lorikeet is a beautiful bird.', 'images/rainbow-lorikeet-med.jpg', 'images/rainbow-lorikeet-thumb.jpg', 299,'8','8', 15, 5);
INSERT INTO item VALUES('209', 'avian02', 'Stone Eagle', 'My eagle is really tough. He is like a rock! In fact he is made of stone. Ok, he may not have a heart and maybe he can not fly, but he needs no food and is so easy to care for. And he has a great temperament, and in fact we have never had any disagreements at all.', 'images/eagle-stone-med.jpg', 'images/eagle-stone-thumb.jpg', 800,'8','8', 15, 5);
INSERT INTO item VALUES('210', 'avian01', 'Squaky Bird', 'A great noisy bird to drive your parents crazy. If you think playing a stereo loud will test your parents patience, wait till you try this screeching bird. It will fly around and cause a commotion that will have you laughing for days. This is a sure-fire way to get your parents to get you your own apartment.', 'images/CIMG9127.jpg', 'images/CIMG9127-s.jpg', 303,'8','8', 15, 5);
INSERT INTO item VALUES('211', 'avian01', 'Pink Bird', 'A beautiful pink bird. Its not white. Its not red. Its pink.', 'images/CIMG9104.jpg', 'images/CIMG9104-s.jpg', 3003,'8','8', 15, 5);
INSERT INTO item VALUES('212', 'avian02', 'Wild Bird', 'A wild bird. This little rebel thinks its not a house pet, but really it is as tame as a lap dog. It just looks so wild and impresses your friends. Owning this wild bird is cooler than getting a tatoo and hurts less!', 'images/CIMG9109.jpg', 'images/CIMG9109-s.jpg', 527,'9','9', 15, 5);
INSERT INTO item VALUES('213', 'avian02', 'Really Wild Bird', 'A really wild pet. This thing is like a zombie in a horror movie it is so wild. I tried for 2 years to tame this beast and all that happened was I got peck marks all over my hands. Maybe you are a former circus trainer looking for a challenge? If so this birdy needs a home.', 'images/CIMG9109.jpg', 'images/CIMG9109-s.jpg', 527,'9','9', 15, 5);
INSERT INTO item VALUES('214', 'avian02', 'Crazy Bird', 'This crazy bird once flew over the cukoos nest. Some people say that I am crazy. Well, you should meet my bird if you want to meet crazy. This bird is plain looney.', 'images/CIMG9109.jpg', 'images/CIMG9109-s.jpg', 527,'9','9', 15, 5);
INSERT INTO item VALUES('215', 'avian02', 'Smart Bird', 'A great smart pet. Perfect for an engineer. This pet is so smart it can do your coding for you. Just dont tell your boss!', 'images/CIMG9084.jpg','images/CIMG9084-s.jpg', 527,'9','9', 15, 5);
INSERT INTO item VALUES('216', 'avian02', 'Funny Bird', 'A great funny pet. Ever hear the joke about a bird, a hacker, and Java book? Well, this bird can tell it to you. It will make you laugh until you cry. Plus, it can teach you jokes which you can use at parties to impress your friends. That is right sir, this bird will make even you funny!', 'images/CIMG9109.jpg','images/CIMG9109-s.jpg', 527,'9','9', 15, 5);
INSERT INTO item VALUES('217', 'avian02', 'Active Bird', 'A great active pet. This bird once flew a marathon with me and did not get tired. It can fly along while you jog on the trails. Just make sure the hawks do not swoop down and eat it.', 'images/CIMG9088.jpg','images/CIMG9088-s.jpg', 527,'9','9', 15, 5);
INSERT INTO item VALUES('218', 'avian02', 'Curious Bird', 'A great curious birdy. Everything will pique this birds interest. It will investigate every new thing it sees.', 'images/CIMG9138.jpg','images/CIMG9109-s.jpg', 1527,'9','9', 15, 5);
INSERT INTO item VALUES('219', 'avian02', 'Itchy Bird', 'This bird needs some attention. I think he has dandruff in his feathers. He is always scratching so I knick-named him "Itchy". I wish I had claws like that to scratch MY head. Maybe if you are a good trainer, you can teach him to scratch your back nicely with those talons.', 'images/CIMG9129.jpg', 'images/CIMG9129-s.jpg', 200,'8','8', 15, 5);

INSERT INTO item VALUES('301', 'fish02', 'Spotted JellyFish', 'Buy Me.', 'images/spotted-jellyfish-med.jpg','images/spotted-jellyfish-thumb.jpg', 55,'9','9', 15, 5);
INSERT INTO item VALUES('302', 'fish01', 'Small Sea Nettle JellyFish', 'Buy Me.', 'images/sea-nettle-jellyfish-med.jpg','images/sea-nettle-jellyfish-thumb.jpg', 75,'9','9', 15, 5);
INSERT INTO item VALUES('303', 'fish02', 'RockFish', 'Buy Me.', 'images/rockfish-med.jpg','images/rockfish-thumb.jpg', 125,'9','9', 15, 5);
INSERT INTO item VALUES('304', 'fish02', 'Purple JellyFish', 'Buy Me.', 'images/purple-jellyfish-med.jpg','images/purple-jellyfish-thumb.jpg', 225,'9','9', 15, 5);
INSERT INTO item VALUES('305', 'fish02', 'White Octopus', 'Buy Me.', 'images/octopus-white-med.jpg','images/octopus-white-thumb.jpg', 2000,'9','9', 15, 5);
INSERT INTO item VALUES('306', 'fish02', 'Red Octopus', 'Buy Me.', 'images/octopus-red-med.jpg','images/octopus-red-thumb.jpg', 2000,'9','9', 15, 5);
INSERT INTO item VALUES('307', 'fish02', 'Koi', 'Buy Me.', 'images/koi-med.jpg','images/koi-thumb.jpg', 150,'9','9', 15, 5);
INSERT INTO item VALUES('308', 'fish02', 'GlassFish', 'FREE! And open source!', 'images/glassfish-colored-med.jpg','images/glassfish-colored-thumb.jpg', 0,'9','9', 15, 5);
INSERT INTO item VALUES('309', 'fish01', 'CuttleFish', 'This rare and spooky looking fish is the talk of town where I live!', 'images/cuttlefish-med.jpg','images/cuttlefish-thumb.jpg', 900,'9','9', 15, 5);
INSERT INTO item VALUES('310', 'fish01', 'Silver Carp Car', 'You will never believe the fish I caught! This is the ultimate fishing stories... seriously! I pulled this baby out of the forbidden lake behind the nuclear power plant.', 'images/carp-car-med.jpg','images/carp-car-thumb.jpg', 500,'9','9', 15, 5);
INSERT INTO item VALUES('311', 'fish02', 'Moon JellyFish', 'Buy Me.', 'images/moon-jelly-med.jpg','images/moon-jelly-thumb.jpg', 1225,'9','9', 15, 5);
INSERT INTO item VALUES('312', 'fish01', 'Sea Anemone', 'This colorful sea anemone will really brighten up your aquarium.', 'images/sea-anemone-med.jpg','images/sea-anemone-thumb.jpg', 112,'9','9', 15, 5);
INSERT INTO item VALUES('313', 'fish01', 'Gold Fish', 'Perfect for a first fish for a child. This fish is not good in the same tank as some bigger fish as they see this little gold fish as a snack.', 'images/fish2.gif','images/fish2.gif', 2,'9','9', 15, 5);
INSERT INTO item VALUES('314', 'fish01', 'Angel Fish', 'I love this fish. But my new roommate has a cat, and the cat just so does not seem to get along with the  fish. At first, I thought the cat was trying to just play with the fish, or maybe learn to swim. And then I remembered that show where they explained that Tuna is the chicken of the sea, but that does not mean its chicken. Not, its fish. And cats love tuna, so then I got scared and realized my fish is in danger. Help me! Buy my little chicken of the sea.', 'images/fish3.gif','images/fish3.gif', 100,'9','9', 15, 5);
INSERT INTO item VALUES('315', 'fish02', 'Striped Tropical', 'This large fish needs plenty of room to swim. Either a big aquarium or your bath tub.', 'images/fish4.gif','images/fish4.gif', 20,'9','9', 15, 5);

INSERT INTO item VALUES('401', 'reptile01', 'Iron Dragon', 'Buy me', 'images/dragon-iron-med.jpg','images/dragon-iron-thumb.jpg', 5000,'9','9', 15, 5);
INSERT INTO item VALUES('402', 'reptile02', 'Hawaiian Green Lizard', 'Buy me', 'images/hawaiian-lizard-med.jpg','images/hawaiian-lizard-thumb.jpg', 110,'9','9', 15, 5);
INSERT INTO item VALUES('403', 'reptile01', 'Green slider', 'This snake looks like a lizard! It must be rare since I have never seen one like it.', 'images/lizard3.gif','images/lizard3.gif', 1000,'9','9', 15, 5);
INSERT INTO item VALUES('404', 'reptile02', 'Green Iguana', 'This is one proud and tough lizard. He holds his head high in any circumstance.', 'images/lizard1.gif','images/lizard1.gif', 1000,'9','9', 15, 5);
INSERT INTO item VALUES('405', 'reptile02', 'Iguana', 'My iguana needs a home. His tail is really long. He is very nice.', 'images/lizard2.gif','images/lizard2.gif', 500,'9','9', 15, 5);
INSERT INTO item VALUES('406', 'reptile02', 'Frog', 'This little green frog was rescued from the chef in the kitchen of a french restaurant. If I had not acted quickly, his legs would have been appetizers. Now for just a small fee you can buy him as your pet.', 'images/frog1.gif','images/frog1.gif', 500,'9','9', 15, 5);

INSERT INTO id_gen VALUES('ITEM_ID',406);
INSERT INTO id_gen VALUES('ADDRESS_ID',22);
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