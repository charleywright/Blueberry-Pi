const express = require("express")
const shell = require("shelljs");
const app = express();
app.use(express.json());

app.get("/networks", (req, res) => {
	const scan = shell.exec("sudo iwlist wlan0 scan");
	if(scan.indexOf("Cell") === -1) return res.send([]);
	let networks = scan.split("Cell ");
	networks.shift();
	networks = networks.map(n => {
		let obj = {};
		let lines = n.split("\n");
		lines.forEach(line => {
			if(line.trim().length > 0){
				const key = /[a-zA-Z0-9 ()]+(?=(:|=))/.exec(line)[0].trim();
				const value = line.substring(line.indexOf(key) + key.length + 1).replace(/"/g, "").trim();
				if(key === "Quality"){
					obj["Quality"] = value.split(" ")[0];
					obj["Signal level"] = value.split("=")[1]
				} else obj[key] = value;
			}
		})
		return obj;
	})
	return res.send(networks)
})

app.get("/connect", (req, res) => {
	const ssid = shell.exec("iwgetid -r");
	res.send(ssid.length === 0 ? "Not Connected" : ssid.replace(/("|\n)/g, ""));
})

app.get("/", (req, res) => {
	res.send({message: "Home", code: "HOME_URL"});
})

app.listen(3000, () => console.log("Listening on http://192.168.12.1:8080"));
