// LAB02 MOD04 - Darryl LeCraw
const express = require("express");
const fs = require("fs").promises;
const app = express();
const PORT = 3000;

// ==============================================================================================
// HELPER FUNCTION TO SIMULATE DELAYS

function simulateDelay(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

// ==============================================================================================
// SIMULATE API CALL WITH CALLBACK

function simulateApiCallback(callback) {
	setTimeout(() => {
		const data = { id: 1, name: "Darryl!" };
		callback(null, data);
	}, 1000);
}

// ==============================================================================================
// SIMULATE API CALL WITH PROMISE

function simulateApiPromise() {
	return new Promise((resolve) => {
		setTimeout(() => {
			const data = { id: 1, name: "Darryl!" };
			resolve(data);
		}, 1000);
	});
}

// ==============================================================================================
// SIMULATE API CALL WITH ASYNC/AWAIT

async function simulateApiAsync() {
	await simulateDelay(1000);
	return { id: 1, name: "Darryl!" };
}

// ===================================================================================
// FAKE LOGIN FLOW FUNCTIONS

function login() {
	console.log("LOGGING IN...");
	return simulateDelay(500).then(() => {
		console.log("LOGIN SUCCESSFUL");
		return { token: "fake-jwt-token" };
	});
}

function fetchData(token) {
	console.log("FETCHING DATA...");
	return simulateDelay(300).then(() => {
		console.log("DATA FETCHED SUCCESSFULLY");
		return { user: "Darryl!", data: "some-data", token };
	});
}

function render(data) {
	console.log("RENDERING DATA...");
	return simulateDelay(200).then(() => {
		console.log("RENDER COMPLETE");
		return `Rendered: ${JSON.stringify(data)}`;
	});
}

// ============================================================================================
// ENDPOINTS WITH ERROR HANDLING

// ROOT ENDPOINT - SHOW AVAILABLE ENDPOINTS
app.get("/", (req, res) => {
	res.send(`
		<h1>LAB02 MOD04 - ASYNC JAVASCRIPT DEMO</h1>
		<h2>AVAILABLE ENDPOINTS:</h2>
		<ul>
			<li><a href="/callback">/callback</a> - CALLBACK DEMO</li>
			<li><a href="/promise">/promise</a> - PROMISE DEMO</li>
			<li><a href="/async">/async</a> - ASYNC/AWAIT DEMO</li>
			<li><a href="/file">/file</a> - FILE READING DEMO</li>
			<li><a href="/chain">/chain</a> - PROMISE CHAINING DEMO</li>
			<li><a href="https://github.com/BossClaw/cpan212-lab02-mod04">GitHub</a> - Lab Source</li>
		</ul>
	`);
});

// CALLBACK ENDPOINT
app.get("/callback", (req, res) => {
	simulateApiCallback((err, data) => {
		if (err) {
			return res.status(500).json({ error: "CALLBACK ERROR OCCURRED" });
		}
		res.json({ message: "CALLBACK SUCCESS", data });
	});
});

// PROMISE ENDPOINT
app.get("/promise", (req, res) => {
	simulateApiPromise()
		.then((data) => {
			res.json({ message: "PROMISE SUCCESS", data });
		})
		.catch((err) => {
			res.status(500).json({ error: "PROMISE ERROR OCCURRED" });
		});
});

// ASYNC/AWAIT ENDPOINT
app.get("/async", async (req, res) => {
	try {
		const data = await simulateApiAsync();
		res.json({ message: "ASYNC SUCCESS", data });
	} catch (err) {
		res.status(500).json({ error: "ASYNC ERROR OCCURRED" });
	}
});

// FILE READING ENDPOINT
app.get("/file", async (req, res) => {
	try {
		// READ PACKAGE.JSON AS EXAMPLE
		const fileContent = await fs.readFile("./package.json", "utf8");
		const parsedContent = JSON.parse(fileContent);
		res.json({ message: "FILE READ SUCCESS", content: parsedContent });
	} catch (err) {
		res.status(500).json({ error: "FILE READ ERROR OCCURRED" });
	}
});

// CHAINED OPERATIONS ENDPOINT
app.get("/chain", (req, res) => {
	login()
		.then((loginResult) => fetchData(loginResult.token))
		.then((userData) => render(userData))
		.then((renderResult) => {
			res.json({
				message: "CHAIN SUCCESS",
				steps: ["Login Complete", "Fetched User Data", "Rendered UI"]
			});
		})
		.catch((err) => {
			res.status(500).json({ error: "CHAIN ERROR OCCURRED" });
		});
});

// =================================================================================
// START SERVER

app.listen(PORT, () => {
	console.log(`SERVER RUNNING ON PORT ${PORT}`);
	console.log("AVAILABLE ENDPOINTS:");
	console.log("  /callback - CALLBACK DEMO");
	console.log("  /promise - PROMISE DEMO");
	console.log("  /async - ASYNC/AWAIT DEMO");
	console.log("  /file - FILE READING DEMO");
	console.log("  /chain - PROMISE CHAINING DEMO");
});
