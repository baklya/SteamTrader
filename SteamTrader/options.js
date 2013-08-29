// Saves options to localStorage.
function save_options() {
	var a = {};
	var b = document.getElementById("itemList");
	var c = b.getElementsByTagName("tr");
	
	for(var i = 0; i < c.length; i++){
		a[document.getElementById("name_" + i).innerText] = {
			minPrice: parseFloat(document.getElementById("price_" + i).value),
			category: document.getElementById("category_" + i).innerText,
			isActive: document.getElementById("check_" + i).checked
		}
	}
	
	chrome.storage.local.get('SteamTrader',function(result) {
		var d = result;
		d.SteamTrader.AllItems = a;	
		chrome.storage.local.set(d,function(result) {
			alert('Сохранено');
			document.location.reload(true);
		});
	});
}
















// SteamTrader
// --AllItems[]
// ----name
// ----minPrice
// ----category
// ----isActive
// --MyItems[]
// ----name
// ----id
// ----buyPrice
// --UsdCurrency

// TODO
// убрать из текстового файла настройки цен, сделать бэкапы списка вещей и инструмент создания списка вещей(редактирование, удаление, добавление)
// Добавить в проверку критерия совпадения лота проверку на категорию вещи
// Нужно хранить категории вещей и редактировать категории вещей (изначально TF2 CSGO DOTA2 STEAM)
// Нужно хранить курс бакса и поддерживать в актуальном состоянии
// Дату последнего обновления цен

//Shadow (Profile Background)

//Изменить параметры вещи с каким-либо именем
function setItemDescriptionByName(name, cat, price, avail){
	chrome.storage.local.get('SteamTrader',function(result) {
		var a = result;
		
		var b = result.AllItems;
		
		// берем список
		for(var i = 0; i < b.length; i++){
			if(b[i].name == name){
				b[i].minPrice = price;
				b[i].category = cat;
				b[i].isActive = avail;
			}
		}
		
		a.AllItems = b;
		
		chrome.storage.local.set(a);
	});
}

//добавить вещь в список
function saveItemDescription(name, cat, price){
	chrome.storage.local.get('AllItemsDictionary',function(result) {
		var a = result.AllItemsDictionary;
		// берем список
		var isIn = false;
		for(var i = 0; i < a.length; i++){
			if(a[i].name == name && a[i].category == cat){
				a[i].minPrice = price
				isIn = true;
			}
		}
		if(!isIn)
			a.push({
				name: name,
				category: cat,
				minPrice: price
			});
		chrome.storage.local.set({
			'AllItemsDictionary' : a
		});
		//clearItemDictionary();
	});
}

//TODO улучшить производительность!
// Функция по сокрытию показу нужных нам вещей по полю поиска
function hideSomeItems(){
	var searchTerm = document.getElementById("searchInput").value.toLowerCase().trim();
	var b = document.getElementById("itemList");
	var cln = b.cloneNode(true);
	var c = cln.getElementsByTagName("tr");
	for(var i = 0; i < c.length; i++){
		var curItem = c[i];
			var d = curItem.getElementsByTagName("td");
			for(var j = 0; j < d.length; j++)
				if(d[j].id.indexOf("name_") != -1){
					var name = d[j].innerText.toLowerCase().trim();
					if(name.indexOf(searchTerm) == -1)
						curItem.style.display = 'none';
					else
						curItem.style.display = 'table-row';
				}
		}
	b.parentNode.replaceChild(cln, b);
}


// отчистить список вещей
function clearItemDictionary(){
		chrome.storage.local.get('SteamTrader',function(result) {
		var d = result;
		d.SteamTrader.AllItems = {};	
		chrome.storage.local.set(d,function(result) {
			alert('Список опусташен');
			document.location.reload(true);
		});
	});
}









































