function html_to_dom(html) {
	const parser = new DOMParser();
	const doc = parser.parseFromString(html, "text/html");
	const item = doc.body.firstElementChild;

	return item;
}

async function genui_device_item(device) {
	return html_to_dom(`
		<DIV CLASS="DEVICE_ITEM" data-id="${device.ID}">
			<IMG SRC="">
			<DIV>${htmlspecialchars(device.NAME)}</DIV>
			<DIV>登録日時:${htmlspecialchars(device.DATE)}</DIV>
			<DIV>更新日時:${htmlspecialchars(device.UPDATE)}</DIV>
			<DIV>${JSON.stringify(await get_device_info(device.ID))}</DIV>
		</DIV>
	`);
}