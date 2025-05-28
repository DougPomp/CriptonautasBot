import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ProfitLossCalculator from './pages/ProfitLossCalculator/ProfitLossCalculator';
import CryptoFiatConverter from './pages/CryptoFiatConverter/CryptoFiatConverter';
import InvestmentSimulator from './pages/InvestmentSimulator/InvestmentSimulator';
import PortfolioAnalyzer from './pages/PortfolioAnalyzer/PortfolioAnalyzer';
import AISuggestionsBot from './pages/AISuggestionsBot/AISuggestionsBot';
import CryptoGlossary from './pages/CryptoGlossary/CryptoGlossary'; // Import the Glossary
import Layout from './components/Layout/Layout'; 
import './App.css'; 

// A simple Home component for the root path
const HomePage = () => (
  <Layout>
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h2>Welcome to Criptonautas Tools</h2>
      <p>Select a tool from the navigation.</p>
      {/* Links to tools for easy access from home */}
      <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
        <Link to="/profit-loss-calculator" style={{ color: '#00ffff', textDecoration: 'none', fontSize: '1.1rem' }}>
          Profit/Loss Calculator
        </Link>
        <Link to="/converter" style={{ color: '#00ffff', textDecoration: 'none', fontSize: '1.1rem' }}>
          Crypto-Fiat Converter
        </Link>
        <Link to="/simulator" style={{ color: '#00ffff', textDecoration: 'none', fontSize: '1.1rem' }}>
          Investment Simulator
        </Link>
        <Link to="/analyzer" style={{ color: '#00ffff', textDecoration: 'none', fontSize: '1.1rem' }}>
          Portfolio Analyzer
        </Link>
        <Link to="/ai-suggestions" style={{ color: '#00ffff', textDecoration: 'none', fontSize: '1.1rem' }}>
          AI Suggestions Bot
        </Link>
        <Link to="/glossary" style={{ color: '#00ffff', textDecoration: 'none', fontSize: '1.1rem' }}>
          Crypto Glossary
        </Link>
      </div>
    </div>
  </Layout>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/profit-loss-calculator" element={<ProfitLossCalculator />} />
        <Route path="/converter" element={<CryptoFiatConverter />} />
        <Route path="/simulator" element={<InvestmentSimulator />} />
        <Route path="/analyzer" element={<PortfolioAnalyzer />} />
        <Route path="/ai-suggestions" element={<AISuggestionsBot />} />
        <Route path="/glossary" element={<CryptoGlossary />} /> {/* Add route for Glossary */}
        {/* Add other routes here as the application grows */}
      </Routes>
    </Router>
  );
}

export default App;