// Выводит список вещей для дальнейшего редактирования.
function pushItemList(el){
	chrome.storage.local.get('SteamTrader',function(result) {
		var a = result.SteamTrader.AllItems;
		console.log(a);
		var ul = document.createElement('ul');
		var i = 0;
		
		for(var name in a){
			var tr = document.createElement('tr');
			tr.setAttribute('id', 'el_' + i);
			
			
			var idDiv =  document.createElement('td');
			idDiv.setAttribute('id', 'id_' + i);
			idDiv.appendChild(document.createTextNode(i + 1));
			tr.appendChild(idDiv);
			
			
			var nameDiv =  document.createElement('td');
			nameDiv.setAttribute('id', 'name_' + i);
			nameDiv.appendChild(document.createTextNode(name));
			tr.appendChild(nameDiv);
			
			var categoryDiv =  document.createElement('td');
			categoryDiv.setAttribute('id', 'category_' + i);
			categoryDiv.appendChild(document.createTextNode(a[name].category));
			tr.appendChild(categoryDiv);
			
			
			var priceTd = document.createElement('td');
			var priceInput =  document.createElement('input');
			priceInput.setAttribute('id', 'price_' + i);
			priceInput.setAttribute('type', 'text');
			priceInput.setAttribute('value', a[name].minPrice);
			priceTd.appendChild(priceInput);
			tr.appendChild(priceTd);
			
			
			
			//галочка активности
			
			var activeTd = document.createElement('td');
			var activeInput =  document.createElement('input');
			activeInput.setAttribute('id', 'check_' + i);
			activeInput.setAttribute('type', 'checkbox');
			activeInput.checked=a[name].isActive;
			if(a[name].isActive)
				tr.setAttribute('class', 'success');
			else
				tr.setAttribute('class', 'warning');
			activeTd.appendChild(activeInput);
			tr.appendChild(activeTd);
			
			
			
			
			el.appendChild(tr);
		
			i++;
		}
		
		
		//el.appendChild(ul);
	});
}

pushItemList(document.getElementById("itemList"));


