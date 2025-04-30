import axios from "axios";
export default async function handler(req, res) {
  const encodedKey = btoa(process.env.VITE_PAYMONGO_SECRET_KEY);

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { totalPrice, user, bookingDetails } = req.body;

    if (!totalPrice || !user || !bookingDetails) {
      return res.status(400).json({ message: "Missing parameters" });
    }

    const response = await axios.post(
      "https://api.paymongo.com/v1/checkout_sessions",
      {
        data: {
          attributes: {
            billing: {
              name: user.displayName,
              email: user.email,
              phone: user.phoneNumber,
            },
            send_email_receipt: true,
            show_description: true,
            show_line_items: true,
            payment_method_types: ["gcash", "paymaya", "card"],
            line_items: [
              {
                currency: "PHP",
                amount: totalPrice * 100,
                description: `Rental of ${bookingDetails.motorcycleName}`,
                name: "Vehicle Rental",
                quantity: 1,
              },
            ],
            description: `Rental payment for ${bookingDetails.motorcycleName}`,
            success_url: `https://scootergaming.vercel.app/payment-success?bookingId=${bookingDetails.bookingId}`,
            cancel_url: "https://scootergaming.vercel.app/payment-cancelled",
            metadata: {
              user_id: user.uid,
              booking_id: bookingDetails.bookingId,
              motorcycle_id: bookingDetails.motorcycleId,
              start_date: bookingDetails.startDate,
              end_date: bookingDetails.endDate,
            },
          },
        },
      },
      {
        headers: {
          Authorization: `Basic ${encodedKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response || !response.data) {
      return res.status(500).json({ message: "Checkout failed" });
    }

    return res.status(200).json(response.data);
  } catch (error) {
    console.error("API Route Error:", error);
    return res.status(500).json({ error: error.message });
  }
}
