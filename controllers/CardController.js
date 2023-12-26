const Card = require('../models/StripeModal');
const stripe = require('stripe')('sk_test_51NX2rxKZnNaiPBqB5BbVKBBCRFKZ60D6gHoEaJa0etfZIR2B5rArHDA154NYvHtXo39dwXYuFd51sdNHF2N0jyu200Cl2Su7WS');

const addCardApi = async (req, res, next) => {
    try {
        const { name, token } = req.body;
        console.log(token,"token")

        if (!name || !token) {
            return res.status(400).json({ status: 'error', message: 'Invalid request payload' });
        }
        const creditCardInfo = req.body.token;
        console.log(creditCardInfo,"information of card")

        if (!creditCardInfo ) {
            return res.status(400).json({ status: 'error', message: 'Invalid credit card information in the token' });
        }

        // const creditCardToken = creditCardInfo.id;
        // console.log(creditcardToken,"tken of card")


        const paymentMethod = await stripe.paymentMethods.create({
            type: 'card',
            card: {
                token:creditCardInfo,
            },
        });

        const paymentIntent = await stripe.paymentIntents.create({
            amount: 1000,
            currency: 'usd',
            payment_method: paymentMethod.id,
            confirmation_method: 'manual',
            confirm: true,
            return_url: 'https://www.youtube.com', // Replace with your actual return URL

        });

        const newCard = await Card.create({
            name,
            stripePaymentMethodId: paymentMethod.id,
            stripePaymentIntentId: paymentIntent.id,
        });

        console.log("newCard", newCard)


        res.status(201).json({ status: 'success', data: newCard });
    } catch (error) {
        console.error('Error in Adding Card Details', error);
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
    }
};

module.exports = {
    addCardApi,
};