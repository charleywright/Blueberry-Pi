const express = require("express")
const shell = require("shelljs");
const app = express();
app.use(express.json());

/*
const raw = exec("ifconfig");
const matches = raw.match(/[a-z0-9]+(?=(: flags=))/gm);
let devices = [];
for(const match of matches)
{
        const start = raw.indexOf(match);
        const end = raw.substring(start).indexOf("\n\n") + start || raw.length() - 1;
        const str = raw.substring(start, end)
        let flags = str.match(/(?<=flags=)[0-9]+<([A-Z]+,?)+./gm)[0];
        const flag = flags.split("<")[0];
        flags = flags.split("<")[1].split(",").map(s => s.replace(">", ""));
        const ipLine = str.split("\n")[1].split(/[ ]+/);
        const ips = {};
        for(let i = 1; i < ipLine.length; i+=2) ips[ipLine[i]] = ipLine[i+1];
        devices.push({ name: match, flag, flags, ips, raw: str })
}
*/

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
