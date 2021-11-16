$(document).ready(async function() {
	const username = localStorage.getItem('username') || "Aryak Kumar";
	// Get the user data 
	const userData = (await execQuery(`SELECT * FROM customer WHERE name='${username}'`))[0];
	console.log(userData);
	
	// Get account data 
	const accountData = await execQuery(`SELECT * FROM accounts WHERE user_id='${userData.customer_id}'`);
	console.log(accountData);

	const transactionsData = await execQuery(`SELECT * FROM transactions WHERE to_account='${accountData[1].account_number}' OR from_account='${accountData[1].account_number}'`);
	console.log(transactionsData);

	// Get login history 
	const loginHistory = await execQuery(`SELECT * FROM login_history WHERE user_id='${userData.customer_id}'`);
	console.log(loginHistory);

	let cardNumber = String(accountData[0].account_number);
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
	$('.card_holder').text(userData.name);
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

	
$('.confirm-transfer').click(async function() {
	const fromAccountType = $(".from-dropdown").val();
	const toAccount = $("#acct-number").val();
	const currency = $("#currency").val();
	const amount = $("#amount").val();

	let fromAccount; 
	for (let data of accountData) {
		console.log(data);
		if (data.account_type === fromAccountType.toLowerCase()) {
			fromAccount = data.account_number;
			break;
		}
	}

	// Generate the SQL statement 
	const sqlQuery = `INSERT INTO transactions VALUES('2', '${fromAccount}', '${toAccount}', '${amount}', '${currency}', '${Date.now()}')`;
	const res = await execQuery(sqlQuery);
	alert("Transfer is successful!");
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

});

