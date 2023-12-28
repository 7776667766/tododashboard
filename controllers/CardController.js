const Card = require('../models/CardModel');
const stripe = require('stripe')('sk_test_51NX2rxKZnNaiPBqB5BbVKBBCRFKZ60D6gHoEaJa0etfZIR2B5rArHDA154NYvHtXo39dwXYuFd51sdNHF2N0jyu200Cl2Su7WS');

const createSubscription = async (customerId, priceId) => {
    const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
    });
    return subscription;
};

const addCardApi = async (req, res, next) => {
    try {
        const { name, token, subscriptionPlan, check } = req.body;
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

        console.log("card payment method", paymentMethod.card)

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
                selectedPriceId = await createCustomPrice(10000);
                break;
            case '12months':
                selectedPriceId = await createCustomPrice(18000);
                break;
            default:
                return res.status(400).json({ status: 'error', message: 'Invalid subscription plan' });
        }

        const subscription = await createSubscription(customer.id, selectedPriceId);

        console.log(subscription, "subscription")




        if (check==="true") {
            const { exp_month, exp_year, last4, brand } = paymentMethod.card;
            console.log(exp_month, exp_year, last4, brand,"-------card details to showw")

            const newCard = await Card.create({
                name,
                stripeCustomerId: customer.id,
                stripePaymentMethodId: paymentMethod.id,
                stripeSubscriptionId: subscription.id,
                subscriptionPlan,
                expiryDate: `${exp_month}/${exp_year}`,
                cardDigits: last4,
                cardType: brand,

            });

            console.log("newCard", newCard);

            res.status(201).json({ status: 'success', data: newCard });
        } else {
            console.log("Check is false, skipping card details saving.");

            res.status(201).json({ status: 'success', message: 'Card details not saved due to check being false' });
        }
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

const getTransactionDetails = async (req, res, next) => {
    try {
      const transactions = await Card.find();
      console.log("transections",transactions)
  
      res.status(200).json({ status: 'success', data: transactions });
    } catch (error) {
      console.error('Error fetching transaction details:', error);
      res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
  };
  
module.exports = {
    addCardApi,
    getTransactionDetails
};