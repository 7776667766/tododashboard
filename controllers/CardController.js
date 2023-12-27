const Card = require('../models/CardModel');
const stripe = require('stripe')('sk_test_51NX2rxKZnNaiPBqB5BbVKBBCRFKZ60D6gHoEaJa0etfZIR2B5rArHDA154NYvHtXo39dwXYuFd51sdNHF2N0jyu200Cl2Su7WS');

const createSubscription = async (customerId, priceId) => {
    const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
        trial_period_days: 1,  
    });
    return subscription;
};

const addCardApi = async (req, res, next) => {
    try {

        const { name, token, subscriptionPlan } = req.body;
        console.log(token, "token")

        if (!name || !token || !subscriptionPlan) {
            return res.status(400).json({ status: 'error', message: 'Invalid request payload' });
        }

        const creditCardInfo = req.body.token;
        console.log(creditCardInfo, "information of card")

        if (!creditCardInfo) {
            return res.status(400).json({ status: 'error', message: 'Invalid credit card information in the token' });
        }

        const paymentMethod = await stripe.paymentMethods.create({
            type: 'card',
            card: {
                token: creditCardInfo,
            },
        });

        console.log("payment method", paymentMethod.id)

        const customer = await stripe.customers.create({
            payment_method: paymentMethod.id,
            invoice_settings: {
                default_payment_method: paymentMethod.id,
            },
            name: name,
        });
        console.log(customer, "customerr")


        await stripe.paymentMethods.attach(
            paymentMethod.id,
            { customer: customer.id }
        );

        let selectedPriceId;

        switch (subscriptionPlan) {
            case '3months':
                selectedPriceId = await createCustomPrice(5000);
                break;
            case '6months':
                selectedPriceId = await createCustomPrice(7000);
                break;
            case '8months':
                selectedPriceId = await createCustomPrice(9000);
                break;
            default:
                return res.status(400).json({ status: 'error', message: 'Invalid subscription plan' });
        }

        const subscription = await createSubscription(customer.id, selectedPriceId);

        console.log(subscription, "subscription")

        const newCard = await Card.create({
            name,
            stripeCustomerId: customer.id,
            stripePaymentMethodId: paymentMethod.id,
            stripeSubscriptionId: subscription.id,
        });

        console.log("newCard", newCard)

        res.status(201).json({ status: 'success', data: newCard });
    } catch (error) {
        console.error('Error in Adding Card Details', error);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
};


const createCustomPrice = async (amount) => {
    const product = await stripe.products.create({
        name: 'Your Product Name',
        type: 'service',
    });

    const price = await stripe.prices.create({
        product: product.id,
        unit_amount: amount,
        currency: 'usd',
        recurring: {
            interval: 'month',
            interval_count: 3,
        },
    });

    return price.id;
};

module.exports = {
    addCardApi,
};