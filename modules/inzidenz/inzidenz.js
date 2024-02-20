Module.register("inzidenz", {
	defaults:{},
	start: function(){
			let self = this;
			this.sendSocketNotification("getInzidenz",1);
			setInterval( () => {
				this.sendSocketNotification("getInzidenz",1);
			}, 1000 * 60 * 60); // Update jede Stunde
		},
	getDom: function(){
		var element = document.createElement("div")
		element.className="myContent"
		var text = document.createElement("p")
		text.innerHTML = "Inzidenz: "
		text.id="inz"
		element.appendChild(text)
		return element
	},
	notificationReceived: function(notification, payload, sender){
		switch(notification){
		case "DOM_OBJECTS_CREATED":
		this.sendSocketNotification("getInzidenz",1)
		break
		}
	},
	socketNotificationReceived(notification, payload){
		switch(notification){
		case "wert":
		var inzWert = "Bochum Inzidenz: "
		inzWert = inzWert + payload
		console.log("Payload: " + payload + String(payload) + "\n")
		var elem = document.getElementById("inz")
		elem.innerHTML = inzWert
		break
		}
	},
})
