import { buffer } from "micro";
import admin from "firebase-admin";

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end("Method Not Allowed");
  }

  const rawBody = await buffer(req);
  const payload = JSON.parse(rawBody.toString());

  const eventType = payload.data?.attributes?.type;
  const payment = payload.data?.attributes?.data;
  const metadata = payment?.attributes?.metadata;
  const status = payment?.attributes?.status;
  const userId = metadata?.user_id;
  const paymentId = payment?.id;

  const amount = payment?.attributes?.amount
    ? payment.attributes.amount / 100
    : 0;

  const transactionData = {
    userId: userId || null,
    type: "Top-Up",
    amount,
    status,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    paymentId,
  };

  try {
    await admin.firestore().collection("transactions").add(transactionData);
    console.log("Transaction logged:", paymentId);
  } catch (err) {
    console.error("Error logging transaction:", err.message, err.stack);
  }

  if (eventType === "payment.paid" && status === "paid" && userId) {
    try {
      await admin
        .firestore()
        .collection("users")
        .doc(userId)
        .update({
          walletBalance: admin.firestore.FieldValue.increment(amount),
        });

      return res.status(200).send("Wallet updated and transaction logged");
    } catch (err) {
      console.error("Error updating wallet:", err.message, err.stack);
      return res.status(500).send("Internal Server Error");
    }
  }

  return res.status(200).send("Event received and transaction logged");
}
