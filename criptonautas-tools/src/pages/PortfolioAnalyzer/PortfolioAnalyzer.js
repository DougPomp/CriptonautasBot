import React, { useState, useEffect, useCallback } from 'react';
import Layout from '../../components/Layout/Layout';
import Card from '../../components/Card/Card';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import { fetchCurrentPrice } from '../../services/cryptoApi';
import styles from './PortfolioAnalyzer.module.css';

const PortfolioAnalyzer = () => {
  const [cryptoIdInput, setCryptoIdInput] = useState('');
  const [quantityInput, setQuantityInput] = useState('');
  const [avgPurchasePriceInput, setAvgPurchasePriceInput] = useState('');

  const [holdings, setHoldings] = useState([]);
  const [totalPortfolioValue, setTotalPortfolioValue] = useState(0);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // For success feedback
  const [loading, setLoading] = useState(false); // For API calls (add/refresh)

  const calculatePortfolioMetrics = useCallback(async (currentHoldings) => {
    if (currentHoldings.length === 0) {
      setTotalPortfolioValue(0);
      setHoldings([]);
      return;
    }

    setLoading(true);
    let newTotalValue = 0;
    const updatedHoldings = await Promise.all(
      currentHoldings.map(async (holding) => {
        try {
          const currentPrice = await fetchCurrentPrice(holding.id);
          const currentValue = currentPrice * holding.quantity;
          newTotalValue += currentValue;
          // Clear previous error for this holding if price fetch is successful
          return { ...holding, currentPrice, currentValue, error: null }; 
        } catch (err) {
          console.error(`Failed to fetch price for ${holding.id}:`, err);
          // Use err.message from fetchCurrentPrice for specific feedback
          return { ...holding, currentPrice: holding.currentPrice || 0, currentValue: holding.currentValue || 0, error: err.message || 'Price fetch failed' };
        }
      })
    );
    
    const finalHoldings = updatedHoldings.map(holding => ({
      ...holding,
      portfolioPercentage: newTotalValue > 0 ? (holding.currentValue / newTotalValue) * 100 : 0,
    }));

    setHoldings(finalHoldings);
    setTotalPortfolioValue(newTotalValue);
    setLoading(false);
  }, []);


  const handleAddHolding = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage(''); // Clear previous success message

    const trimmedCryptoId = cryptoIdInput.trim();

    if (!trimmedCryptoId || !quantityInput || !avgPurchasePriceInput) {
      setError('Please fill in all fields. Cryptocurrency ID cannot be empty.');
      return;
    }
    const quantity = parseFloat(quantityInput);
    const avgPurchasePrice = parseFloat(avgPurchasePriceInput);

    if (isNaN(quantity) || quantity <= 0) {
      setError('Quantity must be a positive number.');
      return;
    }
    if (isNaN(avgPurchasePrice) || avgPurchasePrice <= 0) {
      setError('Average Purchase Price must be a positive number.');
      return;
    }
    
    // Check if holding already exists (by ID)
    const existingHoldingIndex = holdings.findIndex(h => h.id === trimmedCryptoId.toLowerCase());

    let updatedHoldings;
    if (existingHoldingIndex > -1) {
      // Update existing holding: recalculate avg purchase price and quantity
      // This is a common approach, though others exist (e.g., separate lots)
      updatedHoldings = holdings.map((h, index) => {
        if (index === existingHoldingIndex) {
          const existingTotalValue = h.avgPurchasePrice * h.quantity;
          const newTotalValue = avgPurchasePrice * quantity;
          const totalQuantity = h.quantity + quantity;
          return {
            ...h,
            quantity: totalQuantity,
            avgPurchasePrice: (existingTotalValue + newTotalValue) / totalQuantity,
          };
        }
        return h;
      });
    } else {
      // Add new holding
      updatedHoldings = [
        ...holdings,
        {
          id: trimmedCryptoId.toLowerCase(),
          name: trimmedCryptoId, // Keep original casing for display
          quantity,
          avgPurchasePrice,
          currentPrice: 0, // Will be fetched
          currentValue: 0, // Will be calculated
          portfolioPercentage: 0, // Will be calculated
          error: null, // Initialize error as null
        },
      ];
    }
    
    // Optimistically set inputs to clear and show success message before API call for perceived speed
    setSuccessMessage(`${trimmedCryptoId} ${existingHoldingIndex > -1 ? 'updated in' : 'added to'} portfolio! Fetching latest data...`);
    setCryptoIdInput('');
    setQuantityInput('');
    setAvgPurchasePriceInput('');

    try {
      await calculatePortfolioMetrics(updatedHoldings);
      // Clear success message after calculations are done if it was set too early, or set a new one.
      // For now, the optimistic message is fine.
      // setTimeout(() => setSuccessMessage(''), 3000); // Or clear it after some time
    } catch (calculationError) {
      // This catch is more for errors within calculatePortfolioMetrics structure itself,
      // individual fetch errors are handled inside it.
      console.error("Error during portfolio metrics calculation:", calculationError);
      setError("An error occurred while updating portfolio data. Please check individual asset errors.");
      setSuccessMessage(''); // Clear success if calculation failed broadly
    }

    // Clear success message after a delay, regardless of calculation outcome for the message set above
    setTimeout(() => setSuccessMessage(''), 4000);
  };
  
  const handleRefreshPrices = async () => { // Made async for consistency if await is added inside
    if (holdings.length > 0) {
      setSuccessMessage(''); // Clear any previous success/error messages
      setError('');
      // Optionally show a "Refreshing..." message via successMessage or a dedicated loadingRefreshMessage state
      setSuccessMessage('Refreshing all portfolio prices...');
      await calculatePortfolioMetrics(holdings);
      setSuccessMessage('Portfolio prices updated!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } else {
      setError("Your portfolio is empty. Add some holdings first.");
      setTimeout(() => setError(''), 3000);
    }
  };

  // Initial calculation if holdings are loaded from storage or similar (not in this phase)
  // useEffect(() => {
  //   if (holdings.length > 0) {
  //     calculatePortfolioMetrics(holdings);
  //   }
  // }, [holdings, calculatePortfolioMetrics]); // Be careful with dependencies if holdings can be modified elsewhere

  return (
    <Layout>
      <div className={styles.analyzerContainer}>
        <Card className={styles.formCard}>
          <h2 className={styles.title}>Portfolio Analyzer</h2>
          <form onSubmit={handleAddHolding}>
            <div className={styles.inputGroup}>
              <label htmlFor="cryptoIdInput">Cryptocurrency ID</label>
              <Input
                type="text"
                id="cryptoIdInput"
                value={cryptoIdInput}
                onChange={(e) => setCryptoIdInput(e.target.value)}
                placeholder="e.g., bitcoin, ethereum"
                disabled={loading}
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="quantityInput">Quantity</label>
              <Input
                type="number"
                id="quantityInput"
                value={quantityInput}
                onChange={(e) => setQuantityInput(e.target.value)}
                placeholder="e.g., 1.5"
                disabled={loading}
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="avgPurchasePriceInput">Avg. Purchase Price (BRL)</label>
              <Input
                type="number"
                id="avgPurchasePriceInput"
                value={avgPurchasePriceInput}
                onChange={(e) => setAvgPurchasePriceInput(e.target.value)}
                placeholder="e.g., 150000"
                disabled={loading}
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? 'Processing...' : 'Add / Update Holding'}
            </Button>
            {error && <p className={styles.error}>{error}</p>}
            {successMessage && <p className={styles.success}>{successMessage}</p>}
          </form>
        </Card>

        {holdings.length > 0 && (
          <Card className={styles.portfolioDisplayCard}>
            <div className={styles.portfolioHeader}>
              <h3 className={styles.portfolioTitle}>My Current Portfolio</h3>
              <Button onClick={handleRefreshPrices} disabled={loading || holdings.length === 0}>
                {loading && !successMessage.includes('Refreshing') ? 'Updating...' : (loading && successMessage.includes('Refreshing') ? 'Refreshing...' : 'Refresh All Prices')}
              </Button>
            </div>
            <p className={styles.totalValue}>
              Total Portfolio Value: <strong>R$ {totalPortfolioValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
            </p>
            <div className={styles.holdingsTableContainer}>
              <table className={styles.holdingsTable}>
                <thead>
                  <tr>
                    <th>Asset</th>
                    <th>Quantity</th>
                    <th>Avg. Purchase Price</th>
                    <th>Current Price</th>
                    <th>Current Value</th>
                    <th>Portfolio %</th>
                  </tr>
                </thead>
                <tbody>
                  {holdings.map((holding) => (
                    <tr key={holding.id}>
                      <td>{holding.name.toUpperCase()}</td>
                      <td>{holding.quantity}</td>
                      <td>R$ {holding.avgPurchasePrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                      <td>
                        {holding.error ? <span className={styles.priceError}>{holding.error}</span> : 
                         (holding.currentPrice ? `R$ ${holding.currentPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'Fetching...')
                        }
                      </td>
                      <td>{holding.currentValue ? `R$ ${holding.currentValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'Calculating...'}</td>
                      <td>{holding.portfolioPercentage ? holding.portfolioPercentage.toFixed(2) : '0.00'}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        <div className={styles.analysisPlaceholderContainer}>
            <Card className={styles.placeholderCard}>
                <h3 className={styles.placeholderTitle}>Risk Distribution</h3>
                <p>Risk analysis and diversification metrics coming soon.</p>
            </Card>
            <Card className={styles.placeholderCard}>
                <h3 className={styles.placeholderTitle}>Sector Exposure</h3>
                <p>Analysis of portfolio allocation across different crypto sectors coming soon.</p>
            </Card>
        </div>

      </div>
    </Layout>
  );
};

export default PortfolioAnalyzer;
