async function get_account(ID) {
	let AJAX = await fetch(ACCOUNT_API + "User?ID=" + ID + "&SERVICE=RUMICHAT", {
		method: "GET",
		headers: {
			TOKEN: session
		},
		cache: "no-store"
	});

	const RESULT = await AJAX.json();
	if (RESULT.STATUS) {
		return RESULT.ACCOUNT;
	} else {
		throw new Error(RESULT.ERR);
	}
}
async function get_account_from_uid(UID) {
	let AJAX = await fetch(ACCOUNT_API + "User?UID=" + UID + "&SERVICE=RUMICHAT", {
		method: "GET",
		headers: {
			TOKEN: session
		},
		cache: "no-store"
	});

	const RESULT = await AJAX.json();
	if (RESULT.STATUS) {
		return RESULT.ACCOUNT;
	} else {
		throw new Error(RESULT.ERR);
	}
}

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

async function get_public_device_list(uid) {
	let ajax = await fetch("/api/Device/Public?UID=" + uid);
	const result = await ajax.json();
	if (result.STATUS) {
		return result.LIST;
	} else {
		throw new Error("APIError:" + result.ERR);
	}
}