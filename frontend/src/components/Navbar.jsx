function Navbar() {
  return (
    <header className="navbar">
      <div>
        <p className="navbar-label">ADMIN PANEL</p>
        <h1>Welcome back, Mitali</h1>
      </div>

      <div className="admin-badge">
        <div className="admin-avatar">M</div>

        <div>
          <strong>Administrator</strong>
          <span>Portfolio CMS</span>
        </div>
      </div>
    </header>
  );
}

export default Navbar;