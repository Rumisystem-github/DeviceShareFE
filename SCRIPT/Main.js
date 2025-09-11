const ACCOUNT_API = "https://account.rumiserver.com/api/";
const LOGIN_PAGE = "https://account.rumiserver.com/Login?rd=deviceshare";

let session = null;
let account_data = null;
let device_list = [];

let el = {
	SELF: {
		DEVICE_LIST: document.getElementById("SELF_DEVICE_LIST")
	}
};

//読込完了
window.addEventListener("load", (E) => {
	main();
});

async function main() {
	session = ReadCOOKIE().SESSION;
	if (session !== null) {
		account_data = await LOGIN(session);
		if (account_data === false) {
			window.location.href = LOGIN_PAGE;
		}

		device_list = await get_self_device_list();
		for (let i = 0; i < device_list.length; i++) {
			const item = device_list[i];
			const info = await get_device_info(item.ID);
			el.SELF.DEVICE_LIST.appendChild(await genui_device_item(item, info));
		}
	}

	await ConnectStreamingAPI();
}