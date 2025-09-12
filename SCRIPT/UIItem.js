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
			<DIV CLASS="NAME">${htmlspecialchars(device.NAME)}</DIV>
			<DIV CLASS="REGIST_DATE">登録日時:${htmlspecialchars(device.DATE)}</DIV>
			<DIV CLASS="UPDATE_DATE">更新日時:${htmlspecialchars(device.UPDATE)}</DIV>
			<DIV CLASS="INFO">
				${function(){
					let body = "";
					const key_list = Object.keys(info);
					for (let i = 0; i < key_list.length; i++) {
						const key = key_list[i];
						const field = info[key];

						switch (key) {
							case "CPU_USE":
								body += `<DIV CLASS="INFO_CONTENTS" data-type="CPU_USE">${genui_device_info_cpuuse(field["CPU"])}</DIV>`;
								break;
							case "MEMORY":
								body += `<DIV CLASS="INFO_CONTENTS" data-type="MEMORY">${genui_device_info_memory(Number.parseInt(field["MAX"]), Number.parseInt(field["USE"]))}<DIV>`;
								break;
						}
					}
					return body;
				}()}
			</DIV>
		</DIV>
	`);
}

function genui_device_info_cpuuse(use) {
	return `CPU:(${use}%)<PROGRESS MIN="0" MAX="100" VALUE="${use}"></PROGRESS>`;
}

function genui_device_info_memory(max, use) {
	return `RAM:(${format_byte(max)}\\${format_byte(use)})<PROGRESS MIN="0" MAX="${max}" VALUE="${use}"></PROGRESS>`;
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