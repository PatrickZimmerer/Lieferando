let products = [];
let descriptions = [];
let prices = [];
let amounts = [];

// Hilfsfunktionen
function getById(id) {
	return document.getElementById(id);
}
//Basket Sticky
window.onscroll = function () {
	let sidebar = getById("sidebar");
	if (window.scrollY > 0) {
		sidebar.style = "top: 0";
	} else {
		sidebar.style = "top: 74px";
	}
};
// Checkt ob der Warenkorb leer/voll ist und rendert den jeweiligen
function checkIfEmpty() {
	if (amounts.length > 0) {
		renderFilledBasket();
	} else {
		renderEmptyBasket();
		getById("mobile-button-container").innerHTML = ``;
	}
}
//     Generiert den HTML Code für den leeren Basket
function generateEmptyBasketHTML() {
	return `
        <div class="basket-empty" id="basket-empty">
        <div>
         <span class="material-icons bag">
            shopping_bag
        </span> 
        </div>
        <h3>Fülle deinen Warenkorb</h3> <br>
        <div>
            <span class="empty">Füge einige leckere Gerichte aus der Speisekarte hinzu und bestelle dein Essen.</span>
        </div>
    </div>
    `;
}
// Rendert den leeren Warenkorb
function renderEmptyBasket() {
	getById("price-calc-container").classList.add("d-none");
	let basketContainer = getById("basket-container");
	basketContainer.innerHTML = generateEmptyBasketHTML();
}

// rendert den vollen Warenkorb
function renderFilledBasket() {
	getById("price-calc-container").classList.remove("d-none");
	let sum = 0;
	let totalsum = 0;
	let basketContainer = getById("basket-container");
	basketContainer.innerHTML = ``;
	for (let i = 0; i < products.length; i++) {
		sum = prices[i] * amounts[i];
		totalsum += sum;
		basketContainer.innerHTML += generateFilledBasketHTML(i, sum);
	}
	totalSum(totalsum);
}
// Generiert den HTML Code für den Basket ( und fügt diesen in die for schleife ein)
function generateFilledBasketHTML(i, sum) {
	const product = products[i];
	const description = descriptions[i];
	return `
    <div class="basket-filled" id="basket-filled">
       <div class="basket-item-container">
          <div class="itemAmount" id="itemAmount"> <b> ${amounts[i]}</b> 
          </div>

          <div class="items" id="items">
              <div class="item-name-price" id="item-name-price">
                  <span><b>${product}</b></span>
                  <span>${sum.toFixed(2).replace(".", ",")}€</span>
               </div>
               <div class="item-description" id="item-description">
                   <span>${description}</span>
                </div>
            <span></span>
            <div class="change" id="change">
                <a href="#">Anmerkung hinzufügen</a>
                <button onclick="decrementAmount(${i})" class="material-icons-outlined remove-add"> remove </button> 
                <button onclick="incrementAmount(${i})" class="material-icons-outlined remove-add"> add </button>
            </div>
        </div>
    </div>
    `;
}

// fügt die gewählten items dem Warenkorb hinzu und rendert diesen
function addToBasket(product, description, price) {
	let index = products.indexOf(product);
	if (index == -1) {
		products.push(product);
		descriptions.push(description);
		prices.push(price);
		amounts.push(1);
	} else {
		amounts[index]++;
	}
	save();
	renderFilledBasket();
}
function incrementAmount(i) {
	amounts[i]++;
	save();
	renderFilledBasket();
}
function decrementAmount(i) {
	if (amounts[i] <= 1) {
		products.splice(i, 1);
		descriptions.splice(i, 1);
		prices.splice(i, 1);
		amounts.splice(i, 1);
		checkIfEmpty();
	} else {
		amounts[i]--;
		renderFilledBasket();
	}
	save();
}
function totalSum(sum) {
	let subtotal = sum;
	let deliverycosts = 2.0;
	let totalPrice = subtotal + deliverycosts;
	getById("price-calc-container").innerHTML = ``;
	getById("price-calc-container").innerHTML += `
        <div class="price-calc" id="price-calc">
            <span>Zwischensumme</span>
            <span>${subtotal.toFixed(2).replace(".", ",")} €</span>
        </div>
        <div class="price-calc" id="price-calc">
            <span>Lieferkosten</span>
            <span>${deliverycosts.toFixed(2).replace(".", ",")} €</span>
        </div>
        <div class="price-calc" id="price-calc">
            <span>Gesamt</span>
            <span>${totalPrice.toFixed(2).replace(".", ",")} €</span>
        </div>
        <div class="pay-container"> 
        <button class="pay" id="pay">Bezahlen (${totalPrice.toFixed(2).replace(".", ",")}€)</button>
        </div>
        `;
	getById("mobile-button-container").innerHTML = ``;
	getById("mobile-button-container").innerHTML += `
        <button onclick="window.location.href = 'mobile-cart.html';" class="mobile-button"> Warenkorb (${totalPrice
					.toFixed(2)
					.replace(".", ",")}€) </button>`;
}
function showMobileBasket() {}
// Wandelt die Arrays zu text um um sie im localStorage zu speichern
function save() {
	let productsAsText = JSON.stringify(products);
	let descriptionsAsText = JSON.stringify(descriptions);
	let pricesAsText = JSON.stringify(prices);
	let amountsAsText = JSON.stringify(amounts);
	localStorage.setItem("products", productsAsText);
	localStorage.setItem("descriptions", descriptionsAsText);
	localStorage.setItem("prices", pricesAsText);
	localStorage.setItem("amounts", amountsAsText);
}
// Wandelt die ArraysAsText wieder zu Arrays um und checkt dann ob diese leer sind
function load() {
	let productsAsText = localStorage.getItem("products");
	let descriptionsAsText = localStorage.getItem("descriptions");
	let pricesAsText = localStorage.getItem("prices");
	let amountsAsText = localStorage.getItem("amounts");
	if (productsAsText) {
		products = JSON.parse(productsAsText);
		descriptions = JSON.parse(descriptionsAsText);
		prices = JSON.parse(pricesAsText);
		amounts = JSON.parse(amountsAsText);
	}
	checkIfEmpty();
}
