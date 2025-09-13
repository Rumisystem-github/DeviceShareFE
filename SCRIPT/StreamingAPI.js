let ws = null;

async function ConnectStreamingAPI() {
	return new Promise((resolve, reject) => {
		let PingTimer = null;
		ws = new WebSocket("/api/ws");

		ws.addEventListener("open", (e)=>{
			if (window.location.pathname.startsWith("/user/")) {
				get_account_from_uid(window.location.pathname.replace("/user/", "")).then((user)=>{
					//他のユーザーのデバイス用に接続する
					RunStreamingCommand(["HELO", "USER", user.ID]).then((Return)=>{
						if (Return.STATUS) {
							//成功応答
							resolve();
						} else {
							//失敗応答
							reject();
						}
					});
				});
			} else {
				//ログイン(自分のデバイス用に接続する)
				RunStreamingCommand(["HELO", "TOKEN", session]).then((Return)=>{
					if (Return.STATUS) {
						//成功応答
						resolve();
					} else {
						//失敗応答
						reject();
					}
				});
			}
		});

		ws.addEventListener("message", async (e)=>{
			const body = JSON.parse(e.data);
			if (body.TYPE != null) {
				if (body.TYPE == "UPDATE") {
					const device_el = document.querySelector(`[data-id="${body.DEVICE}"]`);
					if (device_el == null) return;
					const info_el = device_el.querySelector(".INFO");
					if (info_el == null) return;
					let contents = info_el.querySelector(`.INFO_CONTENTS[data-type="${body.INFO.TYPE}"`);
					if (contents == null) return;

					//値をパース
					let value = {};
					body.INFO.VALUE.split("\n").forEach(line => {
						const k = line.split("=")[0];
						const v = line.split("=")[1];
						value[k] = v;
					});

					switch (body.INFO.TYPE) {
						case "CPU_USE":
							contents.innerHTML = genui_device_info_cpuuse(value["CPU"]);
							return;
						case "MEMORY":
							contents.innerHTML = genui_device_info_memory(Number.parseInt(value["MAX"]), Number.parseInt(value["USE"]));
							return;
					}
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