$(document).ready(async function() {
	const data = await execQuery("SELECT * FROM customer");
	console.log(data);
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
			body: JSON.stringify({ query: query })
		});

		const responseBody = await response.json();
		console.log(responseBody);
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
