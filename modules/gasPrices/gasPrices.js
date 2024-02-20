Module.register("gasPrices", {

	defaults:{},
	start: function(){
		let self = this;
		this.sendSocketNotification("getPrices",1);
		setInterval( () => {
			this.sendSocketNotification("getPrices", 1);
		}, 1000 * 60 * 5); //Jede Minute
	},
	//HTML
	getDom: function(){
		// Headline
		var element = document.createElement("div")
		element.className="element"
	

		//Create table
		var table = document.createElement("table")

		//images
		for(i=0;i<4;i++)
		{
			var tr = document.createElement("tr")

			for(j=0;j<3;j++)
			{
				if( j == 0){

					var td = document.createElement("td")
					switch(i){
						case 0:
							img = document.createElement("img")
							img.src = "/modules/gasPrices/images/jet-img.png"
							break
						case 1:
							img = document.createElement("img")
							img.src = "/modules/gasPrices/images/aral-img.png"
							break
						case 2:
							img = document.createElement("img")
							img.src = "/modules/gasPrices/images/esso-img.png"
							break
						case 3:
							img = document.createElement("img")
							img.src = "/modules/gasPrices/images/total-img.png"
							break
					}
					td.appendChild(img)
					tr.appendChild(td)

				}
				else if(j==1){
					var td = document.createElement("td")
					switch(i){
						case 0:
							var station = document.createElement("p")
							station.innerHTML = "Wittener Str: "
							stationId="jet"
							break
						case 1:
							var station = document.createElement("p")
							station.innerHTML = "Königsallee: "
							stationId="aral"
							break
						case 2:
							var station = document.createElement("p")
							station.innerHTML = "Brenscheder Str: "
							stationId="esso"
							break
						case 3:
							var station = document.createElement("p")
							station.innerHTML = "Markstr: "
							stationId="total"
							break
						
							
					}
					station.id=stationId
					td.appendChild(station)
					tr.append(td)

				}
				else if(j == 2)
				{
					var td = document.createElement("td")
					switch(i)
					{
						case 0:
							var price = document.createElement("p")
							var priceId = "jetValue"
							break
						case 1:
							var price = document.createElement("p")
							var priceId = "aralValue"	
							break
						case 2:
							var price = document.createElement("p")
							var priceId = "essoValue"
							break
						case 3:
							var price = document.createElement("p")
							var priceId = "totalValue"
							break
					}

					price.id = priceId
					td.appendChild(price)
					tr.append(td)
				}
			}
			
			table.appendChild(tr)

		}

		element.appendChild(table)
		return element
	},
	notificationReceived: function(notification, payload, sender){
		switch(notification){
			case "DOM_OBJECT_CREATED":
				this.sendSocketNotification("getPrices",1)
				break
		}
	},
	socketNotificationReceived(notification, payload){
		switch(notification){
			case "aral":
				var aral = document.getElementById("aralValue")
				let priceAral = parseFloat(payload).toFixed(2)
				aral.innerHTML = priceAral
				break
			case "jet":
                var jet = document.getElementById("jetValue")
				let priceJet= parseFloat(payload).toFixed(2)
                jet.innerHTML = priceJet
				break
            case "esso":
                var esso = document.getElementById("essoValue")
				let priceEsso = parseFloat(payload).toFixed(2)
                esso.innerHTML = priceEsso
                break
            case "total":
            	var total = document.getElementById("totalValue")
				let priceTotal = parseFloat(payload).toFixed(2)
                total.innerHTML = priceTotal
                break

		}
	},
  getStyles: function() {
        return [this.file("gasPrice.css")];
  },

});
