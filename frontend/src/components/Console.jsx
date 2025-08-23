import React, { useEffect, useState } from "react";
import { Search, Menu, Settings, Grid, User, LogOut, Star } from "lucide-react";

const Console = () => {
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentUser, setCurrentUser] = useState('');
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    checkAuthentication();
    setServices([
      {
        name: "Playground",
        description: "Network with fellow Businesses and have access to investors.",
        route: "/playground",
      },
      {
        name: "Users",
        description: "Manage users and authentication.",
        route: "/users",
      },
      {
        name: "Analytics",
        description: "Track and visualize your data usage.",
        route: "/analytics",
      },
    ]);
  }, []);

  const checkAuthentication = () => {
    try {
      const token = localStorage.getItem('access_token');
      const userData = localStorage.getItem('currentUser');

      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1] || '{}'));
          if (userData) {
            const user = JSON.parse(userData);
            setCurrentUser(user.name || user.email || payload.sub || 'User');
          } else {
            setCurrentUser(payload.sub || 'User');
          }
          return;
        } catch (err) {
          console.warn('JWT decode failed, using userData if available');
        }
      }

      if (userData) {
        try {
          const user = JSON.parse(userData);
          setCurrentUser(user.name || user.email || userData || 'User');
        } catch (err) {
          setCurrentUser(userData || 'User');
        }
      }
    } catch (err) {
      console.error('Authentication check failed:', err);
      localStorage.removeItem('access_token');
      localStorage.removeItem('currentUser');
      setCurrentUser('');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('currentUser');
    setCurrentUser('');
    window.location.href = '/login';
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

  if (loading) return <div style={{ color: '#2563eb', textAlign: 'center', marginTop: '50px' }}>Loading...</div>;

  if (!currentUser) {
    return (
      <div style={styles.loginContainer}>
        <div style={styles.loginCard}>
          <div style={styles.loginIcon}>
            <User size={48} />
          </div>
          <h1 style={styles.loginTitle}>StartUP Console</h1>
          <p style={styles.loginSubtitle}>Please log in to access your console</p>
          <button 
            onClick={() => window.location.href = '/login'} 
            style={styles.loginButton}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <aside style={{
        ...styles.sidebar,
        width: sidebarOpen ? "250px" : "70px",
      }}>
        <div style={{
          ...styles.sidebarHeader,
          justifyContent: sidebarOpen ? "space-between" : "center",
        }}>
          {sidebarOpen && <h2 style={styles.sidebarTitle}>StartUP</h2>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={styles.menuButton}
          >
            <Menu size={20} />
          </button>
        </div>
        <nav style={styles.nav}>
          <div style={styles.navItem}>
            <Grid size={20} />
            {sidebarOpen && <span style={styles.navText}>All Services</span>}
          </div>
          <div style={styles.navItem}>
            <Settings size={20} />
            {sidebarOpen && <span style={styles.navText}>Settings</span>}
          </div>
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
        {/* Top Bar */}
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

        {/* Favorites Section */}
        {favorites.length > 0 && (
          <div style={styles.section}>
            <h2 style={styles.servicesTitle}>Favorites</h2>
            <div style={styles.servicesGrid}>
              {services
                .filter((s) => favorites.includes(s.name))
                .map((service, index) => (
                  <div key={index} style={styles.serviceCard}>
                    <div>
                      <div style={styles.serviceIcon}>{service.name[0]}</div>
                      <h3 style={styles.serviceName}>{service.name}</h3>
                      <p style={styles.serviceDescription}>{service.description}</p>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <button
                        style={styles.serviceButton}
                        onClick={() => (window.location.href = service.route)}
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
          </div>
        )}

        {/* Services Grid */}
        <main style={styles.main}>
          <h2 style={styles.servicesTitle}>All Services</h2>
          {filteredServices.length === 0 ? (
            <p style={styles.noServices}>No services found.</p>
          ) : (
            <div style={styles.servicesGrid}>
              {filteredServices.map((service, index) => (
                <div key={index} style={styles.serviceCard}>
                  <div>
                    <div style={styles.serviceIcon}>{service.name[0]}</div>
                    <h3 style={styles.serviceName}>{service.name}</h3>
                    <p style={styles.serviceDescription}>{service.description}</p>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <button
                      style={styles.serviceButton}
                      onClick={() => (window.location.href = service.route)}
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
      height: "100vh",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      backgroundColor: "#ffffff",
      color: "#2563eb"
    },
  
    loginContainer: {
      minHeight: "100vh",
      backgroundColor: "#ffffff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "16px",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
    },
  
    loginCard: {
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      boxShadow: "0 8px 32px rgba(37, 99, 235, 0.2)",
      padding: "48px 32px",
      width: "100%",
      maxWidth: "400px",
      textAlign: "center"
    },
  
    loginIcon: {
      backgroundColor: "#2563eb",
      borderRadius: "50%",
      width: "80px",
      height: "80px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "0 auto 24px",
      color: "#ffffff"
    },
  
    loginTitle: {
      fontSize: "28px",
      fontWeight: "bold",
      color: "#2563eb",
      marginBottom: "8px"
    },
  
    loginSubtitle: {
      color: "#2563eb",
      marginBottom: "32px",
      fontSize: "16px"
    },
  
    loginMessage: {
      backgroundColor: "#f3f4f6",
      border: "1px solid #dbeafe",
      borderRadius: "8px",
      padding: "20px",
      marginBottom: "24px",
      textAlign: "left",
      color: "#2563eb"
    },
  
    loginHint: {
      marginTop: "16px",
      fontSize: "14px",
      color: "#2563eb"
    },
  
    loginButton: {
      backgroundColor: "#2563eb",
      color: "#ffffff",
      border: "none",
      borderRadius: "8px",
      padding: "12px 24px",
      fontSize: "16px",
      fontWeight: "bold",
      cursor: "pointer",
      transition: "background-color 0.2s"
    },
  
    sidebar: {
      backgroundColor: "#ffffff",
      boxShadow: "2px 0 6px rgba(37, 99, 235, 0.2)",
      transition: "width 0.3s ease",
      display: "flex",
      flexDirection: "column",
      position: "relative"
    },
  
    sidebarHeader: {
      display: "flex",
      alignItems: "center",
      padding: "16px",
      borderBottom: "1px solid #dbeafe"
    },
  
    sidebarTitle: {
      fontSize: "18px",
      fontWeight: "bold",
      margin: 0,
      color: "#2563eb"
    },
  
    menuButton: {
      background: "none",
      border: "none",
      cursor: "pointer",
      color: "#2563eb",
      padding: "4px"
    },
  
    nav: {
      marginTop: "16px",
      flex: 1
    },
  
    navItem: {
      display: "flex",
      alignItems: "center",
      padding: "12px 16px",
      cursor: "pointer",
      color: "#2563eb",
      transition: "background-color 0.2s",
      borderRadius: "0"
    },
  
    navText: {
      marginLeft: "12px"
    },
  
    userSection: {
      padding: "16px",
      borderTop: "1px solid #dbeafe",
      marginTop: "auto"
    },
  
    userInfo: {
      display: "flex",
      alignItems: "center",
      gap: "12px"
    },
  
    userAvatar: {
      backgroundColor: "#2563eb",
      borderRadius: "50%",
      width: "32px",
      height: "32px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#ffffff"
    },
  
    userDetails: {
      flex: 1
    },
  
    userName: {
      display: "block",
      fontSize: "14px",
      fontWeight: "500",
      color: "#2563eb",
      marginBottom: "4px"
    },
  
    logoutButton: {
      display: "flex",
      alignItems: "center",
      gap: "4px",
      background: "none",
      border: "none",
      color: "#2563eb",
      fontSize: "12px",
      cursor: "pointer",
      padding: "0"
    },
  
    logoutText: {
      fontSize: "12px"
    },
  
    mainContent: {
      flex: 1,
      display: "flex",
      flexDirection: "column"
    },
  
    header: {
      backgroundColor: "#ffffff",
      padding: "16px 24px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      boxShadow: "0 2px 4px rgba(37, 99, 235, 0.1)"
    },
  
    headerTitle: {
      fontSize: "24px",
      fontWeight: "bold",
      margin: 0,
      color: "#2563eb"
    },
  
    searchContainer: {
      position: "relative",
      width: "320px"
    },
  
    searchInput: {
      width: "100%",
      padding: "10px 10px 10px 36px",
      borderRadius: "6px",
      border: "1px solid #dbeafe",
      backgroundColor: "#ffffff",
      color: "#2563eb",
      fontSize: "14px",
      boxSizing: "border-box"
    },
  
    searchIcon: {
      position: "absolute",
      top: "50%",
      left: "10px",
      transform: "translateY(-50%)",
      color: "#2563eb"
    },
  
    headerUser: {
      display: "flex",
      alignItems: "center"
    },
  
    welcomeText: {
      color: "#2563eb",
      fontSize: "14px"
    },
  
    hero: {
      backgroundColor: "#ffffff",
      color: "#2563eb",
      padding: "24px"
    },
  
    heroTitle: {
      fontSize: "22px",
      fontWeight: "bold",
      margin: 0
    },
  
    heroSubtitle: {
      marginTop: "6px",
      fontSize: "14px",
      opacity: 0.8
    },
  
    heroButtons: {
      marginTop: "16px",
      display: "flex",
      gap: "12px"
    },
  
    primaryButton: {
      backgroundColor: "#2563eb",
      color: "#ffffff",
      padding: "10px 16px",
      borderRadius: "6px",
      fontWeight: "bold",
      border: "none",
      cursor: "pointer"
    },
  
    secondaryButton: {
      backgroundColor: "#dbeafe",
      color: "#2563eb",
      padding: "10px 16px",
      borderRadius: "6px",
      fontWeight: "bold",
      border: "none",
      cursor: "pointer"
    },
  
    main: {
      padding: "24px",
      overflowY: "auto",
      flex: 1
    },
  
    servicesTitle: {
      fontSize: "18px",
      fontWeight: "bold",
      marginBottom: "16px",
      color: "#2563eb"
    },
  
    noServices: {
      color: "#2563eb"
    },
  
    servicesGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
      gap: "20px"
    },
  
    serviceCard: {
      backgroundColor: "#2563eb",
      borderRadius: "12px",
      padding: "20px",
      boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      transition: "transform 0.2s, box-shadow 0.2s",
      cursor: "pointer",
      color: "#ffffff"
    },
  
    serviceIcon: {
      width: "48px",
      height: "48px",
      backgroundColor: "#ffffff",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: "16px",
      fontSize: "20px",
      color: "#2563eb",
      fontWeight: "bold"
    },
  
    serviceName: {
      fontSize: "18px",
      fontWeight: "bold",
      marginBottom: "8px",
      color: "#ffffff"
    },
  
    serviceDescription: {
      fontSize: "14px",
      color: "#dbeafe"
    },
  
    serviceButton: {
      marginTop: "16px",
      backgroundColor: "#ffffff",
      color: "#2563eb",
      padding: "10px",
      borderRadius: "6px",
      border: "none",
      fontWeight: "bold",
      cursor: "pointer"
    }
  };
  
  
export default Console;