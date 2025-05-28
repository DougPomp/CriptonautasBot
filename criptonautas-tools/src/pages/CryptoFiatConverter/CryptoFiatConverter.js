import React, { useState } from 'react';
import Layout from '../../components/Layout/Layout';
import Card from '../../components/Card/Card';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import { fetchExchangeRate } from '../../services/cryptoApi';
import styles from './CryptoFiatConverter.module.css';

const CryptoFiatConverter = () => {
  const [amount, setAmount] = useState('');
  const [fromCryptoId, setFromCryptoId] = useState('bitcoin'); // Default
  const [toFiatId, setToFiatId] = useState('brl'); // Default

  const [conversionResult, setConversionResult] = useState(null);
  const [exchangeRateUsed, setExchangeRateUsed] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setConversionResult(null);
    setExchangeRateUsed(null);

    if (!amount || !fromCryptoId || !toFiatId) {
      setError('Please fill in all fields.');
      return;
    }
    if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      setError('Amount must be a positive number.');
      return;
    }

    setLoading(true);
    try {
      const rate = await fetchExchangeRate(fromCryptoId.toLowerCase(), toFiatId.toLowerCase());
      const rate = await fetchExchangeRate(fromCryptoId.toLowerCase(), toFiatId.toLowerCase());
      // fetchExchangeRate now directly returns the rate or throws an error,
      // so the undefined/null check below is no longer necessary.

      const convertedValue = parseFloat(amount) * rate;
      setConversionResult(convertedValue);
      setExchangeRateUsed(rate);

    } catch (err) {
      // err.message should now be a user-friendly message from fetchExchangeRate
      setError(err.message || 'An unexpected error occurred during conversion.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className={styles.converterContainer}>
        <Card className={styles.converterCard}>
          <h2 className={styles.title}>Crypto-Fiat Converter</h2>
          <form onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label htmlFor="amount">Amount</label>
              <Input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g., 1.5"
                disabled={loading}
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="fromCryptoId">From Cryptocurrency ID</label>
              <Input
                type="text"
                id="fromCryptoId"
                value={fromCryptoId}
                onChange={(e) => setFromCryptoId(e.target.value)}
                placeholder="e.g., bitcoin, ethereum"
                disabled={loading}
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="toFiatId">To Fiat Currency ID</label>
              <Input
                type="text"
                id="toFiatId"
                value={toFiatId}
                onChange={(e) => setToFiatId(e.target.value)}
                placeholder="e.g., brl, usd, eur"
                disabled={loading}
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? 'Converting...' : 'Convert'}
            </Button>
          </form>

          {error && <p className={styles.error}>{error}</p>}

          {conversionResult !== null && exchangeRateUsed !== null && (
            <div className={styles.resultsSection}>
              <h3 className={styles.resultsTitle}>Conversion Result:</h3>
              <p>
                <strong>{amount} {fromCryptoId.toUpperCase()}</strong> is equivalent to <br />
                <span className={styles.convertedAmount}>
                  {conversionResult.toLocaleString('pt-BR', { style: 'currency', currency: toFiatId.toUpperCase(), minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </p>
              <p className={styles.exchangeRate}>
                (Exchange Rate: 1 {fromCryptoId.toUpperCase()} = {exchangeRateUsed.toLocaleString('pt-BR', { style: 'currency', currency: toFiatId.toUpperCase(), minimumFractionDigits: 2, maximumFractionDigits: 8 })})
              </p>
            </div>
          )}
        </Card>
      </div>
    </Layout>
  );
};

export default CryptoFiatConverter;
