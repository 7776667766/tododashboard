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
    const { name, token, subscriptionPlan, check } = req.body;

    if (!name || !token || !subscriptionPlan) {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid request payload" });
    }

    const creditCardInfo = req.body.token;

    if (!creditCardInfo) {
      return res
        .status(400)
        .json({
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

    await stripe.paymentMethods.attach(paymentMethod.id, {
      customer: customer.id,
    });

    let selectedPriceId;

    switch (subscriptionPlan) {
      case "3months":
        selectedPriceId = await createCustomPrice(5000);
        break;
      case "6months":
        selectedPriceId = await createCustomPrice(10000);
        break;
      case "12months":
        selectedPriceId = await createCustomPrice(18000);
        break;
      default:
        return res
          .status(400)
          .json({ status: "error", message: "Invalid subscription plan" });
    }

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

console.log(check,"check")
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
    
        res.status(201).json({ status: "success", message: "Transaction saved successfully", data: newTransaction, newcard });
      }
    } catch (error) {
      console.error("Error in Adding Transaction Details", error);
      res.status(500).json({ status: "error", message: "Internal Server Error" });
    }}

  const createCustomPrice = async (amount) => {
    const product = await stripe.products.create({
      name: "Your Product Name",
      type: "service",
    });

    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: amount,
      currency: "usd",
      recurring: {
        interval: "month",
        interval_count: 3,
      },
    });
    return price.id;
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
