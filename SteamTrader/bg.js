//setTimeout(reloadPage, 7000);
//document.write("<div id='main'></div>");
//var main = document.getElementById('main');
		
//addButton(main, 'getItems', 'get items list');

//document.querySelector('#getItems').addEventListener('click', mainCycle);

var curUrl = window.location.href;

console.log(curUrl);


mainCycle();


function addButton(elem,id,text){
	var b = document.createElement('button');
	b.setAttribute('id', id);
	b.setAttribute('class', 'btn btn-success');
	
	b.appendChild(document.createTextNode(text));
	elem.appendChild(b);
}

// Выполняем запрос к страничке со списком вещей, получаем из нее данные
// Анализируем полученные данные и производим какие-то действия с ними
function mainCycle(){
		
	new Ajax.Request( curUrl, {
		method: 'get',
		onSuccess: function( transport ) {
			var walletInfo = JSON.parse(/g_rgWalletInfo\s+=\s+(.+);?\s/.exec(transport.responseText)[1].replace(';',''));

			//console.log(walletInfo);

			// проверка баланса, если он больше определенной суммы, то продолжаем процесс поиска и покупки товара
			if(walletInfo.wallet_balance / 100 > 7000){
				var sessionID = /g_sessionID\s+=\s+"(.+)";?\s/.exec(transport.responseText)[1].replace(';','');
				var listingInfo = JSON.parse(/g_rgListingInfo\s+=\s+(.+);?\s/.exec(transport.responseText)[1].replace(';',''));
				var assets = JSON.parse(/g_rgAssets\s+=\s+(.+);?\s/.exec(transport.responseText)[1].replace(';',''));

				// TODO создать массив обектов, в которых будет только нужная мне инфа, название, appid, цена + инфа для совершения покупки еще не знаю что нужно
					
				//console.log(assets);
					
					
				var items = [];


				
				for(var i in listingInfo){
					var item = {
						listingid: 0,
						name: "",
						subtotal: 0,
						fee: 0,
						total: 0,
						appid: 0,
						assetId: 0,
						contextId: 0,
						type: ""
					};
					item.listingid = listingInfo[i].listingid;
					item.appid = listingInfo[i].asset.appid;
						
					item.assetId = listingInfo[i].asset.id;
					item.contextId = listingInfo[i].asset.contextid;
					
					item.subtotal = listingInfo[i].converted_price;
						
					item.fee = listingInfo[i].converted_fee;
						
					item.total = (listingInfo[i].converted_price + listingInfo[i].converted_fee);
					
					item.type = assets[listingInfo[i].asset.appid][listingInfo[i].asset.contextid][listingInfo[i].asset.id].type;
					item.name = assets[listingInfo[i].asset.appid][listingInfo[i].asset.contextid][listingInfo[i].asset.id].market_hash_name;

					items.push(item);
				}
						
				//console.log(items);
					
					
				// нужно переосмыслить данное
				chrome.storage.local.get('SteamTrader',function(result) {
					var a = result.SteamTrader.AllItems;

					//console.log(items);
					for (var i = 0; i < items.length; i++) {
						if(f = a[items[i].name]){ // значит у нас есть в списке такой элемент
							//console.log(items[i].appid + ':' + f.category );
							if(items[i].total && f.isActive && items[i].appid == f.category){
								// тут расчитываем отклонение
								var rate = Math.round(((items[i].total / 100) - f.minPrice) / f.minPrice * 10000)/100;
								//console.log(items[i].name + ':' + (items[i].total / 100) + ' ' + f.minPrice + ' ' + rate );
								if(rate < -34){
									// Тут покупаем данный товар
									buyItem2(items[i], sessionID);
									//console.log(items[i].total + ' ' + f.minPrice + ' ' + rate );
								}
							
							}
						}
						else{
							// Тут получается что в словаре нет данного элемента
							
							if( items[i].name.indexOf("Battle Bonus") === -1){
								getCurrentMinPrice(items[i].appid, items[i].name, items[i].type);
							}
							
						}
					}
				});
			}
			//console.log(1);	
	
		},
		onFailure: function( transport ) {
			console.log(0);
		},
		onComplete: function() {
			setTimeout(mainCycle, 300 + Math.random() * 300);
		}
	});
	
	
	
}

