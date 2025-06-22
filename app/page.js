import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #ffffff, #e0f0ff)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "40px 20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1
        style={{
          fontSize: "36px",
          color: "#1a237e",
          marginBottom: "30px",
        }}
      >
        Campus Shuttle Service
      </h1>

      {/* Centered Image */}
      <div style={{ marginBottom: "40px" }}>
        <Image
          src="/kmc.png"
          alt="Shuttle"
          width={550}
          height={350}
          style={{
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          }}
        />
      </div>

      {/* Navigation Buttons */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
          width: "100%",
          maxWidth: "800px",
        }}
      >
        <Link href="/news" legacyBehavior>
          News
        </Link>
        <Link href="/bus-schedule" legacyBehavior>
          Bus Schedules
        </Link>
        <Link href="/seat-reservation" legacyBehavior>
          Seat Reservation
        </Link>
        <Link href="/shuttle-tickets" legacyBehavior>
          Ticket Price
        </Link>
        <Link href="/lost&Found" legacyBehavior>
          Lost & Found
        </Link>
        <Link href="/contact-information" legacyBehavior>
          Campus Security Contact
        </Link>
        <Link href="/aboutUs" legacyBehavior>
          About Us
        </Link>
      </div>
    </div>
  );
}

// Reusable inline style for navigation buttons
const navButtonStyle = {
  display: "block",
  textAlign: "center",
  padding: "15px 20px",
  backgroundColor: "#1976d2",
  color: "white",
  textDecoration: "none",
  borderRadius: "8px",
  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
  fontSize: "16px",
  fontWeight: "bold",
  transition: "background-color 0.3s",
};
