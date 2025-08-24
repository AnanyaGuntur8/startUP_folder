import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Menu, Settings, User, LogOut, Star, Grid } from "lucide-react";

const Console = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentUser, setCurrentUser] = useState("");
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    checkAuthentication();
    setServices([
      {
        name: "Playground",
        description: "Network with fellow businesses and access investors.",
        route: "/playground",
      },
    ]);
  }, []);

  const checkAuthentication = () => {
    try {
      const token = localStorage.getItem("access_token");
      const userData = localStorage.getItem("currentUser");

      if (token) {
        try {
          const payload = JSON.parse(atob(token.split(".")[1] || "{}"));
          if (userData) {
            const user = JSON.parse(userData);
            setCurrentUser(user.name || user.email || payload.sub || "User");
          } else {
            setCurrentUser(payload.sub || "User");
          }
          return;
        } catch (err) {
          console.warn("JWT decode failed, using userData if available");
        }
      }

      if (userData) {
        try {
          const user = JSON.parse(userData);
          setCurrentUser(user.name || user.email || userData || "User");
        } catch (err) {
          setCurrentUser(userData || "User");
        }
      }
    } catch (err) {
      console.error("Authentication check failed:", err);
      localStorage.removeItem("access_token");
      localStorage.removeItem("currentUser");
      setCurrentUser("");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("currentUser");
    setCurrentUser("");
    navigate("/login");
  };

  const toggleFavorite = (serviceName) => {
    setFavorites((prev) =>
      prev.includes(serviceName)
        ? prev.filter((fav) => fav !== serviceName)
        : [...prev, serviceName]
    );
  };

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(search.toLowerCase())
  );

  const renderBackgroundSVG = (name) => {
    switch (name) {
      case "Playground":
        return (
          <svg style={styles.svgBackground} viewBox="0 0 200 150" preserveAspectRatio="xMidYMid slice">
            <g opacity="0.6">
              <line x1="40" y1="130" x2="40" y2="60" stroke="white" strokeWidth="1.5"/>
              <line x1="50" y1="130" x2="50" y2="60" stroke="white" strokeWidth="1.5"/>
              <line x1="40" y1="120" x2="50" y2="120" stroke="white" strokeWidth="1"/>
              <line x1="40" y1="105" x2="50" y2="105" stroke="white" strokeWidth="1"/>
              <line x1="40" y1="90" x2="50" y2="90" stroke="white" strokeWidth="1"/>
              <line x1="40" y1="75" x2="50" y2="75" stroke="white" strokeWidth="1"/>
              <rect x="50" y="55" width="30" height="10" fill="none" stroke="white" strokeWidth="1.5"/>
              <line x1="80" y1="60" x2="120" y2="130" stroke="white" strokeWidth="2"/>
              <line x1="80" y1="65" x2="115" y2="130" stroke="white" strokeWidth="1"/>
            </g>
            <g opacity="0.6">
              <line x1="140" y1="50" x2="180" y2="50" stroke="white" strokeWidth="1.5"/>
              <line x1="145" y1="50" x2="145" y2="130" stroke="white" strokeWidth="1.5"/>
              <line x1="175" y1="50" x2="175" y2="130" stroke="white" strokeWidth="1.5"/>
              <line x1="155" y1="50" x2="155" y2="105" stroke="white" strokeWidth="1"/>
              <line x1="165" y1="50" x2="165" y2="105" stroke="white" strokeWidth="1"/>
              <rect x="150" y="105" width="10" height="3" fill="none" stroke="white" strokeWidth="1"/>
              <rect x="160" y="105" width="10" height="3" fill="none" stroke="white" strokeWidth="1"/>
            </g>
            <g opacity="0.6">
              <line x1="100" y1="110" x2="100" y2="130" stroke="white" strokeWidth="1.5"/>
              <line x1="80" y1="105" x2="120" y2="115" stroke="white" strokeWidth="2"/>
              <line x1="82" y1="105" x2="82" y2="100" stroke="white" strokeWidth="1"/>
              <line x1="118" y1="115" x2="118" y2="120" stroke="white" strokeWidth="1"/>
            </g>
            <line x1="20" y1="130" x2="190" y2="130" stroke="white" strokeWidth="1" opacity="0.4"/>
          </svg>
        );
      default:
        return null;
    }
  };

  if (loading)
    return (
      <div style={{ color: "#031B4F", textAlign: "center", marginTop: "50px" }}>
        Loading...
      </div>
    );

  if (!currentUser) {
    return (
      <div style={styles.loginContainer}>
        <div style={styles.loginCard}>
          <div style={styles.loginIcon}>
            <User size={48} />
          </div>
          <h1 style={styles.loginTitle}>StartUP Console</h1>
          <p style={styles.loginSubtitle}>Please log in to access your console</p>
          <button onClick={() => navigate("/login")} style={styles.loginButton}>
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <aside style={{ ...styles.sidebar, width: sidebarOpen ? "250px" : "70px" }}>
        <div
          style={{
            ...styles.sidebarHeader,
            justifyContent: sidebarOpen ? "space-between" : "center",
          }}
        >
          {sidebarOpen && <h2 style={styles.sidebarTitle}>StartUP</h2>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={styles.menuButton}>
            <Menu size={20} />
          </button>
        </div>

        <nav style={styles.nav}>
          {[
            { name: "All Services", icon: Grid, route: null },
            { name: "Settings", icon: Settings, route: null },
            { name: "Users", icon: User, route: "/users" },
            { name: "Analytics", icon: Star, route: "/analytics" },
          ].map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                style={styles.navItem}
                onClick={() => item.route && navigate(item.route)}
              >
                <Icon size={20} />
                {sidebarOpen && <span style={styles.navText}>{item.name}</span>}
              </div>
            );
          })}
        </nav>

        <div style={styles.userSection}>
          <div style={styles.userInfo}>
            <div style={styles.userAvatar}>
              <User size={16} />
            </div>
            {sidebarOpen && (
              <div style={styles.userDetails}>
                <span style={styles.userName}>{currentUser}</span>
                <button onClick={handleLogout} style={styles.logoutButton}>
                  <LogOut size={14} />
                  <span style={styles.logoutText}>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div style={styles.mainContent}>
        <header style={styles.header}>
          <h1 style={styles.headerTitle}>Console</h1>
          <div style={styles.searchContainer}>
            <input
              type="text"
              placeholder="Search services..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={styles.searchInput}
            />
            <Search style={styles.searchIcon} size={18} />
          </div>
          <div style={styles.headerUser}>
            <span style={styles.welcomeText}>Welcome, {currentUser}</span>
          </div>
        </header>

        <main style={styles.main}>
          {favorites.length > 0 && (
            <>
              <h2 style={styles.servicesTitle}>Favorites</h2>
              <div style={styles.servicesGrid}>
                {services
                  .filter((s) => favorites.includes(s.name))
                  .map((service, index) => (
                    <div
                      key={index}
                      style={{ ...styles.serviceCard, backgroundColor: "#031B4F", position: "relative" }}
                    >
                      {renderBackgroundSVG(service.name)}
                      <div style={{ position: "relative", zIndex: 2 }}>
                        <h3 style={styles.serviceName}>{service.name}</h3>
                        <p style={styles.serviceDescription}>{service.description}</p>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginTop: "16px",
                          position: "relative",
                          zIndex: 2,
                        }}
                      >
                        <button
                          style={styles.serviceButton}
                          onClick={() => navigate(service.route)}
                        >
                          Open
                        </button>
                        <Star
                          size={18}
                          onClick={() => toggleFavorite(service.name)}
                          style={{ cursor: "pointer", color: "#ffd700" }}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </>
          )}

          <h2 style={styles.servicesTitle}>All Services</h2>
          {filteredServices.length === 0 ? (
            <p style={styles.noServices}>No services found.</p>
          ) : (
            <div style={styles.servicesGrid}>
              {filteredServices.map((service, index) => (
                <div
                  key={index}
                  style={{ ...styles.serviceCard, backgroundColor: "#031B4F", position: "relative" }}
                >
                  {renderBackgroundSVG(service.name)}
                  <div style={{ position: "relative", zIndex: 2 }}>
                    <h3 style={styles.serviceName}>{service.name}</h3>
                    <p style={styles.serviceDescription}>{service.description}</p>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: "16px",
                      position: "relative",
                      zIndex: 2,
                    }}
                  >
                    <button
                      style={styles.serviceButton}
                      onClick={() => navigate(service.route)}
                    >
                      Open
                    </button>
                    <Star
                      size={18}
                      onClick={() => toggleFavorite(service.name)}
                      style={{
                        cursor: "pointer",
                        color: favorites.includes(service.name) ? "#ffd700" : "#ffffff",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "'Quicksand', 'Inter', sans-serif",
    backgroundColor: "#F8FAFC",
    color: "#ffffff",
  },
  loginContainer: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "16px",
  },
  loginCard: {
    backgroundColor: "#031B4F",
    borderRadius: "12px",
    boxShadow: "0 8px 32px rgba(3,27,79,0.3)",
    padding: "48px 32px",
    width: "100%",
    maxWidth: "400px",
    textAlign: "center",
  },
  loginIcon: {
    backgroundColor: "#2563EB",
    borderRadius: "50%",
    width: "80px",
    height: "80px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 24px",
    color: "#ffffff",
  },
  loginTitle: {
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "8px",
  },
  loginSubtitle: {
    marginBottom: "32px",
    fontSize: "16px",
  },
  loginButton: {
    backgroundColor: "#2563EB",
    color: "#ffffff",
    border: "none",
    borderRadius: "8px",
    padding: "12px 24px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
  },

  sidebar: {
    backgroundColor: "#031B4F",
    boxShadow: "2px 0 6px rgba(3,27,79,0.3)",
    transition: "width 0.3s ease",
    display: "flex",
    flexDirection: "column",
  },
  sidebarHeader: {
    display: "flex",
    alignItems: "center",
    padding: "16px",
    borderBottom: "1px solid #2563EB",
  },
  sidebarTitle: {
    fontSize: "18px",
    fontWeight: "600",
    margin: 0,
    color: "#ffffff",
  },
  menuButton: {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#ffffff",
    padding: "4px",
  },
  nav: {
    marginTop: "16px",
    flex: 1,
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    padding: "12px 16px",
    cursor: "pointer",
    color: "#ffffff",
    transition: "background-color 0.2s",
  },
  navText: {
    marginLeft: "12px",
    fontWeight: "500",
  },
  userSection: {
    padding: "16px",
    borderTop: "1px solid #2563EB",
    marginTop: "auto",
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  userAvatar: {
    backgroundColor: "#2563EB",
    borderRadius: "50%",
    width: "32px",
    height: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#ffffff",
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: "14px",
    fontWeight: "600",
    marginBottom: "4px",
    color: "#ffffff",
  },
  logoutButton: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    background: "none",
    border: "none",
    fontSize: "12px",
    cursor: "pointer",
    color: "#ffffff",
  },
  logoutText: {
    fontSize: "12px",
  },
  mainContent: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  header: {
    backgroundColor: "#ffffff",
    padding: "16px 24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 2px 4px rgba(3,27,79,0.2)",
  },
  headerTitle: {
    fontSize: "24px",
    fontWeight: "600",
    margin: 0,
    color: "#031B4F",
  },
  searchContainer: {
    position: "relative",
    width: "320px",
  },
  searchInput: {
    width: "100%",
    padding: "10px 10px 10px 36px",
    borderRadius: "8px",
    border: "1px solid #2563EB",
    backgroundColor: "#ffffff",
    fontSize: "14px",
  },
  searchIcon: {
    position: "absolute",
    top: "50%",
    left: "10px",
    transform: "translateY(-50%)",
    color: "#031B4F",
  },
  headerUser: {
    display: "flex",
    alignItems: "center",
  },
  welcomeText: {
    fontSize: "14px",
    color: "#ffffff",
  },
  main: {
    padding: "24px",
    overflowY: "auto",
    flex: 1,
  },
  servicesTitle: {
    fontSize: "18px",
    fontWeight: "600",
    marginBottom: "16px",
    color: "#031B4F",
  },
  noServices: {
    color: "#ffffff",
  },
  servicesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "20px",
  },
  serviceCard: {
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 4px 12px rgba(3,27,79,0.3)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    cursor: "pointer",
    transition: "transform 0.2s",
    color: "#ffffff",
  },
  serviceName: {
    fontSize: "18px",
    fontWeight: "600",
    marginBottom: "8px",
  },
  serviceDescription: {
    fontSize: "14px",
  },
  serviceButton: {
    marginTop: "16px",
    backgroundColor: "#2563EB",
    color: "#ffffff",
    padding: "10px",
    borderRadius: "6px",
    border: "none",
    fontWeight: "bold",
    cursor: "pointer",
  },
  svgBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    opacity: 0.3,
    pointerEvents: "none",
  },
};

export default Console;
