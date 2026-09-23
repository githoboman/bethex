import React from 'react';

export default function Home() {
  return (
    <main className="container">
      {/* Background elements for depth */}
      <div className="bg-orb orb-1"></div>
      <div className="bg-orb orb-2"></div>
      
      <header className="header">
        <div className="logo">Bethex</div>
        <nav className="nav-links">
          <a href="https://www.botchain.ai" target="_blank" rel="noopener noreferrer">BOT Chain</a>
          <a href="https://dex.botchain.ai/#/swap" target="_blank" rel="noopener noreferrer">DEX</a>
          <a href="https://bridge.botchain.ai" target="_blank" rel="noopener noreferrer">Bridge</a>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-content glass-card">
          <span className="badge">LIVE ON BOT CHAIN MAINNET</span>
          <h1 className="title">
            The Future of Decentralized Betting
          </h1>
          <p className="subtitle">
            Experience ultra-fast, secure, and verifiable predictions powered by BOT Chain's high-performance Layer 1 infrastructure. Trade with WBOT and USDT instantly.
          </p>
          
          <div className="cta-group">
            <button className="btn btn-primary" onClick={() => window.open('https://wallet.botchain.ai', '_blank')}>
              Connect Wallet
            </button>
            <button className="btn btn-secondary" onClick={() => window.open('https://faucet.botchain.ai', '_blank')}>
              Get Test BOT
            </button>
          </div>

          <div className="stats-row">
            <div className="stat-item">
              <span className="stat-value">677</span>
              <span className="stat-label">Chain ID</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">EVM</span>
              <span className="stat-label">Compatible</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">&lt;2s</span>
              <span className="stat-label">Finality</span>
            </div>
          </div>
        </div>
      </section>

      <section className="integration-info">
        <h2>Built on Leading Infrastructure</h2>
        <div className="cards-grid">
          <a href="https://scan.botchain.ai" target="_blank" rel="noopener noreferrer" className="integration-card glass-card hoverable">
            <h3>Block Explorer</h3>
            <p>Verify every transaction securely on BOT Scan.</p>
          </a>
          <a href="https://dev-docs.botchain.ai/docs/Developers/quick-guide/" target="_blank" rel="noopener noreferrer" className="integration-card glass-card hoverable">
            <h3>Developer Docs</h3>
            <p>Read the comprehensive guide for BOT Chain integration.</p>
          </a>
          <div className="integration-card glass-card">
            <h3>CertiK Audited</h3>
            <p>Core contracts audited by CertiK for maximum security.</p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>Bethex 2026. Powered by <a href="https://www.botchain.ai" target="_blank" rel="noopener noreferrer">BOT Chain</a></p>
      </footer>
    </main>
  );
}
