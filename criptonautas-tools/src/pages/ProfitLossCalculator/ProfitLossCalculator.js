import React, { useState } from 'react';
import Layout from '../../components/Layout/Layout';
import Card from '../../components/Card/Card';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import { fetchCurrentPrice } from '../../services/cryptoApi';
import styles from './ProfitLossCalculator.module.css';

const ProfitLossCalculator = () => {
  const [purchaseAmount, setPurchaseAmount] = useState('');
  const [cryptoId, setCryptoId] = useState('');
  const [quantity, setQuantity] = useState('');
  // const [purchaseDate, setPurchaseDate] = useState(''); // Optional for now

  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResults(null);

    if (!purchaseAmount || !cryptoId || !quantity) {
      setError('Please fill in all required fields.');
      return;
    }
    if (isNaN(parseFloat(purchaseAmount)) || parseFloat(purchaseAmount) <= 0) {
      setError('Purchase Amount must be a positive number.');
      return;
    }
    if (isNaN(parseFloat(quantity)) || parseFloat(quantity) <= 0) {
      setError('Quantity must be a positive number.');
      return;
    }

    setLoading(true);
    try {
      const currentPriceBRL = await fetchCurrentPrice(cryptoId.toLowerCase());
      // The fetchCurrentPrice function now directly returns the BRL price or throws an error,
      // so the undefined check below is no longer necessary.

      const totalCurrentValue = parseFloat(currentPriceBRL) * parseFloat(quantity);
      const profitLoss = totalCurrentValue - parseFloat(purchaseAmount);
      const profitLossPercentage = (profitLoss / parseFloat(purchaseAmount)) * 100;

      setResults({
        currentPriceBRL,
        totalCurrentValue,
        profitLoss,
        profitLossPercentage,
      });

    } catch (err) {
      // err.message should now be a user-friendly message from fetchCurrentPrice
      setError(err.message || 'An unexpected error occurred while fetching data.'); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className={styles.calculatorContainer}>
        <Card className={styles.calculatorCard}>
          <h2 className={styles.title}>Profit/Loss Calculator</h2>
          <form onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label htmlFor="purchaseAmount">Purchase Value (BRL)</label>
              <Input
                type="number"
                id="purchaseAmount"
                value={purchaseAmount}
                onChange={(e) => setPurchaseAmount(e.target.value)}
                placeholder="e.g., 1000"
                disabled={loading}
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="cryptoId">Cryptocurrency ID</label>
              <Input
                type="text"
                id="cryptoId"
                value={cryptoId}
                onChange={(e) => setCryptoId(e.target.value)}
                placeholder="e.g., bitcoin, ethereum"
                disabled={loading}
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="quantity">Quantity</label>
              <Input
                type="number"
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="e.g., 0.5"
                disabled={loading}
              />
            </div>
            {/* 
            <div className={styles.inputGroup}>
              <label htmlFor="purchaseDate">Purchase Date (Optional)</label>
              <Input
                type="date"
                id="purchaseDate"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                disabled={loading}
              />
            </div>
            */}
            <Button type="submit" disabled={loading}>
              {loading ? 'Calculating...' : 'Calculate Profit/Loss'}
            </Button>
          </form>

          {error && <p className={styles.error}>{error}</p>}

          {results && (
            <div className={styles.resultsSection}>
              <h3 className={styles.resultsTitle}>Results:</h3>
              <p>Current Price of {cryptoId.toUpperCase()}: <strong>R$ {results.currentPriceBRL.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></p>
              <p>Total Current Value: <strong>R$ {results.totalCurrentValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></p>
              <p className={results.profitLoss >= 0 ? styles.profit : styles.loss}>
                Profit/Loss: <strong>R$ {results.profitLoss.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
              </p>
              <p className={results.profitLossPercentage >= 0 ? styles.profit : styles.loss}>
                Profit/Loss Percentage: <strong>{results.profitLossPercentage.toFixed(2)}%</strong>
              </p>
            </div>
          )}
        </Card>
      </div>
    </Layout>
  );
};

export default ProfitLossCalculator;
