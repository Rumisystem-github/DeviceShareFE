let ws = null;

async function ConnectStreamingAPI() {
	return new Promise((resolve, reject) => {
		let PingTimer = null;
		ws = new WebSocket("/api/ws");

		ws.addEventListener("open", (e)=>{
			RunStreamingCommand(["HELO", "TOKEN", session]).then((Return)=>{
				if (Return.STATUS) {
					//成功応答
					resolve();
				} else {
					//失敗応答
					reject();
				}
			});
		});

		ws.addEventListener("message", async (e)=>{
			const body = JSON.parse(e.data);
			if (body.TYPE != null) {
				if (body.TYPE == "UPDATE") {

				}
			}
		});

		ws.addEventListener("close", (e)=>{
			console.log("切断されました");
			//初期化
			clearInterval(PingTimer);
			//再接続処理
			ConnectStreamingAPI();
		});
	})
}

async function RunStreamingCommand(cmd) {
	return new Promise((resolve, reject) => {
		const id = self.crypto.randomUUID();

		function Receive(e) {
			const body = JSON.parse(e.data);
			if (body.REQUEST == id) {
				resolve(body);
				ws.removeEventListener("message", Receive);
			}
		}

		ws.addEventListener("message", Receive);
		ws.send(JSON.stringify([id].concat(cmd)));
	})
}