/*

// TODO Нужно добавить промт окошечко, спрашивающее нужно ли мне это?
// Восстановит список вещей
function restore_options() {
	
		
	var ItemsDict = [
			{
				name: 'Mann Co. Supply Crate Key',
				price: 70
			},
			{
				name: 'Treasure Key',
				price: 70
			},
			{
				name: 'Dark Treasure Key',
				price: 70
			},
			{
				name: 'RoboCrate Key',
				price: 70
			},
			{
				name: 'Treasure Key of the Malignant Amanita',
				price: 70
			},
			{
				name: 'Genuine AWPer Hand',
				price: 50
			},
			{
				name: 'Salvaged Mann Co. Supply Crate Series #50',
				price: 250
			},
			{
				name: 'Salvaged Mann Co. Supply Crate Series #40',
				price: 300
			},
			{
				name: 'Salvaged Mann Co. Supply Crate Series #30',
				price: 1900
			},
			{
				name: 'Tour of Duty Ticket',
				price: 28
			},
			{
				name: 'Description Tag',
				price: 15
			},
			{
				name: 'Strange Festive Frontier Justice',
				price: 243
			},
			{
				name: 'Genuine King of Scotland Cape',
				price: 17
			},
			{
				name: 'Genuine Smeevil',
				price: 23
			},
			{
				name: 'Vintage Fancy Fedora',
				price: 100
			},
			{
				name: 'Genuine Inky the Hexapus',
				price: 100
			},
			{
				name: 'Vintage Texas Ten Gallon',
				price: 100
			},
			{
				name: 'Genuine Aperture Labs Hard Hat',
				price: 42
			},
			{
				name: "Genuine Conjurer's Cowl",
				price: 50
			},
			{
				name: 'Operation Payback Pass',
				price: 15
			},
			{
				name: 'Genuine Wynchell the Wyrmeleon',
				price: 90
			},
			{
				name: 'Vintage Timebreaker',
				price: 1500
			},
			{
				name: "Vintage Soldier's Stash",
				price: 100
			},
			{
				name: 'Genuine Lacking Moral Fiber Mask',
				price: 60
			},
			{
				name: 'Genuine Shred Alert',
				price: 150
			},
			{
				name: 'Vintage Towering Pillar of Hats',
				price: 100
			},
			{
				name: 'Dragonclaw Hook',
				price: 2900
			},
			{
				name: 'Festive Scattergun',
				price: 160
			},
			{
				name: 'Genuine Quadwrangler',
				price: 91
			},
			{
				name: "Vintage Hustler's Hallmark",
				price: 100
			},
			{
				name: "Vintage Scotsman's Stove Pipe",
				price: 45
			},
			{
				name: 'Genuine Cockfighter',
				price: 80
			},
			{
				name: 'An Extraordinary Abundance of Tinge',
				price: 120
			},
			{
				name: 'Vintage Lugermorph',
				price: 500
			},
			{
				name: 'Genuine Dragonborn Helmet',
				price: 120
			},
			{
				name: 'Genuine Ramnaught of Underwool',
				price: 100
			},
			{
				name: 'Frostivus Gift - Naughty',
				price: 21
			},
			{
				name: 'Golden Greevil',
				price: 185
			},
			{
				name: 'Unusual Essence',
				price: 143
			},
			{
				name: 'Genuine Anger',
				price: 47
			},
			{
				name: 'Frostivus Gift - Nice',
				price: 66
			},
			{
				name: 'Genuine Star Ladder Grillhound',
				price: 100
			},
			{
				name: 'Genuine Killer Exclusive',
				price: 55
			},
			{
				name: 'Festive Rocket Launcher',
				price: 150
			},
			{
				name: 'Strange Part: Headshot Kills',
				price: 180
			},
			{
				name: "Genuine Dashin' Hashshashin",
				price: 260
			},
			{
				name: "Genuine Berserker's Witchslayer",
				price: 400
			},
			{
				name: 'Genuine Ap-Sap',
				price: 400
			},
			{
				name: 'Genuine Buck Turner All-Stars',
				price: 200
			},
			{
				name: 'Strange Festive Grenade Launcher',
				price: 700
			},
			{
				name: 'Strange Festive Buff Banner',
				price: 300
			},
			{
				name: 'Genuine Doublecross-Comm',
				price: 300
			},
			{
				name: 'Genuine Sharp Dresser',
				price: 390
			},
			{
				name: 'Strange Festive Ubersaw',
				price: 250
			},
			{
				name: 'Strange Festive Frontier Justice',
				price: 210
			},
			{
				name: 'Shadow Essence',
				price: 700
			},
			{
				name: "Genuine Bushman's Boonie",
				price: 100
			},
			{
				name: 'Genuine Maul',
				price: 300
			},
			{
				name: 'Vintage Ullapool Caber',
				price: 80
			},
			{
				name: 'Strange Festive Axtinguisher',
				price: 300
			},
			{
				name: 'Strange Diamond Botkiller Scattergun Mk.I',
				price: 330
			},
			{
				name: 'Genuine Kantusa the Script Sword',
				price: 1500
			},
			{
				name: 'Strange Gold Botkiller Knife Mk.I',
				price: 200
			},
			{
				name: 'Strange Bacon Grease',
				price: 460
			},
			{
				name: 'Strange Festive Knife',
				price: 1500
			},
			{
				name: 'Strange Diamond Botkiller Medi Gun Mk.I',
				price: 140
			},
			{
				name: 'Genuine Archimedes',
				price: 350
			},
			{
				name: 'Strange Gold Botkiller Scattergun Mk.II',
				price: 240
			},
			{
				name: 'Strange Festive Sniper Rifle',
				price: 1700
			},
			{
				name: "Vintage Bill's Hat",
				price: 2700
			},
			{
				name: 'The International 2013 Interactive Compendium',
				price: 290
			},
			{
				name: 'Genuine El Jefe',
				price: 400
			},
			{
				name: 'Crystal Maiden & Lina',
				price: 70
			},
			{
				name: 'Genuine Recluse Reef Denizen',
				price: 800
			},
			{
				name: 'Strange Diamond Botkiller Minigun Mk.I',
				price: 220
			},
			{
				name: 'Festive Minigun',
				price: 98
			},
			{
				name: 'Festive Wrench',
				price: 65
			},
			{
				name: 'Strange Gold Botkiller Wrench Mk.II',
				price: 310
			},
			{
				name: 'Strange Diamond Botkiller Knife Mk.I',
				price: 150
			},
			{
				name: 'Genuine Dolfrat and Roshinante',
				price: 710
			},
			{
				name: 'Strange Festive Rocket Launcher',
				price: 2500
			},
			{
				name: 'Strange Festive Stickybomb Launcher',
				price: 1500
			},
			{
				name: 'Vintage Ze Goggles',
				price: 70
			},
			{
				name: 'Strange Festive Bat',
				price: 1300
			},
			{
				name: 'Genuine Chief Constable',
				price: 19
			},
			{
				name: 'Unusual Cluckles the Brave',
				price: 450
			},
			{
				name: 'Unusual Trusty Mountain Yak',
				price: 400
			},
			{
				name: 'Upgrade to Premium Gift',
				price: 140
			},
			{
				name: 'Unusual Lockjaw the Boxhound',
				price: 2000
			},
			{
				name: 'Genuine Original',
				price: 34
			},
			{
				name: 'Genuine Point and Shoot',
				price: 45
			},
			{
				name: 'Gift Wrap',
				price: 50
			},
			{
				name: 'Genuine Area 451',
				price: 25
			},
			{
				name: 'Genuine K-9 Mane',
				price: 10
			},
			{
				name: 'Name Tag',
				price: 22
			},
			{
				name: 'Genuine Purity Fist',
				price: 30
			},
			{
				name: 'The Festive Huntsman',
				price: 44
			},
			{
				name: 'Unusual Enduring War Dog',
				price: 280
			},
			{
				name: "Vintage Troublemaker's Tossle Cap",
				price: 220
			},
			{
				name: 'Genuine Planeswalker Helm',
				price: 21
			},
			{
				name: "Strange Part: Robots Destroyed",
				price: 80
			},
			{
				name: 'Genuine Warsworn Helmet',
				price: 50
			},
			{
				name: 'Team Spirit',
				price: 70
			},
			{
				name: 'Vintage Brigade Helm',
				price: 50
			},
			{
				name: 'DreamHack Dota2 Invitational',
				price: 30
			},
			{
				name: 'Mann Co. Painting Set',
				price: 60
			},
			{
				name: 'Pink as Hell',
				price: 60
			},
			{
				name: 'The Bitter Taste of Defeat and Lime',
				price: 50
			},
			{
				name: 'A Distinctive Lack of Hue',
				price: 130
			},
			{
				name: 'The International 2013 Ticket',
				price: 2000
			},
			{
				name: 'Unusual Drodo the Druffin',
				price: 2000
			},
			{
				name: 'Unusual Lockjaw the Boxhound',
				price: 2000
			},
			{
				name: 'Compendium Taunt Pack',
				price: 15
			},
			{
				name: 'Squad Surplus Voucher',
				price: 30
			},
			{
				name: 'Genuine Noise Maker - Vuvuzela',
				price: 30
			},
			{
				name: "Vintage Demoman's Fro",
				price: 70
			},
			{
				name: "Unusual Stumpy - Nature's Attendant",
				price: 380
			},
			{
				name: 'Genuine Wyvernguard Edge',
				price: 800
			},
			{
				name: 'Unusual Kupu the Metamorpher',
				price: 600
			},
			{
				name: 'Unusual Baby Roshan',
				price: 700
			},
			{
				name: 'Strange Festive Wrench',
				price: 1600
			},
			{
				name: 'Unusual Speed Demon',
				price: 300
			},
			{
				name: 'Unusual Conquistador',
				price: 1300
			},
			{
				name: 'Unusual Nanobalaclava',
				price: 1300
			},
			{
				name: 'Unusual One-Man Army',
				price: 1200
			},
			{
				name: 'Unusual Outdoorsman',
				price: 1200
			},
			{
				name: 'Unusual Reggaelator',
				price: 1200
			},
			{
				name: 'Unusual Hotrod',
				price: 1200
			},
			{
				name: 'Unusual Barnstormer',
				price: 1200
			},
			{
				name: 'Unusual Attendant',
				price: 1200
			},
			{
				name: 'Unusual Birdcage',
				price: 1200
			},
			{
				name: 'Unusual Hermes',
				price: 1200
			},
			{
				name: 'Unusual Executioner',
				price: 1200
			},
			{
				name: 'Unusual Milkman',
				price: 1200
			},
			{
				name: 'Unusual Anger',
				price: 1200
			},
			{
				name: 'Unusual Respectless Robo-Glove',
				price: 1200
			},
			{
				name: 'Unusual Glengarry Bonnet',
				price: 1200
			},
			{
				name: 'Unusual Hound Dog',
				price: 1200
			},
			{
				name: 'Unusual Company Man',
				price: 1200
			},
			{
				name: "Unusual Handyman's Handle",
				price: 1200
			},
			{
				name: 'Unusual Brown Bomber',
				price: 1200
			},
			{
				name: "Unusual Shooter's Sola Topi",
				price: 1200
			},
			{
				name: 'Unusual Furious Fukaamigasa',
				price: 1200
			},
			{
				name: "Unusual Capo's Capper",
				price: 1200
			},
			{
				name: 'Unusual Hard Counter',
				price: 900
			},
			{
				name: "Unusual Officer's Ushanka",
				price: 1200
			},
			{
				name: "Unusual L'Inspecteur",
				price: 1000
			},
			{
				name: 'Unusual Platinum Pickelhaube',
				price: 1200
			},
			{
				name: 'Unusual Bombing Run',
				price: 1200
			},
			{
				name: "Unusual Prince Tavish's Crown",
				price: 1200
			},
			{
				name: 'Unusual Gym Rat',
				price: 1000
			},
			{
				name: 'Unusual Football Helmet',
				price: 1200
			},
			{
				name: "Unusual Batter's Helmet",
				price: 1200
			},
			{
				name: "Unusual Engineer's Cap",
				price: 1200
			},
			{
				name: 'Unusual Stainless Pot',
				price: 1200
			},
			{
				name: "Unusual Chieftain's Challenge",
				price: 1200
			},
			{
				name: "Unusual Copper's Hard Top",
				price: 900
			},
			{
				name: "Unusual Hetman's Headpiece",
				price: 1000
			},
			{
				name: 'Unusual El Jefe',
				price: 1200
			},
			{
				name: 'Unusual Stately Steel Toe',
				price: 1100
			},
			{
				name: 'Unusual Waxy Wayfinder',
				price: 1200
			},
			{
				name: 'Unusual Old Guadalajara',
				price: 1200
			},
			{
				name: "Unusual Magistrate's Mullet",
				price: 1200
			},
			{
				name: 'Unusual Larrikin Robin',
				price: 1200
			},
			{
				name: "Unusual Connoisseur's Cap",
				price: 1200
			},
			{
				name: 'Unusual Whoopee Cap',
				price: 1200
			},
			{
				name: 'Unusual Your Worst Nightmare',
				price: 1200
			},
			{
				name: 'Unusual Mining Light',
				price: 1200
			},
			{
				name: 'Unusual Brain Bucket',
				price: 1000
			},
			{
				name: 'Unusual Détective Noir',
				price: 400
			},
			{
				name: "Unusual Hottie's Hoodie",
				price: 1200
			},
			{
				name: "Unusual Pugilist's Protector",
				price: 900
			},
			{
				name: "Unusual Sergeant's Drill Hat",
				price: 1200
			},
			{
				name: 'Unusual Heavy Duty Rag',
				price: 1000
			},
			{
				name: 'Unusual Brigade Helm',
				price: 1200
			},
			{
				name: 'Unusual Timeless Topper',
				price: 1200
			},
			{
				name: 'Unusual Dead Cone',
				price: 1200
			},
			{
				name: "Unusual Tam O' Shanter",
				price: 1200
			},
			{
				name: "Unusual Jumper's Jeepcap",
				price: 1200
			},
			{
				name: "Unusual Backbiter's Billycock",
				price: 1200
			},
			{
				name: 'Unusual Armored Authority',
				price: 1200
			},
			{
				name: 'Unusual German Gonzila',
				price: 900
			},
			{
				name: "Unusual Demoman's Fro",
				price: 1200
			},
			{
				name: 'Unusual Crocleather Slouch',
				price: 1200
			},
			{
				name: "Unusual Napper's Respite",
				price: 1200
			},
			{
				name: "Unusual Pyro's Beanie",
				price: 1200
			},
			{
				name: 'Unusual Western Wear',
				price: 1200
			},
			{
				name: "Unusual Master's Yellow Belt",
				price: 1200
			},
			{
				name: 'Unusual Samur-Eye',
				price: 1200
			},
			{
				name: 'Unusual Human Cannonball',
				price: 1200
			},
			{
				name: 'Unusual Stout Shako',
				price: 1200
			},
			{
				name: 'Unusual Desert Marauder',
				price: 1200
			},
			{
				name: 'Unusual Janissary Ketche',
				price: 900
			},
			{
				name: "Unusual Tyrant's Helm",
				price: 1200
			},
			{
				name: 'Unusual Defiant Spartan',
				price: 1200
			},
			{
				name: 'Unusual Madame Dixie',
				price: 900
			},
			{
				name: 'Unusual Team Captain',
				price: 1200
			},
			{
				name: "Unusual Swagman's Swatter",
				price: 1200
			},
			{
				name: 'Unusual Soldered Sensei',
				price: 1200
			},
			{
				name: "Unusual Charmer's Chapeau",
				price: 1200
			},
			{
				name: 'Unusual Helmet Without a Home',
				price: 1200
			},
			{
				name: "Unusual Honcho's Headgear",
				price: 1200
			},
			{
				name: "Unusual Surgeon's Stahlhelm",
				price: 1200
			},
			{
				name: "Unusual Ol' Geezer",
				price: 1000
			},
			{
				name: "Unusual Pyromancer's Mask",
				price: 1200
			},
			{
				name: "Unusual Conjurer's Cowl",
				price: 1200
			},
			{
				name: "Unusual Doctor's Sack",
				price: 900
			},
			{
				name: 'Unusual Texas Ten Gallon',
				price: 1200
			},
			{
				name: 'Unusual Big Elfin Deal',
				price: 1200
			},
			{
				name: "Unusual Killer's Kabuto",
				price: 1200
			},
			{
				name: "Unusual Bubble Pipe",
				price: 1200
			},
			{
				name: 'Unusual Familiar Fez',
				price: 1200
			},
			{
				name: "Unusual Grenadier's Softcap",
				price: 1200
			},
			{
				name: "Unusual Troublemaker's Tossle Cap",
				price: 1200
			},
			{
				name: 'Unusual Dread Knot',
				price: 800
			},
			{
				name: 'Unusual Dragonborn Helmet',
				price: 1200
			},
			{
				name: 'Unusual Wraith Wrap',
				price: 1200
			},
			{
				name: "Unusual Ol' Snaggletooth",
				price: 1200
			},
			{
				name: "Unusual Carouser's Capotain",
				price: 900
			},
			{
				name: 'Unusual Grimm Hatte',
				price: 1200
			},
			{
				name: 'Unusual Fruit Shoot',
				price: 1200
			},
			{
				name: "Unusual Tippler's Tricorne",
				price: 900
			},
			{
				name: "Unusual Professional's Panama",
				price: 1200
			},
			{
				name: 'Unusual Towering Pillar of Hats',
				price: 1200
			},
			{
				name: 'Unusual Triboniophorus Tyrannus',
				price: 1200
			},
			{
				name: "Unusual Prancer's Pride",
				price: 900
			},
			{
				name: "Unusual Gentleman's Ushanka",
				price: 1200
			},
			{
				name: 'Unusual Hot Dogger',
				price: 1200
			},
			{
				name: 'Unusual Ze Goggles',
				price: 1200
			},
			{
				name: 'Unusual Exquisite Rack',
				price: 1200
			},
			{
				name: 'Unusual Fancy Fedora',
				price: 1200
			},
			{
				name: 'Unusual Magnificent Mongolian',
				price: 900
			},
			{
				name: 'Unusual Rimmed Raincatcher',
				price: 1100
			},
			{
				name: 'Unusual Little Buddy',
				price: 1100
			},
			{
				name: "Unusual Frenchman's Beret",
				price: 1100
			},
			{
				name: "Unusual Scotsman's Stove Pipe",
				price: 1200
			},
			{
				name: 'Unusual Industrial Festivizer',
				price: 1200
			},
			{
				name: "Unusual Gentleman's Gatsby",
				price: 1200
			},
			{
				name: "Unusual Soldier's Stash",
				price: 1200
			},
			{
				name: 'Unusual A Rather Festive Tree',
				price: 1200
			},
			{
				name: 'Unusual Bonk Helm',
				price: 1200
			},
			{
				name: 'Unusual Private Eye',
				price: 1200
			},
			{
				name: "Unusual Hustler's Hallmark",
				price: 1200
			},
			{
				name: 'Unusual Counterfeit Billycock',
				price: 1100
			},
			{
				name: 'Unusual Prussian Pickelhaube',
				price: 1200
			},
			{
				name: "Unusual Shooter's Tin Topi",
				price: 1200
			},
			{
				name: 'Unusual Scotch Bonnet',
				price: 1200
			},
			{
				name: "Unusual Tough Guy's Toque",
				price: 1200
			},
			{
				name: 'Unusual Killer Exclusive',
				price: 1200
			},
			{
				name: 'Unusual Salty Dog',
				price: 1200
			},
			{
				name: "Unusual Sultan's Ceremonial",
				price: 1200
			},
			{
				name: 'Unusual Buckaroos Hat',
				price: 1000
			},
			{
				name: 'Unusual Noble Amassment of Hats',
				price: 1200
			},
			{
				name: 'Unusual Big Country',
				price: 1200
			},
			{
				name: 'Unusual Flamboyant Flamenco',
				price: 1200
			},
			{
				name: 'Unusual FR-0',
				price: 1200
			},
			{
				name: "Unusual Dr's Dapper Topper",
				price: 1200
			},
			{
				name: 'Unusual Flipped Trilby',
				price: 1200
			},
			{
				name: "Unusual Bloke's Bucket Hat",
				price: 1200
			},
			{
				name: 'Unusual Backwards Ballcap',
				price: 1200
			},
			{
				name: "Unusual Berliner's Bucket Helm",
				price: 1000
			},
			{
				name: 'Unusual Trophy Belt',
				price: 1200
			},
			{
				name: "Unusual Otolaryngologist's Mirror",
				price: 900
			},
			{
				name: 'Unusual Pencil Pusher',
				price: 1000
			},
			{
				name: 'Unusual Respectless Rubber Glove',
				price: 1200
			},
			{
				name: 'Unusual Cosa Nostra Cap',
				price: 1200
			},
			{
				name: "Unusual Medic's Mountain Cap",
				price: 1200
			},
			{
				name: 'Unusual Lucky Shot',
				price: 1200
			},
			{
				name: "Unusual Letch's LED",
				price: 1200
			},
			{
				name: 'Unusual Geisha Boy',
				price: 1000
			},
			{
				name: 'Unusual Plug-In Prospector',
				price: 1200
			},
			{
				name: 'Unusual Bot Dogger',
				price: 1200
			},
			{
				name: 'Unusual Cold Killer',
				price: 1200
			},
			{
				name: 'Unusual Modest Pile of Hat',
				price: 1200
			},
			{
				name: 'Unusual Bolted Bicorne',
				price: 1200
			},
			{
				name: 'Unusual Front Runner',
				price: 1200
			},
			{
				name: 'Unusual Vintage Tyrolean',
				price: 1200
			},
			{
				name: "Unusual Soldier's Slope Scopers",
				price: 1200
			},
			{
				name: 'Unusual Gridiron Guardian',
				price: 1200
			},
			{
				name: 'Unusual Big Chief',
				price: 1200
			},
			{
				name: 'Unusual Hat of Cards',
				price: 1200
			},
			{
				name: "Unusual Crone's Dome",
				price: 1200
			},
			{
				name: 'Unusual Sober Stuntman',
				price: 900
			},
			{
				name: "Unusual Buccaneer's Bicorne",
				price: 1200
			},
			{
				name: "Unusual Vintage Merryweather",
				price: 1200
			},
			{
				name: 'Unusual Metal Slug',
				price: 1200
			},
			{
				name: 'Unusual Hat With No Name',
				price: 1200
			},
			{
				name: 'Unusual Tyrantium Helmet',
				price: 1200
			},
			{
				name: 'Unusual Head Warmer',
				price: 1200
			},
			{
				name: "Unusual Fed-Fightin' Fedora",
				price: 1200
			},
			{
				name: "Unusual Data Mining Light",
				price: 1200
			},
			{
				name: 'Unusual Bunsen Brave',
				price: 1200
			},
			{
				name: 'Unusual Virus Doctor',
				price: 1200
			},
			{
				name: "Unusual Liquidator's Lid",
				price: 1200
			},
			{
				name: 'Unusual Halogen Head Lamp',
				price: 1200
			},
			{
				name: 'Unusual Texas Tin-Gallon',
				price: 1200
			},
			{
				name: 'Unusual Firewall Helmet',
				price: 1200
			},
			{
				name: 'Unusual Broadband Bonnet',
				price: 1200
			},
			{
				name: 'Unusual Electric Escorter',
				price: 1200
			},
			{
				name: 'Unusual Pure Tin Capotain',
				price: 1200
			},
			{
				name: 'Unusual Bonk Leadwear',
				price: 1200
			},
			{
				name: 'Unusual Tough Stuff Muffs',
				price: 1200
			},
			{
				name: "Unusual Lord Cockswain's Pith Helmet",
				price: 1200
			},
			{
				name: 'Unusual Modest Metal Pile of Scrap',
				price: 1200
			},
			{
				name: "Unusual Safe'n'Sound",
				price: 1200
			},
			{
				name: 'Unusual Ye Olde Baker Boy',
				price: 1200
			},
			{
				name: 'Unusual Bootleg Base Metal Billycock',
				price: 1200
			},
			{
				name: "Unusual Coupe D'isaster",
				price: 900
			},
			{
				name: 'Unusual Noble Nickel Amassment of Hats',
				price: 1200
			},
			{
				name: 'Unusual Voodoo JuJu (Slight Return)',
				price: 1200
			},
			{
				name: 'Unusual Tavish DeGroot Experience',
				price: 1200
			},
			{
				name: "Unusual Na'Vi's Weaselcrow",
				price: 550
			},
			{
				name: 'Unusual Fearless Badger',
				price: 200
			},
			{
				name: 'Unusual Tickled Tegu',
				price: 200
			},
			{
				name: 'Unusual Prismatic Drake',
				price: 350
			},
			{
				name: "Unusual Morok's Mechanical Mediary",
				price: 200
			},
			{
				name: 'Unusual Mighty Boar',
				price: 150
			},
			{
				name: 'Unusual Skip the Delivery Frog',
				price: 300
			},
			{
				name: 'Unusual The Llama Llama',
				price: 600
			},
			{
				name: 'Unusual Porcine Princess Penelope',
				price: 600
			},
			{
				name: 'Unusual Nimble Ben',
				price: 600
			},
			{
				name: 'Tournament Ringblade',
				price: 200
			},
			{
				name: 'Genuine Battlefury',
				price: 2800
			},
			{
				name: 'Genuine Braze the Zonkey',
				price: 480
			},
			{
				name: 'Genuine Bow of the Howling Wind',
				price: 1000
			},
			{
				name: 'Manniversary Package',
				price: 47
			},
			{
				name: 'Dota 2 Booster Pack',
				price: 40
			},
			{
				name: 'Portal 2 Booster Pack',
				price: 30
			},
			{
				name: 'Trine 2 Booster Pack',
				price: 30
			},
			{
				name: 'Borderlands 2 Booster Pack',
				price: 30
			},
			{
				name: 'Faerie Solitaire Booster Pack',
				price: 10
			},
			{
				name: 'They Bleed Pixels Booster Pack',
				price: 20
			},
			{
				name: 'Sanctum 2 Booster Pack',
				price: 20
			},
			{
				name: 'Blocks That Matter Booster Pack',
				price: 4
			},
			{
				name: 'Cubemen 2 Booster Pack',
				price: 4
			},
			{
				name: 'Triple Town Booster Pack',
				price: 20
			},
			{
				name: 'Monaco Booster Pack',
				price: 20
			},
			{
				name: 'Brütal Legend Booster Pack',
				price: 4
			},
			{
				name: 'Offspring Fling! Booster Pack',
				price: 4
			},
			{
				name: 'Anodyne Booster Pack',
				price: 4
			},
			{
				name: 'Magicka Booster Pack',
				price: 4
			},
			{
				name: 'Tower Wars Booster Pack',
				price: 4
			},
			{
				name: 'Zack Zero Booster Pack',
				price: 4
			},
			{
				name: 'Team Fortress 2 Booster Pack',
				price: 4
			},
			{
				name: 'Super Meat Boy Booster Pack',
				price: 30
			},
			{
				name: 'Half-Life 2 Booster Pack',
				price: 4
			},
			{
				name: 'Monster Loves You! Booster Pack',
				price: 20
			},
			{
				name: 'Go Home Dinosaurs! Booster Pack',
				price: 4
			},
			{
				name: 'Really Big Sky Booster Pack',
				price: 4
			},
			{
				name: 'Strike Suit Infinity Booster Pack',
				price: 4
			},
			{
				name: 'Zombie Driver HD Booster Pack',
				price: 4
			},
			{
				name: 'Guns of Icarus Online Booster Pack',
				price: 4
			},
			{
				name: "Don't Starve Booster Pack",
				price: 4
			},
			{
				name: 'Counter-Strike: Global Offensive Booster Pack',
				price: 4
			},
			{
				name: 'A.R.E.S. Booster Pack',
				price: 4
			},
			{
				name: 'Left 4 Dead 2 Booster Pack',
				price: 4
			},
			{
				name: 'Serious Sam 3: BFE Booster Pack',
				price: 4
			},
			{
				name: 'FTL: Faster Than Light Booster Pack',
				price: 4
			},
			{
				name: "Defender's Quest: Valley of the Forgotten Booster Pack",
				price: 4
			},
			{
				name: 'BIT.TRIP Presents... Runner2: Future Legend of Rhythm Alien Booster Pack',
				price: 4
			},
			{
				name: '1... 2... 3... KICK IT! (Drop That Beat Like an Ugly Baby) Booster Pack',
				price: 4
			},
			{
				name: 'Pandora Haze',
				price: 4
			},
			{
				name: 'They Bleed Pixels - Save Sigil',
				price: 4
			},
			{
				name: 'Black Hole',
				price: 4
			},
			{
				name: 'Ruined Cityscape',
				price: 4
			},
			{
				name: 'Paladin (Profile Background)',
				price: 3
			},
			{
				name: 'Shadow (Profile Background)',
				price: 4
			},
			{
				name: "Sithil's Summer Key",
				price: 280
			},
			{
				name: "Vintage Concheror",
				price: 300
			},
			{
				name: 'Owl (Trading Card)',
				price: 8
			},
			{
				name: 'Biker (Trading Card)',
				price: 8
			},
			{
				name: 'Burn (Trading Card)',
				price: 8
			},
			{
				name: 'Rooster',
				price: 8
			},
			{
				name: 'Pig (Trading Card)',
				price: 8
			},
			{
				name: 'Horse (Trading Card)',
				price: 8
			},
			{
				name: "Genuine Hero's Hachimaki",
				price: 40
			},
			{
				name: 'Backpack Expander',
				price: 20
			},
			{
				name: 'Festive Medi Gun',
				price: 90
			},
			{
				name: 'Strange Part: Domination Kills',
				price: 40
			},
			{
				name: "Genuine Merc's Pride Scarf",
				price: 200
			},
			{
				name: 'Strange Festive Huntsman',
				price: 500
			},
			{
				name: 'Strange Festive Medi Gun',
				price: 3000
			},
			{
				name: 'The Immortal Reliquary',
				price: 250
			},
			{
				name: 'International Treasure Key 2013',
				price: 70
			}
			
	];
	
	
	// SteamTrader
	// --AllItems[]
	// ----name
	// ----minPrice
	// ----category
	// ----isActive
	// --MyItems[]
	// ----name
	// ----id
	// ----buyPrice
	// --UsdCurrency
	
	var a = {
		SteamTrader:{
			AllItems: {},
			MyItems: [],
			UsdCurrency: 33
		}
	}
	
	
	for(var i in ItemsDict){
		a.SteamTrader.AllItems[ItemsDict[i].name] = {
			minPrice: ItemsDict[i].price,
			category: "TF2",
			isActive: true
		}
	}


	chrome.storage.local.set(a);
	
	
	
}*/



//document.addEventListener('DOMContentLoaded', restore_options);
document.querySelector('#save').addEventListener('click', save_options);
document.querySelector('#resetList').addEventListener('click', clearItemDictionary);
//document.querySelector('#backup').addEventListener('click', ab);

document.querySelector('#searchInput').addEventListener('keyup', hideSomeItems);
document.querySelector('#searchInput').addEventListener('paste', hideSomeItems);
