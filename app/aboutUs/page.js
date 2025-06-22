"use client";

export default function AboutUsAdmin() {
  return (
    <div style={{ margin: 120 }}>
      <p style={{ textAlign: "center" }}>
        <a href="/">Home</a>
      </p>

      <div
        style={{
          margin: "100px auto",
          maxWidth: "800px",
          textAlign: "center",
          padding: "20px",
          backgroundColor: "#f0f4f8",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <h1 style={{ fontSize: "32px", color: "#1a237e", marginBottom: "20px" }}>
          About This Project
        </h1>
        <p style={{ fontSize: "18px", lineHeight: "1.6", color: "#333" }}>
          This Shuttle Service Management System is built for{" "}
          <strong>Horizon Campus, Malabe</strong>. It aims to improve the efficiency,
          accessibility, and overall experience of the campus shuttle service.
          <br />
          <br />
          The system allows students and staff to view real-time schedules, reserve seats,
          and stay informed about shuttle-related updates.
          <br />
          <br />
          Our goal is to streamline transportation within the campus and make daily commutes
          more convenient and reliable.
        </p>
      </div>
    </div>
  );
}
