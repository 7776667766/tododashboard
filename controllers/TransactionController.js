const Transaction = require("../models/TransactionModel");
const stripe = require("stripe")(
  "sk_test_51NX2rxKZnNaiPBqB5BbVKBBCRFKZ60D6gHoEaJa0etfZIR2B5rArHDA154NYvHtXo39dwXYuFd51sdNHF2N0jyu200Cl2Su7WS"
);
const User = require("../models/UserModel");
// const Plan = require('../models/PlanModel');

const createSubscription = async (customerId, priceId) => {
  const subscription = await stripe.subscriptions.create({
    customer: customerId,
    items: [{ price: priceId }],
  });
  return subscription;
};


// const addTransactionApi = async (req, res, next) => {
//   try {
//     const { id } = req.user;

//     const user = await User.findById(id);

//     if (!user) {
//       return res.status(400).json({
//         status: "error",
//         message: "User not found",
//       });
//     }

//     const { name, token, subscriptionPlan, check, price, phoneNumber } = req.body;

//     if (!name || !token || !subscriptionPlan) {
//       return res.status(400).json({ status: "error", message: "Invalid request payload" });
//     }

//     const creditCardInfo = req.body.token;

//     if (!creditCardInfo) {
//       return res.status(400).json({
//         status: "error",
//         message: "Invalid credit Transaction information in the token",
//       });
//     }

//     const paymentMethod = await stripe.paymentMethods.create({
//       type: "card",
//       card: {
//         token: creditCardInfo,
//       },
//     });

//     const customer = await stripe.customers.create({
//       payment_method: paymentMethod.id,
//       invoice_settings: {
//         default_payment_method: paymentMethod.id,
//       },
//       name: name,
//     });

//     try {
//       await stripe.paymentMethods.attach(paymentMethod.id, {
//         customer: customer.id,
//       });
//     } catch (err) {
//       return res.status(400).json({
//         status: "error",
//         message: "Something went wrong.",
//       });
//     }

//     const verificationSession = await stripe.identity.verifySessions.create({
//       type: 'phone_number',
//       phone_number: phoneNumber,
//     });

//     console.log("verification-section",verificationSession)

//     if (verificationSession.status === 'requires_input') {
//       // Do nothing here or add any necessary code for handling input (e.g., waiting for user input)
//     } else {
//       return res.status(400).json({
//         status: "error",
//         message: "Unable to initiate phone number verification",
//       });
//     }

//     const selectedPriceId = await createCustomPrice({
//       name: name,
//       amount: price,
//     });

//     const subscription = await createSubscription(customer.id, selectedPriceId);
//     const amount = subscription.plan.amount;

//     const { exp_month, exp_year, last4, brand } = paymentMethod.card;
//     console.log(
//       exp_month,
//       exp_year,
//       last4,
//       brand,
//       "-------Transaction details to show"
//     );

//     let newcard;

//     if (check === true) {
//       newcard = {
//         name,
//         subscriptionPlan,
//         expiryDate: `${exp_month}/${exp_year}`,
//         cardDigits: last4,
//         cardType: brand,
//         amount: amount,
//       };
//     } else {
//       const newTransaction = await Transaction.create({
//         userId: user._id,
//         name,
//         stripeCustomerId: customer.id,
//         stripePaymentMethodId: paymentMethod.id,
//         stripeSubscriptionId: subscription.id,
//         subscriptionPlan,
//         expiryDate: `${exp_month}/${exp_year}`,
//         cardDigits: last4,
//         cardType: brand,
//         amount: amount,
//       });

//       res.status(201).json({
//         status: "success",
//         message: "Transaction saved successfully",
//         data: newTransaction,
//         newcard,
//       });
//     }
//   } catch (error) {
//     console.error("Error in Adding Transaction Details", error);
//     res.status(500).json({ status: "error", message: "Internal Server Error" });
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
        .json({ status: "error", message: "Invalid request payload" });
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
      });

      res.status(201).json({
        status: "success",
        message: "Transaction saved successfully",
        data: newTransaction,
        newcard,
      });
    }
  } catch (error) {
    console.error("Error in Adding Transaction Details", error);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
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


const verificationPhone = async (req, res, next) => {
  console.log(req.body)
  try {
    const { phoneNumber, verificationCode, verificationSessionId } = req.body;

    const verificationCheck = await stripe.identity.verifySessions.create({
      type: 'phone_number',
      phone_number: phoneNumber,
      verification_code: verificationCode,
      id: verificationSessionId,
    });
    console.log("<----1233----> Verification Code 327 <----1233---->", verificationCheck)

    if (verificationCheck.status === 'verified') {
      res.status(200).json({
        status: 'success',
        message: 'Phone number verified successfully.',
      });
    } else {
      res.status(400).json({
        status: 'error',
        message: 'Invalid verification code. Please try again.',
      });
    }
  } catch (error) {
    console.error('Error confirming phone number verification:', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
    });
  }
};



module.exports = {
  verificationPhone,
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
