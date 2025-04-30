import axios from "axios";

const checkout = async (totalPrice, user, bookingDetails) => {
  const encodedKey = btoa(process.env.VITE_PAYMONGO_SECRET_KEY);

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

    return response;
  } catch (error) {
    console.error(
      "PayMongo Checkout Error:",
      error.response?.data || error.message
    );
    return null;
  }
};

export default checkout;
