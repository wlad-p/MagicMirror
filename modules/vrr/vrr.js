
Module.register("vrr", {
  defaults: {},
  start: function () {
	let self = this;
	var loadedU35 = false;
	var loadedSchauli = false;
	var dataRequestU35 = null;
	var dataRequestSchauli = null;
	var counter = 0
	this.getData();
	setInterval( () => {
		self.getData();
		self.updateDom();
	},1000 * 60);
  },
  getData: function () {
	let self = this;

	// Request Oskar-Hoffmann-Str
	let urlU35 = 'https://vrrf.finalrewind.org/Bochum/Waldring/.json?frontend=json&line=U35'
	let retryU35 = true;
	let dataRequestU35 = new XMLHttpRequest();
	dataRequestU35.open("GET",urlU35,true);
	dataRequestU35.onreadystatechange = function() {
	if(this.readyState === 4){
	if(this.status === 200){
		self.processData(JSON.parse(this.response),"U35");
	}else if (this.status === 401) {
	console.log("FEHLER BEIM JSON PARSEN. ERROR 401");
		retryU35 = false;
	} else {
		console.log("COULD NOT LOAD DATA");
	}/* if (retryU35){
		self.updateFahrplan()
		}*/
		}
	}

	// Request Schauspielhaus
	let urlSchauli = "https://vrrf.finalrewind.org/Bochum/Schauspielhaus/.json?frontend=json"
	let retrySchauli = true;

	let dataRequestSchauli = new XMLHttpRequest();
	dataRequestSchauli.open("GET",urlSchauli,true);
	dataRequestSchauli.onreadystatechange = function() {
	if(this.readyState === 4){
        if(this.status === 200){
        self.processData(JSON.parse(this.response),"schauli");
        }else if (this.status === 401) {
        console.log("FEHLER BEIM JSON PARSEN. ERROR 401");
                retrySchauli = false;
        } else {
                console.log("COULD NOT LOAD DATA");
        }/*if (retrySchauli){
		self.updateFahrplan()
	} */

	}
        }
	dataRequestU35.send()
        dataRequestSchauli.send()

  },
  getDom: function() {
	let self = this;
	var mainDiv = document.createElement("div");
	mainDiv.className = "mainDiv";
	mainDiv.appendChild(self.createTableHeader())

	if(self.dataRequestU35 && self.dataRequestSchauli)
	{
		let apiU35 = self.dataRequestU35;
		let apiSchauli = self.dataRequestSchauli;
		var usableResults = self.getUsableResults(apiU35.raw, apiSchauli.raw);
		mainDiv.appendChild(self.createTable(usableResults))
		console.log("ZEITEN: " + usableResults)
	}

	return mainDiv;

  },
  getUsableResults : function (resultsU35, resultsSchauli) {

	let resultsList = []
	let counterHustadt = 0;
	let counterHerne = 0;
	let counterSchauli = 0;

	for(let i =0; i < resultsU35.length; i++)
	{
		let timeLeft = 0;
		timeLeft = this.calcTimeLeft(resultsU35[i].sched_date, resultsU35[i].sched_time)
		if(resultsU35[i].destination === "Bochum Hustadt (TQ)" && timeLeft > 7 && counterHustadt < 2){
			resultsList.push(timeLeft);
			counterHustadt++;
		}
	}

	for(let i =0; i < resultsSchauli.length; i++)
        {
		let timeLeft = 0;
		timeLeft = this.calcTimeLeft(resultsSchauli[i].sched_date, resultsSchauli[i].sched_time)
                if(resultsSchauli[i].destination === "Bochum Schürbankstr." && timeLeft > 8 && counterSchauli < 2){
                        resultsList.push(timeLeft);
                        counterSchauli++;
                }
        }

	for(let i =0; i < resultsU35.length; i++)
        {
		let timeLeft = 0;
		timeLeft = this.calcTimeLeft(resultsU35[i].sched_date, resultsU35[i].sched_time);
                if(resultsU35[i].destination != "Bochum Hustadt (TQ)" && timeLeft > 7 && counterHerne < 2){
                        resultsList.push(timeLeft);
                        counterHerne++;
                }
        }
	return resultsList;

  },

  calcTimeLeft(tag, uhrzeit){
	let dateAndTime = moment(tag + " " + uhrzeit, "DD-MM-YYYY HH:mm");
	let txt = dateAndTime.fromNow(true);
	txt.replace(" minutes", "");
	let remainingMinutes = parseInt(txt);
	return remainingMinutes;
  },

  createTable: function (resultList) {

	let self = this;

	// Tabelle mit Daten erstellen
	var tableMain = document.createElement("table");
	var counterList = 0;

	var bahnList = ['U35','308','U35'];
	var directionList = ['Hustadt','Schürbankstr.','Herne Schloß.'];
	for(let i=0; i < 3; i++){

	var tableRow = document.createElement("tr");

	  for(let j=0; j < 3; j++){
		switch(j){
		case 0:
		var bahnDiv = document.createElement("th");
		bahnDiv.className = "bahnDiv";
		bahnDiv.innerHTML = bahnList[i];
		tableRow.appendChild(bahnDiv);
		break;

		case 1:
		var directionDiv = document.createElement("th");
		directionDiv.className = "directionDiv";
		directionDiv.innerHTML = directionList[i];
		tableRow.appendChild(directionDiv);
		break;

		case 2:
		var timeDiv = document.createElement("th")
		timeDiv.className = "timeDiv";

		var firstDep = document.createElement("div");
		var secondDep = document.createElement("div");
		firstDep.className = "depDiv";
		secondDep.className = "depDiv";

		/* Checking if resultList is not empty */
		if(typeof(resultList[counterList]) === 'number'){
			firstDep.innerHTML = resultList[counterList] + " min";
		}else{
			firstDep.innerHTML = "";
		}
		counterList++;

		if(typeof(resultList[counterList])=== 'number'){
		secondDep.innerHTML = resultList[counterList] + " min";
		}else{
			secondDep.innerHTML = "";
		}

		counterList++;
		timeDiv.appendChild(firstDep);
		timeDiv.appendChild(secondDep);
		tableRow.appendChild(timeDiv);
		break;
		}

	  }
	tableMain.appendChild(tableRow);
	}
	return tableMain;
  },

  createTableHeader: function () {
	var headerDiv = document.createElement("div");
	headerDiv.id = "headerDiv";
	var table = document.createElement("table");

	var tableHead = document.createElement("tr");
	tableHead.className = "tableHead";


	var trainIcon = document.createElement("img");
	trainIcon.src = "/modules/vrr/zug.png"

	var stationIcon = document.createElement("img");
	stationIcon.src = "/modules/vrr/directions.png";
	stationIcon.style.margin = "0px 0px 0px 80px";

	var timeIcon = document.createElement("img");
	timeIcon.src = "/modules/vrr/clock.png";
	timeIcon.style.margin = "0px 0px 0px 140px";

	tableHead.appendChild(trainIcon);
	tableHead.appendChild(stationIcon);
	tableHead.appendChild(timeIcon);

	var lineHoriz = document.createElement("hr");

	table.appendChild(tableHead);
	headerDiv.appendChild(table);
	headerDiv.appendChild(lineHoriz);

	return headerDiv;
  },

  processData: function(data,line){
	if(line === "U35")
	{
	this.dataRequestU35 = data;
	if (this.loadedU35 === false) {
		this.updateDom(1000);
	}
	this.loadedU35  = true;
	}

	else if(line === "schauli"){
		this.dataRequestSchauli = data;
		if (this.loadedSchauli === false){
			this.updateDom(1000);
		}
	this.loadedSchauli = true;
	}
	 else {
		console.log("process Data function does not work!");
	}
  },
  getStyles: function() {
	return [this.file("vrr.css")];
  },
  notificationReceived: function() {},
  socketNotificationReceived: function() {},
})
