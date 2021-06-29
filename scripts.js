/************************************************************************************************
 *                                                                                              *
 *                              VARIABLES DECLARATION                                           *
 *                                                                                              *
 ************************************************************************************************/

const destinationCurrencyElement = document.getElementById('destination-currency-input');
const sourceAmountElement = document.getElementById('source-amount');
const conversionResultElement = document.getElementById('result-text');
const conversionHistoryElement = document.getElementById('conversion-history');
const conversionHistoryWrapperElement = document.getElementById('conversion-history-wrapper');
const form = document.getElementById('form');

/************************************************************************************************
 *                                                                                              *
 *                              Constants                                                       *
 *                                                                                              *
 ************************************************************************************************/

const API_KEY = '1cb2afb2356059ed5c5e5ea5251b4fc9';
const FIXER_BASE_API = 'http://data.fixer.io/api/';
const currencyList = [{ "id": "EUR", "label": "Euro"}, {"id": "USD", "label": "United States Dollar"}, {"id": "JPY", "label": "Japanese Yen"}];

/************************************************************************************************
 *                                                                                              *
 *                              Functions                                                       *
 *                                                                                              *
 ************************************************************************************************/

/**
 * Gets latest currency converts the base amount to user selected destination amount.
 * @param {event} event object form element event.
 */
function calculateCurrency(event) {
  const destinationCurrencySymbol = destinationCurrencyElement.value;
  const sourceAmount = sourceAmountElement.value;
  event.preventDefault(); // prevent page reload

  axios.get(`${FIXER_BASE_API}latest?access_key=${API_KEY}`)
    .then(({data: {rates}}) => {
      const result = rates[destinationCurrencySymbol] * sourceAmount;
      const text = `${sourceAmount} Euro is equal to ${result} ${destinationCurrencySymbol}`;
      conversionResultElement.innerHTML = text
      addToHistory(text)
    }).catch(err => {
    conversionResultElement.innerHTML = 'Failed to retrieve the result' + err;
  });
}

/**
 * Stores the test in local history so that it can be retrieved on page reload.
 * @param {String} text Plain string that is display to users on submit
 */
function addToHistory(text) {
  conversionHistoryWrapperElement.style.display = "block";
  conversionHistoryElement.innerHTML += text + '<br/>';
  localStorage.setItem("currency-history", conversionHistoryElement.innerHTML);
}

/**
 * Add currency options to the dropdowns
 */
function renderDropdowns() {
  destinationCurrencyElement.innerHTML = currencyList.reduce((accumulator, {id, label}) =>
    accumulator + `<option value="${id}">${label}</option>`, '');
}

/**
 * Check if any currency history is stored in local storage and show it
 * to the user if true.
 */
function loadHistory() {
  const currencyHistory = localStorage.getItem("currency-history");
  if (currencyHistory) {
    conversionHistoryWrapperElement.style.display = "block";
    conversionHistoryElement.innerHTML = currencyHistory;
  }
}

/**
 * By Default the html input type with humber will accept the characters like -, +, e
 * which are invalid. Following function will disallow users from entering these characters.
 */
function onSourceAmountChange(e) {
  const invalidChars = ["-", "+", "e",];
  invalidChars.includes(e.key) && e.preventDefault()
}

/************************************************************************************************
 *                                                                                              *
 *                              Event Listeners                                                 *
 *                                                                                              *
 ************************************************************************************************/
sourceAmountElement.addEventListener('keydown', onSourceAmountChange);
form.addEventListener("submit", calculateCurrency);

/************************************************************************************************
 *                                                                                              *
 *                    Functions to be called on page load                                       *
 *                                                                                              *
 ************************************************************************************************/
renderDropdowns();
loadHistory();
