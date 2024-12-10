import React, { useState, useEffect } from "react";
import ButtonAppBar from "../components/Navbar";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import { fetchBookings, addBooking } from "../services/bookServices";

function Home() {
  const localizer = momentLocalizer(moment);
  const [events, setEvents] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedService, setSelectedService] = useState("Haircut");

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    fetchBookings(authToken).then((bookings) => {
      setEvents(
        bookings.map((booking) => ({
          title: booking.service,
          start: new Date(booking.date),
          end: new Date(new Date(booking.date).getTime() + 60 * 60 * 1000),
        }))
      );
    });
  }, []);

  const handleBooking = () => {
    const authToken = localStorage.getItem("authToken");

    const newBooking = {
      date: selectedDate.toISOString(),
      service: selectedService,
    };

    addBooking(authToken, newBooking).then((response) => {
      if (response.success) {
        setEvents((prevEvents) => [
          ...prevEvents,
          {
            title: newBooking.service,
            start: new Date(newBooking.date),
            end: new Date(new Date(newBooking.date).getTime() + 60 * 60 * 1000),
          },
        ]);
        setErrorMessage("");
        alert("Booking successful!");
      } else {
        setErrorMessage(response.message || "Failed to book the slot.");
      }
      setIsModalOpen(false);
    });
  };

  return (
    <div>
      <ButtonAppBar />
      <div style={{ marginTop: "20px", padding: "20px" }}>
        {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}

        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "600px" }}
          selectable={true}
          longPressThreshold={1}
          onSelectSlot={(slot) => {
            console.log("slot select: ", slot);
            setSelectedDate(slot.start);
            setIsModalOpen(true);
          }}
        />
      </div>

      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: "9999",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              width: "300px",
              textAlign: "center",
            }}
          >
            <h3>Select a Service</h3>
            <div>
              <label>
                <input
                  type="radio"
                  name="service"
                  value="Haircut"
                  checked={selectedService === "Haircut"}
                  onChange={() => setSelectedService("Haircut")}
                />
                Haircut
              </label>
              <br />
              <label>
                <input
                  type="radio"
                  name="service"
                  value="Massage"
                  checked={selectedService === "Massage"}
                  onChange={() => setSelectedService("Massage")}
                />
                Massage
              </label>
            </div>
            <br />
            <button onClick={handleBooking}>Confirm Booking</button>
            <button onClick={() => setIsModalOpen(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
