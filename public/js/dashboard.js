$(document).ready(async function() {
	
	setInterval(() => {
		$(".interest_hkd").text(`$${interestHKD}`);
		$(".interest_usd").text(`$${interestUSD}`);
	}, 3000);


	const username = "Aryak Kumar";
	// Get the user data 
	const userData = (await execQuery(`SELECT * FROM customer WHERE \`info.name\`='${username}'`))[0];
	console.log(userData);

	
	
	
	let currentAccountID;
	let savingAccountID; 

	// Get current account details 
	let savingBalanceHKD = (await execQuery(`SELECT \`balance.hkd\` FROM savings WHERE customer_id='${userData.customer_id}'`))[0];
	console.log(savingBalanceHKD);

	// Get current account details 
	let savingBalanceUSD = (await execQuery(`SELECT \`balance.usd\` FROM savings WHERE customer_id='${userData.customer_id}'`))[0];
	console.log(savingBalanceUSD);


	const interestHKD = Math.round(Number(savingBalanceHKD["balance.hkd"]) * 0.012);
	const interestUSD = Math.round(Number(savingBalanceUSD["balance.usd"]) * 0.012);

	let timerInterval
	Swal.fire({
	title: `Welcome ${userData['info.name']}!`,
	timer: 2000,
	timerProgressBar: true,
	didOpen: () => {
		Swal.showLoading()
		const b = Swal.getHtmlContainer().querySelector('b')
		timerInterval = setInterval(() => {
		b.textContent = Swal.getTimerLeft()
		}, 100)
	},
	willClose: () => {
		clearInterval(timerInterval)
	}
	}).then((result) => {
	/* Read more about handling dismissals below */
	if (result.dismiss === Swal.DismissReason.timer) {
		Swal.fire(
			'Interest Recieved!',
			`Interest Amount Recieved: HK$${interestHKD} & US$${interestUSD}`,
			'success'
		)	
	}
	});
	
	// Get current account details 
	const currentAccountDetails =(await execQuery(`SELECT * FROM current WHERE customer_id='${userData.customer_id}'`))[0];
	savingAccountDetails = (await execQuery(`SELECT * FROM savings WHERE customer_id='${userData.customer_id}'`))[0];

	currentAccountID = currentAccountDetails.account_num;
	savingAccountID = savingAccountDetails.account_num;
	

	let interestQuery = `UPDATE savings SET \`balance.hkd\` = \`balance.hkd\`+${interestHKD}, \`balance.usd\` = \`balance.usd\`+${interestUSD} WHERE customer_id='${userData.customer_id}'`;
	await execQuery(interestQuery);

	console.log(currentAccountDetails);
	console.log(savingAccountDetails);

	const transactionsData = await execQuery(`SELECT * FROM transactions WHERE to_account='${currentAccountDetails.account_num}' OR from_account='${currentAccountDetails.account_num}'`);
	console.log(transactionsData);

	// Get login history 
	const loginHistory = await execQuery(`SELECT * FROM login WHERE customer_id='${userData.customer_id}'`);
	console.log(loginHistory);

	$(".current_balance_hkd").text(`$${currentAccountDetails['balance.hkd']}`);
	$(".savings_balance_hkd").text(`$${savingAccountDetails['balance.hkd']}`);
	$(".current_balance_usd").text(`$${currentAccountDetails['balance.usd']}`);
	$(".savings_balance_usd").text(`$${savingAccountDetails['balance.usd']}`);

	let cardNumber = String(currentAccountDetails.account_num);
	let newString = "";
	
	let i = 0;

	for (let char of cardNumber) {
		if (i % 4 == 0) {
			newString += " ";
		}	
		newString += char;
		i+=1;
	}

	// Render the card info 
	$('.card_holder').text(userData['info.name']);
	$('.card_number').text(newString);

	// Render the transaction data 
	for (let transaction of transactionsData) {	
		
		const date = new Date(transaction.time);
		document.querySelector(".transactions table tbody").innerHTML += `
		<tr>
			<td>${transaction.trans_id}</td>
			<td>${transaction.from_account}</td>
			<td>${transaction.to_account}</td>
			<td>${transaction.amount}</td>
			<td>${transaction.currency.toUpperCase()}</td>
			<td>${date.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td>
			<td>${date.toLocaleTimeString('en-US')}</td>
		</tr>
		`;
	}

	// Render the login data 
	for (let login of loginHistory) {
		const date = new Date(login.time);	
		document.querySelector(".loginhistory table tbody").innerHTML += `
			<tr>
				<td>${date.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td>
				<td>${date.toLocaleTimeString('en-US')}</td>
			</tr>
			`;
	}


	
const retCurrency = () => {
	let amountTag = document.getElementById('amount')
	amountTag.placeholder = document.getElementById('currency').value
}

const togglePaymentDetailsContainer = () => {
	let paymentDetailsContainer = document.getElementById('payment-details-container');
	
	let amount = document.getElementById('amount').value
	let acctNumber = document.getElementById('acct-number').value;

	let paraAmount = document.getElementById('amount-transfer')
	paraAmount.appendChild(document.createTextNode(document.getElementById('currency').value))
	paraAmount.appendChild(document.createTextNode(amount))

	let paraAccountNumber = document.getElementById('account-transfer')
	paraAccountNumber.appendChild(document.createTextNode(acctNumber))
	
	if(paymentDetailsContainer.classList.contains("payment-details-container-hide")) 
	{
		paymentDetailsContainer.classList.remove("payment-details-container-hide")
		paymentDetailsContainer.classList.add("payment-details-container-show")
	}

}

	
$('.confirm-transfer').click(async function() {
	const fromAccountType = $(".from-dropdown").val().toLowerCase();
	const toAccount = $("#acct-number").val();
	const currency = $("#currency").val().toLowerCase();
	const amount = $("#amount").val();

	let fromAccount; 
	
	if (fromAccountType === "savings") {
		fromAccount = savingAccountID;
	} else {
		fromAccount = currentAccountID;
	}

	// Generate the SQL statement 
	let sqlQuery = `INSERT INTO transactions(to_account, from_account, amount, currency, time) VALUES('${fromAccount}', '${toAccount}', '${amount}', '${currency}', '${new Date().toISOString().slice(0, 19).replace('T', ' ')}')`;
	await execQuery(sqlQuery);
	
	Swal.fire(
		'Success!',
		'Transfer is successful!',
		'success'
	)


	// Update the account balances 
	sqlQuery = `UPDATE savings SET \`balance.${currency}\` = \`balance.${currency}\`+${amount} WHERE account_num='${toAccount}'`;
	await execQuery(sqlQuery);
	
	sqlQuery = `UPDATE ${fromAccountType} SET \`balance.${currency}\` = \`balance.${currency}\`-${amount} WHERE account_num='${fromAccount}'`;
	await execQuery(sqlQuery);

	// Get current account details 
	const currentAccountDetails =(await execQuery(`SELECT * FROM current WHERE customer_id='${userData.customer_id}'`))[0];
	const savingAccountDetails = (await execQuery(`SELECT * FROM savings WHERE customer_id='${userData.customer_id}'`))[0];

	console.log(currentAccountDetails);
	console.log(savingAccountDetails);

	
	$(".current_balance_hkd").text(`$${currentAccountDetails['balance.hkd']}`);
	$(".savings_balance_hkd").text(`$${savingAccountDetails['balance.hkd']}`);
	$(".current_balance_usd").text(`$${currentAccountDetails['balance.usd']}`);
	$(".savings_balance_usd").text(`$${savingAccountDetails['balance.usd']}`);
});

$(document).keypress(async (e) => {
	if (e.which === 13) {
		const searchParam = $("#search").val();
		const field = $("#searchBy").val();

		let searchQuery = `SELECT * FROM transactions WHERE ${field} = '${searchParam}'`;
		const data = await execQuery(searchQuery);
		console.log(data);
		
		document.querySelector(".transactions table tbody").innerHTML = "";

		// Render the transaction data 
		for (let transaction of data) {	
			const date = new Date(transaction.time);
			document.querySelector(".transactions table tbody").innerHTML += `
			<tr>
				<td>${transaction.trans_id}</td>
				<td>${transaction.from_account}</td>
				<td>${transaction.to_account}</td>
				<td>${transaction.amount}</td>
				<td>${transaction.currency.toUpperCase()}</td>
				<td>${date.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td>
				<td>${date.toLocaleTimeString('en-US')}</td>
			</tr>
			`;
		}
	}

});

$(".item").click(e => {
    $(".selected").removeClass("selected");
    $(".display-section").removeClass("display-section");
    $(e.target).addClass("selected");
    const text = $(e.target).children('span');
    $('.content-heading').text(text.text());
	const sectionName = `.${text.text().toLowerCase().replace(/\s/g, "")}`;
	if (sectionName == ".transfer") {
		$('.card').css({ "display": "none" });
	} else {
		$('.card').css({ "display": "block" });	
	}
    $(`.${text.text().toLowerCase().replace(/\s/g, "")}`).addClass('display-section');
});

async function execQuery(query) {
	return new Promise(async (resolve, reject) => {
		const response = await fetch("query", {
			method: "POST", 
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ query: query })
		});
		const responseBody = await response.json();
		resolve(JSON.parse(responseBody.data));
	});
}

let displayMenu = false;
const toggleUserMenu = () => {
    let element = document.getElementById('user-menu')
    displayMenu = !displayMenu;
    (displayMenu) ? element.style.display = "none" : element.style.display = "block";
}

$(document).ready(function() {
	//Only needed for the filename of export files.
	//Normally set in the title tag of your page.
	document.title='Simple DataTable';
	// DataTable initialisation
	// $('table').DataTable(
	// 	{
	// 		"dom": '<"dt-buttons"Bf><"clear">lirtp',
	// 		"paging": true,
	// 		"autoWidth": true,
	// 		"buttons": [
	// 			'colvis',
	// 			'copyHtml5',
    //     'csvHtml5',
	// 			'excelHtml5',
    //     'pdfHtml5',
	// 			'print'
	// 		]
	// 	}
	// );
});

});

