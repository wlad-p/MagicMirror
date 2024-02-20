var NodeHelper = require("node_helper")
const async = require("async")
const puppeteer = require("puppeteer")


module.exports = NodeHelper.create({
	start: function(){
		inzWert = scrapeProduct("https://www.bochum.de/Corona");
		console.log("Node helper startet!")
	},
	socketNotificationReceived:function(notification, payload){
		var self = this
		switch(notification)
		{case "getInzidenz":
			
			scrapeProduct("https://www.bochum.de/Corona").then((rawTxt) => {
			this.sendSocketNotification("wert",rawTxt)})
			
			break
		}
	},
})

async function scrapeProduct(url) {
				try{
				const browser = await puppeteer.launch({
					headless: true,
					executablePath: "/usr/bin/chromium-browser",
					args: ['--no-sandbox','--disable-setuid-sandbox']});
				const page = await browser.newPage();
				await page.goto(url)

				const [el] = await page.$x("/html/body/div[1]/div[4]/div/div/main/div[4]/div/div/ul/li[2]/a/span[1]/text()[2]");
				const txt = await el.getProperty("textContent");
				const rawTxt = await txt.jsonValue();

				console.log("HAT FUNKTIONIERT " + rawTxt + "\n");
				browser.close()
				return rawTxt
				} catch(e) {
					console.log("hat nicht geklappt\n" + e);
					return "ERROR"
					
				}}
