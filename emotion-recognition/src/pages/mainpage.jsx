import React from "react";

function HomePage({ navigateTo }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#f5f5f5",
        textAlign: "center",
        padding: "20px",
      }}
    >
      <h1
        style={{
          fontSize: "3rem",
          fontWeight: "bold",
          color: "#333",
          marginBottom: "20px",
        }}
      >
        Welcome to Emotion Detection App
      </h1>
      <p
        style={{
          fontSize: "1.2rem",
          color: "#555",
          maxWidth: "600px",
          lineHeight: "1.6",
          marginBottom: "30px",
        }}
      >
        Analyze emotions in real-time using cutting-edge facial recognition
        technology. The app detects and predicts emotional states such as Happy,
        Sad, Fear, and more with a dynamic user interface.
      </p>
      <img
        src="https://via.placeholder.com/600x300.png?text=Emotion+Detection"
        alt="Emotion Detection Illustration"
        style={{
          maxWidth: "100%",
          height: "auto",
          borderRadius: "12px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          marginBottom: "30px",
        }}
      />
      <button
        onClick={() => navigateTo("app")}
        style={{
          padding: "12px 30px",
          fontSize: "1.1rem",
          color: "#fff",
          backgroundColor: "#4CAF50",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          transition: "background-color 0.3s ease",
        }}
        onMouseEnter={(e) => (e.target.style.backgroundColor = "#45a049")}
        onMouseLeave={(e) => (e.target.style.backgroundColor = "#4CAF50")}
      >
        Get Started
      </button>
    </div>
  );
}

export default HomePage;
