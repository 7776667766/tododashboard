const Transaction = require("../models/TransactionModel");
const stripe = require("stripe")(
  "sk_test_51NX2rxKZnNaiPBqB5BbVKBBCRFKZ60D6gHoEaJa0etfZIR2B5rArHDA154NYvHtXo39dwXYuFd51sdNHF2N0jyu200Cl2Su7WS"
);
const User = require("../models/UserModel");

const createSubscription = async (customerId, priceId) => {
  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
  });
  return subscription;
};

// const checkSubscriptions = async () => {
//   try {
//     const transactions = await Transaction.find();
//     console.log("transactions19", transactions);
//     const currentDate = new Date();

//     for (const transaction of transactions) {
//       const subscriptionEndDate = new Date(transaction.stripeSubscriptionEndDate * 1000);
//       const sevenDaysBefore = new Date(subscriptionEndDate.getTime() - 7 * 24 * 60 * 60 * 1000);
      
//       console.log("end date of subscription", subscriptionEndDate);
//       console.log("seven days before 28", sevenDaysBefore);
       
//       if (currentDate.getTime() >= sevenDaysBefore.getTime()) {
//         console.log(`Show popup notification to user ${transaction.userId} about the subscription ending soon.`);
//       }
//     }
//   } catch (error) {
//     console.error("Error in checking subscriptions:", error);
//   }
// };

const addTransactionApi = async (req, res, next) => {
  try {
    const { id } = req.user;

    const user = await User.findById(id);

    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "User not found",
      });
    }
    const { name, token, subscriptionPlan, check, price } = req.body;

    if (!name || !token || !subscriptionPlan) {
      return res
        .status(400)
        .json({ status: "error", message: "please select buiness plan" });
    }

    const creditCardInfo = req.body.token;

    if (!creditCardInfo) {
      return res.status(400).json({
        status: "error",
        message: "Invalid credit Transaction information in the token",
      });
    }

    const paymentMethod = await stripe.paymentMethods.create({
      type: "card",
      card: {
        token: creditCardInfo,
      },
    });

    const customer = await stripe.customers.create({
      payment_method: paymentMethod.id,
      invoice_settings: {
        default_payment_method: paymentMethod.id,
      },
      name: name,
    });

    try {
      await stripe.paymentMethods.attach(paymentMethod.id, {
        customer: customer.id,
      });
    } catch (err) {
      res.status(400).json({
        status: "error",
        message: "Something went wrong.",
      });
    }

    const selectedPriceId = await createCustomPrice({
      name: name,
      amount: price,
    });

    const subscription = await createSubscription(customer.id, selectedPriceId);
    const amount = subscription.plan.amount;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'usd',
      payment_method: paymentMethod.id,
      customer: customer.id,
      confirmation_method: 'automatic',
    });

    // const subscriptionEndDate = new Date(subscription.current_period_end * 1000);
    // const sevenDaysBefore = new Date(subscriptionEndDate.getTime() - 7 * 24 * 60 * 60 * 1000);

    const { exp_month, exp_year, last4, brand } = paymentMethod.card;
    console.log(
      exp_month,
      exp_year,
      last4,
      brand,
      "-------Transaction details to showw"
    );
    let newcard;

    if (check === true) {
      newcard = {
        name,
        subscriptionPlan,
        expiryDate: `${exp_month}/${exp_year}`,
        cardDigits: last4,
        cardType: brand,
        amount: amount,
      };
    } else {
      const newTransaction = await Transaction.create({
        userId: user._id,
        name,
        stripeCustomerId: customer.id,
        stripePaymentMethodId: paymentMethod.id,
        stripeSubscriptionId: subscription.id,
        subscriptionPlan,
        expiryDate: `${exp_month}/${exp_year}`,
        cardDigits: last4,
        cardType: brand,
        amount: amount,
        paymentIntentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret,
        stripeSubscriptionEndDate: subscription.current_period_end,
      });
      console.log("newTransaction", newTransaction)

      res.status(201).json({
        status: "success",
        message: "Transaction Saved Successfully",
        data: newTransaction,
        newcard,
      });

      // const subscriptionEndDate = new Date(subscription.current_period_end * 1000);
      // console.log("subscriptionEndDate133", subscriptionEndDate)
      // const sevenDaysBefore = new Date(subscriptionEndDate.getTime() - 7 * 24 * 60 * 60 * 1000);
      // console.log("sevenDaysBefore123", sevenDaysBefore)
    }

  } catch (error) {
    console.error("Error in Adding Transaction Details", error);
    if (error.type === 'StripeCardError' && error.decline_code === 'insufficient_funds') {
      res.status(400).json({
        status: "error",
        message: "Your card has insufficient funds. Please use another card or add funds to your card.",
      });
    } else {
      res.status(500).json({ status: "error", message: "Internal Server Error" });
    }
  }
};
const createCustomPrice = async ({ name, amount }) => {
  try {
    const product = await stripe.products.create({
      name: name,
      type: "service",
    });
    const prices = await stripe.prices.create({
      product: product.id,
      unit_amount: amount,
      currency: "usd",
      recurring: {
        interval: "month",
        interval_count: 3,
      },
    });
    return prices.id;
  } catch (error) {
    console.log("Error in create custom price", error);
    return error;
  }
};

