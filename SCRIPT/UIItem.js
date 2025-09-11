function html_to_dom(html) {
	const parser = new DOMParser();
	const doc = parser.parseFromString(html, "text/html");
	const item = doc.body.firstElementChild;

	return item;
}

async function genui_device_item(device, info) {
	return html_to_dom(`
		<DIV CLASS="DEVICE_ITEM" data-id="${device.ID}">
			<IMG SRC="">
			<DIV>${htmlspecialchars(device.NAME)}</DIV>
			<DIV>登録日時:${htmlspecialchars(device.DATE)}</DIV>
			<DIV>更新日時:${htmlspecialchars(device.UPDATE)}</DIV>
			<DIV>
				${function(){
					let body = "";
					const key_list = Object.keys(info);
					for (let i = 0; i < key_list.length; i++) {
						const key = key_list[i];
						const field = info[key];

						switch (key) {
							case "CPU_USE":
								body += `<DIV>CPU:(${field["CPU"]}%)<PROGRESS MIN="0" MAX="100" VALUE="${field["CPU"]}"></PROGRESS><DIV>`;
								break;
							case "MEMORY":
								body += `<DIV>RAM:(${format_byte(Number.parseInt(field["MAX"]))}/${format_byte(Number.parseInt(field["USE"]))})<PROGRESS MIN="0" MAX="${field["MAX"]}" VALUE="${field["USE"]}"></PROGRESS><DIV>`;
								break;
						}
					}
					return body;
				}()}
			</DIV>
		</DIV>
	`);
}

function format_byte(byte) {
	if (byte < 1024) {
		return byte + " B";
	} else if (byte < 1024 ** 2) {
		return (byte / 1024).toFixed(2) + " KB";
	} else if (byte < 1024 ** 3) {
		return (byte / 1024 ** 2).toFixed(2) + " MB";
	} else {
		return (byte / 1024 ** 3).toFixed(2) + " GB";
	}
}