import { jwtDecode } from "jwt-decode";

export const fetchBookings = async (authToken) => {
  try {
    const response = await fetch("http://localhost:3000/appointments/all", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });

    const text = await response.text();

    // console.log("Response:", text); // Log the raw response to check if it's HTML or JSON

    if (response.ok) {
      try {
        const data = JSON.parse(text);
        return data;
      } catch (e) {
        console.error("Failed to parse JSON:", e);
        return [];
      }
    } else {
      throw new Error(`Failed to fetch events: ${text}`);
    }
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return [];
  }
};

export const addBooking = async (authToken, bookingData) => {
  try {
    const decodedToken = jwtDecode(authToken);
    const userId = decodedToken.id;

    const bookingDataWithUser = { ...bookingData, userId };

    const response = await fetch("http://localhost:3000/booking/book", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`, // Include the auth token in headers
      },
      body: JSON.stringify(bookingDataWithUser), // Send the booking data with userId
    });

    if (response.ok) {
      const data = await response.json();
      return { success: true, data };
    } else {
      const errorData = await response.json();
      return {
        success: false,
        message: errorData.message || "Failed to add booking.",
      };
    }
  } catch (error) {
    console.error("Error adding booking:", error);
    return { success: false, message: "Error adding booking." };
  }
};
