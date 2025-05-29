import axios from "axios";

const checkout = async (totalTopup, user) => {
  const encodedKey = btoa(import.meta.env.VITE_PAYMONGO_SECRET_KEY);

  try {
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
                amount: totalTopup * 100,
                description: "Top Up Wallet Balance",
                name: "Top Up Wallet Balance",
                quantity: 1,
              },
            ],
            description: "Top Up Wallet Balance",
            success_url: "https://availiowebsite.vercel.app/dashboard",
            cancel_url: "https://availiowebsite.vercel.app/dashboard",
            metadata: {
              user_id: user.uid,
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

    return response;
  } catch (error) {
    return null;
  }
};

export default checkout;
