import React, { useEffect, useState } from "react";
import { Search, Menu, Settings, Grid } from "lucide-react";

const Console = () => {
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    setServices([
      {
        name: "Compute Engine",
        description: "Manage virtual machines and scalable compute power.",
        route: "/compute",
      },
      {
        name: "Storage Service",
        description: "Reliable and secure object storage for any data type.",
        route: "/storage",
      },
      {
        name: "Database Manager",
        description: "Managed relational and NoSQL databases.",
        route: "/database",
      },
      {
        name: "AI & Machine Learning",
        description: "Train and deploy ML models at scale.",
        route: "/ai",
      },
      {
        name: "Playground",
        description: "Experiment and test your code in the Playground.",
        route: "/playground",
      },
    ]);
  }, []);

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "Arial, sans-serif", backgroundColor: "#121212", color: "#fff" }}>
      
      {/* Sidebar */}
      <aside
        style={{
          width: sidebarOpen ? "250px" : "70px",
          backgroundColor: "#1e1e1e",
          boxShadow: "2px 0 6px rgba(0,0,0,0.5)",
          transition: "width 0.3s ease",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: sidebarOpen ? "space-between" : "center",
            padding: "16px",
            borderBottom: "1px solid #333",
          }}
        >
          {sidebarOpen && <h2 style={{ fontSize: "18px", fontWeight: "bold" }}>StartUP</h2>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#fff" }}
          >
            <Menu size={20} />
          </button>
        </div>
        <nav style={{ marginTop: "16px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "12px 16px",
              cursor: "pointer",
              color: "#fff",
            }}
          >
            <Grid size={20} />
            {sidebarOpen && <span style={{ marginLeft: "12px" }}>All Services</span>}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "12px 16px",
              cursor: "pointer",
              color: "#fff",
            }}
          >
            <Settings size={20} />
            {sidebarOpen && <span style={{ marginLeft: "12px" }}>Settings</span>}
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Top Bar */}
        <header
          style={{
            backgroundColor: "#1e1e1e",
            padding: "16px 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 2px 4px rgba(0,0,0,0.5)",
          }}
        >
          <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>StartUP Console</h1>
          <div style={{ position: "relative", width: "320px" }}>
            <input
              type="text"
              placeholder="Search services..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 10px 10px 36px",
                borderRadius: "6px",
                border: "1px solid #555",
                backgroundColor: "#2a2a2a",
                color: "#fff",
                fontSize: "14px",
              }}
            />
            <Search
              style={{ position: "absolute", top: "50%", left: "10px", transform: "translateY(-50%)", color: "#aaa" }}
              size={18}
            />
          </div>
        </header>

        {/* Hero Section */}
        <div
          style={{
            backgroundColor: "#2a2a2a",
            color: "#fff",
            padding: "24px",
          }}
        >
          <h2 style={{ fontSize: "22px", fontWeight: "bold" }}>Welcome to your Console</h2>
          <p style={{ marginTop: "6px", fontSize: "14px", opacity: 0.8 }}>
            Manage your services and infrastructure efficiently.
          </p>
          <div style={{ marginTop: "16px", display: "flex", gap: "12px" }}>
            <button
              style={{
                backgroundColor: "#fff",
                color: "#1e1e1e",
                padding: "10px 16px",
                borderRadius: "6px",
                fontWeight: "bold",
                border: "none",
                cursor: "pointer",
              }}
            >
              Create Resource
            </button>
            <button
              style={{
                backgroundColor: "#444",
                color: "#fff",
                padding: "10px 16px",
                borderRadius: "6px",
                fontWeight: "bold",
                border: "none",
                cursor: "pointer",
              }}
            >
              View Dashboard
            </button>
          </div>
        </div>

        {/* Services Grid */}
        <main style={{ padding: "24px", overflowY: "auto" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "16px" }}>
            Available Services
          </h2>
          {filteredServices.length === 0 ? (
            <p style={{ color: "#888" }}>No services found.</p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                gap: "20px",
              }}
            >
              {filteredServices.map((service, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: "#1e1e1e",
                    borderRadius: "12px",
                    padding: "20px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.7)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.5)";
                  }}
                  onClick={() => window.location.href = service.route}
                >
                  <div>
                    <div
                      style={{
                        width: "48px",
                        height: "48px",
                        backgroundColor: "#333",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: "16px",
                        fontSize: "20px",
                        color: "#fff",
                        fontWeight: "bold",
                      }}
                    >
                      {service.name[0]}
                    </div>
                    <h3 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "8px" }}>
                      {service.name}
                    </h3>
                    <p style={{ fontSize: "14px", color: "#aaa" }}>{service.description}</p>
                  </div>
                  <button
                    style={{
                      marginTop: "16px",
                      backgroundColor: "#fff",
                      color: "#1e1e1e",
                      padding: "10px",
                      borderRadius: "6px",
                      border: "none",
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                  >
                    Open
                  </button>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Console;
