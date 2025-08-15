import React, { useEffect, useState } from "react";

const Console = () => {
  const [services, setServices] = useState([]);

  // Fetch services from backend
  useEffect(() => {
    fetch("http://localhost:8000/console")
      .then((res) => res.json())
      .then((data) => setServices(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>StartUP Console</h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "1rem",
          marginTop: "2rem",
        }}
      >
        {services.map((service, index) => (
          <div
            key={index}
            style={{
              border: "1px solid #ccc",
              borderRadius: "12px",
              padding: "1rem",
              boxShadow: "2px 2px 8px rgba(0,0,0,0.1)",
            }}
          >
            <h2>{service.name}</h2>
            <p>{service.description}</p>
            <button
              style={{
                marginTop: "1rem",
                padding: "0.5rem 1rem",
                borderRadius: "8px",
                border: "none",
                backgroundColor: "#0070f3",
                color: "white",
                cursor: "pointer",
              }}
              onClick={() => alert(`Navigate to: ${service.route}`)}
            >
              Open
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Console;
