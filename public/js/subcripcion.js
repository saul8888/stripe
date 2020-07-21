// Set your publishable key: remember to change this to your live publishable key in production
// See your keys here: https://dashboard.stripe.com/account/apikeys
var stripe = Stripe('');
var elements = stripe.elements();

// Set up Stripe.js and Elements to use in checkout form
var style = {
    base: {
        color: "#32325d",
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
            color: "#aab7c4"
        }
    },
    invalid: {
        color: "#fa755a",
        iconColor: "#fa755a"
    }
};

var cardElement = elements.create("cardNumber", {
    classes: {
        base:"form-control",
        focus: "green",
        invalid: "error",
    },
    style: style,
});
cardElement.mount("#card-element");


cardElement.on('change', showCardError);
console.log(cardElement)
console.log("$$$$$$$$$$$$$$$")

function showCardError(event) {

    let displayError = document.getElementById('card-errors');
    if (event.error) {
        displayError.textContent = event.error.message;
    } else {
        displayError.textContent = '';
    }
}
