Module.register("erinnerung",{

  start : function () {
	console.log("erinnerung wurde gestartet")

  },
  getDom : function () {
	var mainDiv = document.createElement("div");
	var erinnerungText = document.createElement("p");
	erinnerungText.id = "erinnerungText";
	mainDiv.appendChild(erinnerungText);
	return mainDiv;

  },

  notificationReceived : function (notification, payload) {
	if(notification === "CALENDAR_EVENTS"){
		let list = payload
		let now = new Date();
		var text = document.getElementById("erinnerungText");
		if(list[0].startDate < now && list[0].endDate > now){

			text.innerHTML = list[0].title;
			console.log("Hier bin ich richtig\n");
		}
		else {
			text.innerHTML = "";
		}
	}

  },

  getStyles : function () {
	return [this.file("erinnerung.css")]
  },

})
