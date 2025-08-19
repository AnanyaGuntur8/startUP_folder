import React, { useEffect, useState } from "react";
import { Search, Menu, Settings, Grid, User, LogOut } from "lucide-react";

const Console = () => {
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentUser, setCurrentUser] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthentication();
    setServices([
      {
        name: "Playground",
        description: "Experiment and test your code in the Playground.",
        route: "/playground",
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

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div style={{ color: '#fff', textAlign: 'center', marginTop: '50px' }}>Loading...</div>;

  if (!currentUser) {
    return (
      <div style={styles.loginContainer}>
        <div style={styles.loginCard}>
          <div style={styles.loginIcon}>
            <User size={48} />
          </div>
          <h1 style={styles.loginTitle}>StartUP Console</h1>
          <p style={styles.loginSubtitle}>Please log in to access your console</p>
          <div style={styles.loginMessage}>
            <p><strong>Authentication Required</strong></p>
            <p>Please log in through your authentication system.</p>
            <p style={styles.loginHint}>
              Your login should store either:
              <br />• JWT token in 'access_token'
              <br />• User data in 'currentUser'
            </p>
          </div>
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

        {/* User section at bottom of sidebar */}
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
          <h1 style={styles.headerTitle}>StartUP Console</h1>
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

        {/* Hero Section */}
        <div style={styles.hero}>
          <h2 style={styles.heroTitle}>Welcome to your Console</h2>
          <p style={styles.heroSubtitle}>
            Manage your services and infrastructure efficiently.
          </p>
          <div style={styles.heroButtons}>
            <button style={styles.primaryButton}>
              Create Resource
            </button>
            <button style={styles.secondaryButton}>
              View Dashboard
            </button>
          </div>
        </div>

        {/* Services Grid */}
        <main style={styles.main}>
          <h2 style={styles.servicesTitle}>
            Available Services
          </h2>
          {filteredServices.length === 0 ? (
            <p style={styles.noServices}>No services found.</p>
          ) : (
            <div style={styles.servicesGrid}>
              {filteredServices.map((service, index) => (
                <div
                  key={index}
                  style={styles.serviceCard}
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
                    <div style={styles.serviceIcon}>
                      {service.name[0]}
                    </div>
                    <h3 style={styles.serviceName}>
                      {service.name}
                    </h3>
                    <p style={styles.serviceDescription}>{service.description}</p>
                  </div>
                  <button style={styles.serviceButton}>
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

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    backgroundColor: "#121212",
    color: "#fff"
  },

  loginContainer: {
    minHeight: "100vh",
    backgroundColor: "#121212",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "16px",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
  },

  loginCard: {
    backgroundColor: "#1e1e1e",
    borderRadius: "12px",
    boxShadow: "0 8px 32px rgba(0,0,0,0.7)",
    padding: "48px 32px",
    width: "100%",
    maxWidth: "400px",
    textAlign: "center"
  },

  loginIcon: {
    backgroundColor: "#333",
    borderRadius: "50%",
    width: "80px",
    height: "80px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 24px",
    color: "#fff"
  },

  loginTitle: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#fff",
    marginBottom: "8px"
  },

  loginSubtitle: {
    color: "#aaa",
    marginBottom: "32px",
    fontSize: "16px"
  },

  loginMessage: {
    backgroundColor: "#2a2a2a",
    border: "1px solid #444",
    borderRadius: "8px",
    padding: "20px",
    marginBottom: "24px",
    textAlign: "left"
  },

  loginHint: {
    marginTop: "16px",
    fontSize: "14px",
    color: "#888"
  },

  loginButton: {
    backgroundColor: "#fff",
    color: "#1e1e1e",
    border: "none",
    borderRadius: "8px",
    padding: "12px 24px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "background-color 0.2s"
  },

  sidebar: {
    backgroundColor: "#1e1e1e",
    boxShadow: "2px 0 6px rgba(0,0,0,0.5)",
    transition: "width 0.3s ease",
    display: "flex",
    flexDirection: "column",
    position: "relative"
  },

  sidebarHeader: {
    display: "flex",
    alignItems: "center",
    padding: "16px",
    borderBottom: "1px solid #333"
  },

  sidebarTitle: {
    fontSize: "18px",
    fontWeight: "bold",
    margin: 0
  },

  menuButton: {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#fff",
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
    color: "#fff",
    transition: "background-color 0.2s",
    borderRadius: "0"
  },

  navText: {
    marginLeft: "12px"
  },

  userSection: {
    padding: "16px",
    borderTop: "1px solid #333",
    marginTop: "auto"
  },

  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "12px"
  },

  userAvatar: {
    backgroundColor: "#333",
    borderRadius: "50%",
    width: "32px",
    height: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff"
  },

  userDetails: {
    flex: 1
  },

  userName: {
    display: "block",
    fontSize: "14px",
    fontWeight: "500",
    color: "#fff",
    marginBottom: "4px"
  },

  logoutButton: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    background: "none",
    border: "none",
    color: "#888",
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
    backgroundColor: "#1e1e1e",
    padding: "16px 24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 2px 4px rgba(0,0,0,0.5)"
  },

  headerTitle: {
    fontSize: "24px",
    fontWeight: "bold",
    margin: 0
  },

  searchContainer: {
    position: "relative",
    width: "320px"
  },

  searchInput: {
    width: "100%",
    padding: "10px 10px 10px 36px",
    borderRadius: "6px",
    border: "1px solid #555",
    backgroundColor: "#2a2a2a",
    color: "#fff",
    fontSize: "14px",
    boxSizing: "border-box"
  },

  searchIcon: {
    position: "absolute",
    top: "50%",
    left: "10px",
    transform: "translateY(-50%)",
    color: "#aaa"
  },

  headerUser: {
    display: "flex",
    alignItems: "center"
  },

  welcomeText: {
    color: "#aaa",
    fontSize: "14px"
  },

  hero: {
    backgroundColor: "#2a2a2a",
    color: "#fff",
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
    backgroundColor: "#fff",
    color: "#1e1e1e",
    padding: "10px 16px",
    borderRadius: "6px",
    fontWeight: "bold",
    border: "none",
    cursor: "pointer"
  },

  secondaryButton: {
    backgroundColor: "#444",
    color: "#fff",
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
    marginBottom: "16px"
  },

  noServices: {
    color: "#888"
  },

  servicesGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "20px"
  },

  serviceCard: {
    backgroundColor: "#1e1e1e",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    transition: "transform 0.2s, box-shadow 0.2s",
    cursor: "pointer"
  },

  serviceIcon: {
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
    fontWeight: "bold"
  },

  serviceName: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "8px"
  },

  serviceDescription: {
    fontSize: "14px",
    color: "#aaa"
  },

  serviceButton: {
    marginTop: "16px",
    backgroundColor: "#fff",
    color: "#1e1e1e",
    padding: "10px",
    borderRadius: "6px",
    border: "none",
    fontWeight: "bold",
    cursor: "pointer"
  }
};

export default Console;