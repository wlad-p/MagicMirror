const NodeHelper = require("node_helper");
var XMLHttpRequest = require("xhr2");

module.exports = NodeHelper.create({
	start: function(){
		console.log("ALO");
	},
	socketNotificationReceived: function(notification, payload){
		switch(notification){
			case "getPrices":
				//ARAL
				getPrice("https://creativecommons.tankerkoenig.de/json/detail.php?id=ad998a78-cd36-4a61-9ff1-cfcaca65fb3b&apikey=e30a33aa-a0ca-c17d-985d-769bd55d7c0d")
				.then(e5 => this.sendSocketNotification("aral", e5))
				.catch(error => console.error(error));

                                //JET
                                getPrice("https://creativecommons.tankerkoenig.de/json/detail.php?id=51d4b671-a095-1aa0-e100-80009459e03a&apikey=e30a33aa-a0ca-c17d-985d-769bd55d7c0d")
                                .then(e5 => this.sendSocketNotification("jet", e5))
                                .catch(error => console.error(error));

                                //ESSO
                                getPrice("https://creativecommons.tankerkoenig.de/json/detail.php?id=39ea5b14-7902-4fd1-9869-ab12ef87b38e&apikey=e30a33aa-a0ca-c17d-985d-769bd55d7c0d")
				.then(e5 => this.sendSocketNotification("esso", e5))
                                .catch(error => console.error(error));

                                //TOTAL
                                getPrice("https://creativecommons.tankerkoenig.de/json/detail.php?id=881ec217-9441-4e75-ae8b-6f2ef64cbc16&apikey=e30a33aa-a0ca-c17d-985d-769bd55d7c0d")
                                .then(e5 => this.sendSocketNotification("total", e5))
                                .catch(error => console.error(error)); 
				break

                }
	}
});

function getPrice (url){
	var xhr = new XMLHttpRequest();
	xhr.open('GET', url, true);
	return new Promise((resolve, reject) => {
		xhr.onload = function(){
		if(xhr.status === 200){
			const response = JSON.parse(xhr.responseText);
			resolve(response.station.e5);
		}
		else {
			reject("NOT FOUND");
		}
	};

	xhr.onerror = function() {
	reject(xhr.statusText);
	};
	xhr.send();
	});
}
