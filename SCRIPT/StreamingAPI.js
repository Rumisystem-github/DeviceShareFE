let WS = null;

async function ConnectStreamingAPI() {
	return new Promise((resolve, reject) => {
		let PingTimer = null;
		WS = new WebSocket("/api/ws");

		WS.addEventListener("open", (e)=>{
			RunStreamingCommand(["HELO", session]).then((Return)=>{
				if (Return.STATUS) {
					//成功応答
					resolve();
				} else {
					//失敗応答
					reject();
				}
			});
		});

		WS.addEventListener("message", async (e)=>{
			const Body = JSON.parse(e.data);
			if (Body.TYPE != null) {
				console.log("受信", Body);
			}
		});

		WS.addEventListener("close", (e)=>{
			console.log("切断されました");
			//初期化
			clearInterval(PingTimer);
			//再接続処理
			ConnectStreamingAPI();
		});
	})
}

async function RunStreamingCommand(CMD) {
	return new Promise((resolve, reject) => {
		const ID = self.crypto.randomUUID();

		function Receive(e) {
			const Body = JSON.parse(e.data);
			if (Body.REQUEST == ID) {
				resolve(Body);
				WS.removeEventListener("message", Receive);
			}
		}

		WS.addEventListener("message", Receive);
		WS.send(JSON.stringify([ID].concat(CMD)));
	})
}