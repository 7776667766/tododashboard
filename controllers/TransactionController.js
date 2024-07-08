const Transaction = require("../models/TransactionModel");
const stripe = require("stripe")(
  "sk_test_51NX2rxKZnNaiPBqB5BbVKBBCRFKZ60D6gHoEaJa0etfZIR2B5rArHDA154NYvHtXo39dwXYuFd51sdNHF2N0jyu200Cl2Su7WS"
);
const User = require("../models/UserModel");
const Plan = require("../models/PlanModel");


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
    const { name, token, subscriptionPlan, check, price } = req.body;

    if (!name || !token || !subscriptionPlan) {
      return res
        .status(400)
        .json({ status: "error", message: "Please select business plan" });
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
      currency: "usd",
      payment_method: paymentMethod.id,
      customer: customer.id,
      confirmation_method: "automatic",
    });

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
      console.log("newTransaction", newTransaction);

      res.status(201).json({
        status: "success",
        message: "Transaction Saved Successfully",
        data: newTransaction,
        newcard,
      });
    }
  } catch (error) {
    console.error("Error in Adding Transaction Details", error);
    if (
      error.type === "StripeCardError" &&
      error.decline_code === "insufficient_funds"
    ) {
      res.status(400).json({
        status: "error",
        message:
          "Your card has insufficient funds. Please use another card or add funds to your card.",
      });
    } else {
      res
        .status(500)
        .json({ status: "error", message: "Internal Server Error" });
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
    console.log("id201 ", id);
    const user = await User.findById(id);
    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "User not found",
      });
    }
    console.log(user, "user209");
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
    console.log("adminTracsaction230pro", adminTransaction);
  } catch (error) {
    console.log("Error in get transaction by user id", error);
    res.status(400).json({ status: "error", message: error.message });
  }
};

const addTranstactionWithCreditAmount = async (req, res, next) => {
  try {
    const { userId, planId } = req.body;

    if (!userId) {
      return res.status(400).json({
        status: "error",
        message: "User is Required",
      });
    }

    if (!planId) {
      return res.status(400).json({
        status: "error",
        message: "Plan is required",
      });
    }

    const plan = await Plan.findById(planId);
    console.log("plan 234", plan)

    if (!plan) {
      return res.status(400).json({
        status: "error",
        message: "Plan not found",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    const newTransactionbyCredit = await Transaction.create({
      userId: user.id,
      amount: plan.price,
      duration:plan.duration,
    });

    if (user.credit) {
      return res.status(200).json({
        status: "error",
        newTransactionbyCredit,
        message: "Transaction Completed by Credit Amount",
      });
    }
    else {
      return res.status(200).json({
        status: "error",
        message: "This user is not credited yet.Please choose another payment method",
      });
    }
  } catch (error) {
    console.error("Error in adding credit", error);
    res.status(500).json({ status: "error", message: error.message });
  }
};

module.exports = {
  addTranstactionWithCreditAmount,
  addTransactionApi,
  getTransactionbyUserId,
};
