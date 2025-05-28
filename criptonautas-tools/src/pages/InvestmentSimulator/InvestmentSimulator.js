import React, { useState } from 'react';
import Layout from '../../components/Layout/Layout';
import Card from '../../components/Card/Card';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import styles from './InvestmentSimulator.module.css';

const InvestmentSimulator = () => {
  const [cryptoId, setCryptoId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');

  const [portfolio, setPortfolio] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // For success feedback

  const handleAddPortfolioItem = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage(''); // Clear previous success message

    const trimmedCryptoId = cryptoId.trim();

    if (!trimmedCryptoId || !quantity || !purchasePrice) {
      setError('Please fill in all fields to add an item. Cryptocurrency ID cannot be empty.');
      return;
    }
    const numQuantity = parseFloat(quantity);
    const numPurchasePrice = parseFloat(purchasePrice);

    if (isNaN(numQuantity) || numQuantity <= 0) {
      setError('Quantity must be a positive number.');
      return;
    }
    if (isNaN(numPurchasePrice) || numPurchasePrice <= 0) {
      setError('Purchase Price must be a positive number.');
      return;
    }

    // Check if crypto already exists, if so, update it (or decide on strategy: allow multiple entries or update)
    // For now, allowing multiple distinct entries for simplicity.
    // A more advanced version might consolidate or update existing entries.
    setPortfolio([
      ...portfolio,
      { 
        id: trimmedCryptoId.toLowerCase(), // Store ID in lowercase for consistency
        name: trimmedCryptoId, // Keep original casing for display if desired
        quantity: numQuantity, 
        purchasePrice: numPurchasePrice 
      }
    ]);

    setSuccessMessage(`${trimmedCryptoId} added to portfolio!`);
    setTimeout(() => setSuccessMessage(''), 3000); // Clear after 3 seconds

    // Clear input fields
    setCryptoId('');
    setQuantity('');
    setPurchasePrice('');
  };

  return (
    <Layout>
      <div className={styles.simulatorContainer}>
        <Card className={styles.formCard}>
          <h2 className={styles.title}>Investment Simulator</h2>
          <form onSubmit={handleAddPortfolioItem}>
            <div className={styles.inputGroup}>
              <label htmlFor="cryptoId">Cryptocurrency ID</label>
              <Input
                type="text"
                id="cryptoId"
                value={cryptoId}
                onChange={(e) => setCryptoId(e.target.value)}
                placeholder="e.g., bitcoin, ethereum"
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="quantity">Quantity</label>
              <Input
                type="number"
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="e.g., 1.5"
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="purchasePrice">Purchase Price (BRL per unit)</label>
              <Input
                type="number"
                id="purchasePrice"
                value={purchasePrice}
                onChange={(e) => setPurchasePrice(e.target.value)}
                placeholder="e.g., 300000"
              />
            </div>
            <Button type="submit">Add to Portfolio</Button>
            {error && <p className={styles.error}>{error}</p>}
            {successMessage && <p className={styles.success}>{successMessage}</p>}
          </form>
        </Card>

        {portfolio.length > 0 && (
          <Card className={styles.portfolioCard}>
            <h3 className={styles.portfolioTitle}>My Fictitious Portfolio</h3>
            <div className={styles.portfolioList}>
              {portfolio.map((item, index) => (
                <Card key={index} className={styles.portfolioItemCard}>
                  <h4>{item.name.toUpperCase()}</h4>
                  <p>Quantity: {item.quantity}</p>
                  <p>Purchase Price: R$ {item.purchasePrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  {/* Placeholder for future data like Current Price, P/L */}
                </Card>
              ))}
            </div>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default InvestmentSimulator;
