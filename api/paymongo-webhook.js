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

  console.log("Webhook received:", payload);

  const session = payload.data?.attributes;
  const status = session?.status;
  const userId = session?.metadata?.user_id;

  if (status === "paid" && userId) {
    const amount = session.line_items[0].amount / 100;
    console.log("Amount to add to wallet:", amount);

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
      console.error("Error updating wallet:", err);
      return res.status(500).send("Internal Server Error");
    }
  }

  return res.status(200).send("Event received");
}
