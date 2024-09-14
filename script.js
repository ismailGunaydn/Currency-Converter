const API_URL = "https://open.er-api.com/v6/latest";

// Fetch currency options from the API and populate dropdowns
async function fetchCurrencies() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        const currencies = Object.keys(data.rates);

        const fromCurrencySelect = document.getElementById("fromCurrency");
        const toCurrencySelect = document.getElementById("toCurrency");

        currencies.forEach(currency => {
            const option = new Option(currency, currency);
            fromCurrencySelect.add(option.cloneNode(true));
            toCurrencySelect.add(option);
        });
    } catch (error) {
        console.error("Error fetching currencies:", error);
    }
}

// Convert currency based on user input
async function convert() {
    const amount = parseFloat(document.getElementById("amount").value);
    const fromCurrency = document.getElementById("fromCurrency").value;
    const toCurrency = document.getElementById("toCurrency").value;

    const resultDiv = document.getElementById("result");
    const errorDiv = document.getElementById("error");

    if (isNaN(amount) || amount <= 0) {
        errorDiv.innerHTML = "Please enter a valid amount.";
        resultDiv.innerHTML = "";
        return;
    }

    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        if (!data.rates[fromCurrency] || !data.rates[toCurrency]) {
            throw new Error("Currency not available.");
        }

        const exchangeRate = data.rates[toCurrency] / data.rates[fromCurrency];
        const convertedAmount = (amount * exchangeRate).toFixed(2);

        resultDiv.innerHTML = `${amount} ${fromCurrency} is equal to ${convertedAmount} ${toCurrency}`;
        errorDiv.innerHTML = "";
    } catch (error) {
        console.error("Error converting currency:", error);
        resultDiv.innerHTML = "";
        errorDiv.innerHTML = "Error fetching exchange rates. Please try again later.";
    }
}

// Initialize the app
fetchCurrencies();
