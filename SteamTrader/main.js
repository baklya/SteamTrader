function doSubmit() {
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "http://steamcommunity.com/market/", true);
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			// JSON.parse does not evaluate the attacker's scripts.
			//var resp = JSON.parse(xhr.responseText);

			//console.log(xhr.responseText);
			
			var str = xhr.responseText.substring(xhr.responseText.indexOf("g_rgListingInfo = ") + "g_rgListingInfo = ".length, xhr.responseText.indexOf("var g_rgRecents = {"));
			var listingInfo = JSON.parse(str.trim());

			str = xhr.responseText.substring(xhr.responseText.indexOf("g_rgAssets = ") + "g_rgAssets = ".length, xhr.responseText.indexOf("var g_rgCurrency = []")).trim();
			var assets = JSON.parse(str.substring(0, str.length - 1));
			
			// TODO создать массив обектов, в которых будет только нужная мне инфа, название, appid, цена + инфа для совершения покупки еще не знаю что нужно
			
			var items = [];

			for(var i in listingInfo){
				var item = {
					listingid: 0,
					name: "",
					price: 0,
					appid: 0
				};
				item.listingid = listingInfo[i].listingid;
				item.appid = listingInfo[i].asset.appid;
				item.price = (listingInfo[i].converted_price + listingInfo[i].converted_fee) / 100;
				item.name = assets[listingInfo[i].asset.appid][listingInfo[i].asset.contextid][listingInfo[i].asset.id].name;

				items.push(item);
			}
				
			console.log(items);
			
			// проходим и сравниваем 
			
			

		  }
	}
	xhr.send();
	return false;
}


function addButtonToFrame(){
	var a = document.createElement('button');
	
	console.log(window.frames[0])
	
	//document.getElementById('BG_top').appendChild(a);
	
	
}




function buyItem(){

	var listingid = "2326392719427338410";

	var params = "sessionid=NTc4NTY0NDE5&currency=5&subtotal=1&fee=2&total=3";
	
	var xhr = new XMLHttpRequest();
	
	xhr.open("POST", "http://steamcommunity.com/market/buylisting/" + listingid, true);
	
	//Send the proper header information along with the request
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=UTF-8");
	xhr.setRequestHeader("Accept", "text/javascript, text/html, application/xml, text/xml, */*");
	

	xhr.setRequestHeader("X-Prototype-Version", "1.7");
	xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");

	//sessionid=NTc4NTY0NDE5&currency=5&subtotal=1&fee=2&total=3
	
	xhr.onreadystatechange = function() {
		//if (xhr.readyState == 4) {
			console.log(xhr);
		
		
		//}
	}
	xhr.send(params);
	return false;
}


function buyItem2(){
	var listingid = "2325267206137695233";
	new Ajax.Request( 'http://steamcommunity.com/market/buylisting/' + listingid, {
		method: 'post',
		parameters: {
			sessionid: "MTUxOTI5NzA1MQ==",
			currency: 5,
			subtotal: 1,
			fee: 2,
			total: 3
		},
		onSuccess: function( transport ) { console.log( transport ); },
		onFailure: function( transport ) { console.log( transport ); }
	} );


}






document.querySelector('#get').addEventListener('click', doSubmit);
document.querySelector('#buyitem').addEventListener('click', buyItem2);

document.querySelector('#addbutton').addEventListener('click', addButtonToFrame);
