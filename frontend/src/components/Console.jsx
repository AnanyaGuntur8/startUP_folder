import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Console = () => {
  const [services, setServices] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8000/console", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch services.");
        return res.json();
      })
      .then((data) => setServices(data))
      .catch((err) => console.error(err));
  }, [token]);

  return (
    <div className="p-8 font-sans">
      <h1 className="text-3xl font-bold mb-6">StartUP Console</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {services.map((service, index) => (
          <div
            key={index}
            className="border border-gray-300 rounded-xl p-6 shadow hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold">{service.name}</h2>
            <p className="text-gray-600 mt-2">{service.description}</p>
            <button
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              onClick={() => navigate(service.route)}
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
