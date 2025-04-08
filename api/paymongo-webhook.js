import { buffer } from "micro";
import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp();
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

  console.log("Webhook received:", JSON.stringify(payload, null, 2));

  const eventType = payload.data?.attributes?.type;
  const payment = payload.data?.attributes?.data;
  const metadata = payment?.attributes?.metadata;
  const status = payment?.attributes?.status;
  const userId = metadata?.user_id;

  if (eventType === "payment.paid" && status === "paid" && userId) {
    const amount = payment.attributes.amount / 100;
    console.log("Updating wallet for:", userId, "Amount:", amount);

    try {
      await admin
        .firestore()
        .collection("users")
        .doc(userId)
        .update({
          walletBalance: admin.firestore.FieldValue.increment(amount),
        });

      return res.status(200).send("Wallet updated");
    } catch (err) {
      console.error("Error updating wallet:", err.message, err.stack);
      return res.status(500).send("Internal Server Error");
    }
  }

  return res.status(200).send("Event received but skipped");
}
