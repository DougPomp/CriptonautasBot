import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Layout.module.css';

const Layout = ({ children }) => {
  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.headerContainer}>
          <Link to="/" className={styles.logoLink}>
            <h1>Criptonautas Tools</h1>
          </Link>
          <nav className={styles.nav}>
            <Link to="/profit-loss-calculator" className={styles.navLink}>Profit/Loss Calculator</Link>
            <Link to="/converter" className={styles.navLink}>Crypto-Fiat Converter</Link>
            <Link to="/simulator" className={styles.navLink}>Investment Simulator</Link>
            <Link to="/analyzer" className={styles.navLink}>Portfolio Analyzer</Link>
            <Link to="/ai-suggestions" className={styles.navLink}>AI Suggestions Bot</Link>
            <Link to="/glossary" className={styles.navLink}>Crypto Glossary</Link>
            {/* Add more links as new tools are added */}
          </nav>
        </div>
      </header>
      <main className={styles.mainContent}>
        {children}
      </main>
      <footer className={styles.footer}>
        <p>&copy; {new Date().getFullYear()} Criptonautas. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;