const getTransactionbyUserId = async (req, res, next) => {
  try {
    if (req.user === undefined) {
      return res.status(400).json({ status: "error", message: "Invalid user" });
    }
    const { id } = req.user;
    const user = await User.findById(id);
    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "User not found",
      });
    }

    console.log(user.role, "user.role");
    if (user.role !== "admin" && user.role !== "owner") {
      return res.status(400).json({
        status: "error",
        message: "you are not authorzed to find transaction list",
      });
    }
    const adminTransaction = await Transaction.find(
      user.role === "owner" ? { userId: id } : {}
    );
    if (!adminTransaction) {
      return res.status(400).json({
        status: "error",
        message: "adminTransaction not found",
      });
    }
    res.status(200).json({
      status: "success",
      data: adminTransaction,
    });
  } catch (error) {
    console.log("Error in get transaction by user id", error);
    res.status(400).json({ status: "error", message: error.message });
  }
};

module.exports = {
  addTransactionApi,
  getTransactionbyUserId,
};

// const addTransactionApi = async (req, res, next) => {
//   try {
//     const { id } = req.user;
//     const { name, token, subscriptionPlan, check, price, phoneNumber } = req.body;
//     // Validate request payload
//     if (!id || !name || !token || !subscriptionPlan || !phoneNumber) {
//       return res.status(400).json({
//         status: "error",
//         message: "Invalid request payload",
//       });
//     }

//     // Validate user
//     const user = await User.findById(id);
//     if (!user) {
//       return res.status(400).json({
//         status: "error",
//         message: "User not found",
//       });
//     }

//     // Create a PaymentMethod using the provided token
//     const paymentMethod = await stripe.paymentMethods.create({
//       type: "card",
//       card: {
//         token: token,
//       },
//     });

//     // Create a customer with the PaymentMethod
//     const customer = await stripe.customers.create({
//       payment_method: paymentMethod.id,
//       invoice_settings: {
//         default_payment_method: paymentMethod.id,
//       },
//       name: name,
//     });

//     // Attach PaymentMethod to the customer
//     try {
//       await stripe.paymentMethods.attach(paymentMethod.id, {
//         customer: customer.id,
//       });
//     } catch (err) {
//       return res.status(400).json({
//         status: "error",
//         message: "Something went wrong attaching the payment method.",
//       });
//     }

//     // Initiate phone number verification
//     const verificationSession = await stripe.identity.verifySessions.create({
//       type: 'phone_number',
//       phone_number: phoneNumber,
//     });

//     if (verificationSession.status === 'requires_input') {
//       // Verification initiated successfully, handle the user interaction (e.g., send OTP)
//       return res.status(200).json({
//         status: "requires_input",
//         message: "Phone number verification initiated",
//         verificationSessionId: verificationSession.id,
//       });
//     } else {
//       // Unable to initiate phone number verification, handle accordingly
//       return res.status(400).json({
//         status: "error",
//         message: "Unable to initiate phone number verification",
//       });
//     }

//   } catch (error) {
//     console.error("Error in Adding Transaction Details", error);
//     res.status(500).json({ status: "error", message: "Internal Server Error" });
//   }
// };

// // Add a new endpoint to handle phone number verification confirmation
// // This endpoint should be called after the user enters the verification code
// app.post('/api/confirm-phone-verification', async (req, res) => {
//   try {
//     const { name, phoneNumber, verificationCode, verificationSessionId } = req.body;

//     // Confirm phone number verification
//     const verificationCheck = await stripe.identity.verifySessions.create({
//       type: 'phone_number',
//       phone_number: phoneNumber,
//       verification_code: verificationCode,
//       id: verificationSessionId, // Use the verification session ID obtained during initiation
//     });

//     if (verificationCheck.status === 'verified') {
//       // Continue with the rest of the transaction logic
//       // ...
//       res.status(200).json({
//         status: 'success',
//         message: 'Phone number verified successfully.',
//       });
//     } else {
//       res.status(400).json({
//         status: 'error',
//         message: 'Invalid verification code. Please try again.',
//       });
//     }
//   } catch (error) {
//     console.error('Error confirming phone number verification:', error);
//     res.status(500).json({
//       status: 'error',
//       message: 'Internal Server Error',
//     });
//   }
// };
