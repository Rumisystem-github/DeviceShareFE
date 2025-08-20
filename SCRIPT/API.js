async function get_self_device_list() {
	let ajax = await fetch("/api/Device", {
		headers: {
			TOKEN: session
		}
	});
	const result = await ajax.json();
	if (result.STATUS) {
		return result.LIST;
	} else {
		throw new Error("APIError:" + result.ERR);
	}
}

async function get_device_info(ID) {
	let ajax = await fetch("/api/Device/Data?ID="+ID, {
		headers: {
			TOKEN: session
		}
	});
	const result = await ajax.json();
	if (result.STATUS) {
		return result.DATA;
	} else {
		throw new Error("APIError:" + result.ERR);
	}
}