// Получить минимальную цену товара
function getCurrentMinPrice(appid, itemName, itemType) {
	//console.log(itemName);
	new Ajax.Request( 'http://steamcommunity.com/market/listings/' + appid + '/' + itemName, {
		method: 'get',
		onSuccess: function( transport ) {
			var listingInfo = JSON.parse(/g_rgListingInfo\s+=\s+(.+);?\s/.exec(transport.responseText)[1].replace(';',''));
			var line = JSON.parse(/line1\s?=\s?(.+);\s/.exec(transport.responseText)[1].replace(';',''));
			var prices = [];
				
			if(listingInfo.length === undefined){
				for(var i in listingInfo){
					prices.push(listingInfo[i].converted_price + listingInfo[i].converted_fee);
				}
			}
			// считаем среднее арифметическое за месяц 30 последних
			var s = 0;
			var p = 0;
			if(line.length >= 140){
				for(var j = line.length - 1; j > line.length - 51; j--){
					p += parseInt(line[j][2], 10);
					s += line[j][1] * parseInt(line[j][2], 10);
					
				}
				prices.push(Math.floor(s/p) * 100);
			}
			
			var minp = Math.floor(Math.min.apply(null, prices) / 100);
			
			if(!isFinite(minp) || minp < 15 || line.length < 140){
				minp = 0;
			}
			chrome.storage.local.get('SteamTrader',function(result) {
				var d = result;
				d.SteamTrader.AllItems[itemName] = {
					minPrice: minp,
					category: appid,
					isActive: !(minp === 0 || itemName.indexOf("Unusual ") !== -1 || itemName.indexOf("Tournament ") !== -1 || itemType.indexOf("Profile Background") !== -1 || itemType.indexOf("Trading Card") !== -1 || itemType.indexOf("Emoticon") !== -1 || itemType.indexOf("Booster Pack") !== -1 )
				}
				chrome.storage.local.set(d,function() {
				});
			});
		},
		onFailure: function( transport ) {
			console.log(0);
		},
		onComplete: function() {
			//setTimeout(mainCycle, 200 + Math.random() * 300);
		}
	});
}

















function buyItem2(item, session){
	new Ajax.Request( 'http://steamcommunity.com/market/buylisting/' + item.listingid, {
		method: 'post',
		parameters: {
			sessionid: session,
			currency: 5,
			subtotal: item.subtotal,
			fee: item.fee,
			total: item.total
		},
		// как только купили вещь, то пытаемся ее продать с небольшой задержкой в секунд 40-90
		onSuccess: function( transport ) { 
			
			
			
			sellItem(item, session);
			
			
			//console.log('купили вещь: ' + item.name + ' ' + item.assetId ); 
		},
		onFailure: function( transport ) { 
			console.log(transport);
			console.log('не купили вещь: ' + item.name + ' за ' + (item.total / 100)); 
		}
	});
}


function sellItem(item, session){
	//http://steamcommunity.com/market/sellitem/ 
	function sellIt(){
	
		new Ajax.Request( 'http://steamcommunity.com/market/listings/' + item.appid + '/' + item.name, {
			method: 'get',
			onSuccess: function( transport ) {
				
				var listingInfo = JSON.parse(/g_rgListingInfo\s+=\s+(.+);?\s/.exec(transport.responseText)[1].replace(';',''));
				var prices = [];
					
				console.log(listingInfo);	
				
				if(listingInfo.length === undefined){
					for(var i in listingInfo){
						prices.push(listingInfo[i].converted_price);
					}
				}

		
		
				//должен быть запуск через некоторое время!
				//var minp = Math.floor(Math.min.apply(null, prices) - 67 - Math.random() * 59);
				
				
				
				if(!isFinite(minp) || minp < 1500){
					minp = 0;
				}
				console.log('определяем цену товара ' + item.name + ' ' + minp);
				
				// тут мы нашли минимальную цену товара
				// нужно сравнить эту цену с ценой товара и если что поправить цену в списке товара
				if(item.name.indexOf("Unusual ") === -1)
				{
					console.log('пробуем сменить цену');
					chrome.storage.local.get('SteamTrader',function(result) {
						var d = result;
						d.SteamTrader.AllItems[item.name] = {
							minPrice: Math.floor(1.15 * minp / 100),
							category: item.appid,
							isActive: true
						}
						chrome.storage.local.set(d,function() {
							console.log('сменили цену');
						});
					});
				}


				/*
				// Продаем по минимальной - 96 копеек
				new Ajax.Request( 'http://steamcommunity.com/market/sellitem/', {
					method: 'post',
					parameters: {
						sessionid: session,
						appid: item.appid,
						contextid: item.contextId,
						assetid: item.assetId,
						amount: 1,
						price: minp
					},
					// как только купили вещь, то пытаемся ее продать с небольшой задержкой в секунд 40-90
					onSuccess: function( transport ) { 
						//console.log('купили вещь: ' + item.name + ' за ' + (item.total / 100)); 
					},
					onFailure: function( transport ) { 
						setTimeout(sellIt, 45000 + Math.random() * 45000);
						console.log(transport); 
					}
				});
				*/
			},
			onFailure: function( transport ) {
				console.log(0);
			},
			onComplete: function() {
				//setTimeout(mainCycle, 200 + Math.random() * 300);
			}
		});
	}
	
	
	setTimeout(sellIt, 5000 + Math.random() * 5000);
	
	
	
	
	
	
	
	
	
	
	
	
	
}





