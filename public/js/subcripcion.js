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

var card = elements.create("cardNumber", {
    classes: {
        base: "form-control",
        focus: "green",
        invalid: "error",
    },
    style: style,
});

var cvc = elements.create("cardCvc", {
    classes: {
        base: "form-control",
        invalid: "error",
    },
    style: style,
});

var exp = elements.create("cardExpiry", {
    classes: {
        base: "form-control",
        invalid: "error",
    },
    style: style,
});

card.mount("#card-number");
cvc.mount("#card-cvc");
exp.mount("#card-exp");

card.on('change', showCardError);

console.log("$$$$$$$$$$$$$$$")

function showCardError(event) {

    let displayError = document.getElementById('card-errors');
    if (event.error) {
        displayError.textContent = event.error.message;
    } else {
        displayError.textContent = '';
    }
}

/*-----------------------------------------------*/

var radio = document.querySelectorAll(".checkbox")
var button = document.getElementById("button")
var message1 = document.getElementById("message1")
var message2 = document.getElementById("message2")
var message3 = document.getElementById("message3")

function checkBox(e) {
    if (e.target.value == "month") {
        button.textContent = "CONFIRM"
        message1.textContent = "Start learning to code today!"
        message2.textContent = "billed monthly"
        message3.textContent = "$8.99 monthly"
    } else {

        button.textContent = "START 7-DAY FREE TRIAL"
        message1.textContent = "Try Mimo Pro free for a week!"
        message2.textContent = "You won't be charged until your 7-day free trial ends on Jul 28th, 2020"
        message3.textContent = "$59.99 monthy"
    }
}

radio.forEach(check => {
    check.addEventListener("click", checkBox);
});


/*-----------------------------------------------*/

var form = document.getElementById('subscription-form');

form.addEventListener('submit', function (ev) {
    ev.preventDefault();

    // If a previous payment was attempted, get the latest invoice
    const latestInvoicePaymentIntentStatus = localStorage.getItem(
        'latestInvoicePaymentIntentStatus'
    );

    if (latestInvoicePaymentIntentStatus === 'requires_payment_method') {
        const invoiceId = localStorage.getItem('latestInvoiceId');
        const isPaymentRetry = true;
        // create new payment method & retry payment on invoice with new payment method
        createPaymentMethod({
            card,
            isPaymentRetry,
            invoiceId,
        });
    } else {
        // create new payment method & create subscription
        createPaymentMethod({ card });
    }
});

function createPaymentMethod({ card, isPaymentRetry, invoiceId }) {
    // Set up payment method for recurring usage
    //let billingName = document.querySelector('#name').value;

    stripe
        .createPaymentMethod({
            type: 'card',
            card: card,
            billing_details: {
                //name: billingName,
            },
        })
        .then((result) => {
            if (result.error) {
                displayError(result);
            } else {
                if (isPaymentRetry) {
                    // Update the payment method and retry invoice payment
                    retryInvoiceWithNewPaymentMethod({
                        customerId: customerId,
                        paymentMethodId: result.paymentMethod.id,
                        invoiceId: invoiceId,
                        priceId: priceId,
                    });
                } else {
                    // Create the subscription
                    createSubscription({
                        customerId: customerId,
                        paymentMethodId: result.paymentMethod.id,
                        priceId: priceId,
                    });
                }
            }
        });
}


/*-----------------------------------------------*/

function createSubscription({ customerId, paymentMethodId, priceId }) {
    return (
        fetch('/payment/create-subscription', {
            method: 'post',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                customerId: customerId,
                paymentMethodId: paymentMethodId,
                priceId: priceId,
            }),
        })
            .then((response) => {
                return response.json();
            })
            // If the card is declined, display an error to the user.
            .then((result) => {
                if (result.error) {
                    // The card had an error when trying to attach it to a customer.
                    throw result;
                }
                return result;
            })
            // Normalize the result to contain the object returned by Stripe.
            // Add the additional details we need.
            .then((result) => {
                return {
                    paymentMethodId: paymentMethodId,
                    priceId: priceId,
                    subscription: result,
                };
            })
            // Some payment methods require a customer to be on session
            // to complete the payment process. Check the status of the
            // payment intent to handle these actions.
            .then(handlePaymentThatRequiresCustomerAction)
            // If attaching this card to a Customer object succeeds,
            // but attempts to charge the customer fail, you
            // get a requires_payment_method error.
            .then(handleRequiresPaymentMethod)
            // No more actions required. Provision your service for the user.
            .then(onSubscriptionComplete)
            .catch((error) => {
                // An error has happened. Display the failure to the user here.
                // We utilize the HTML element we created.
                showCardError(error);
            })
    );
}

