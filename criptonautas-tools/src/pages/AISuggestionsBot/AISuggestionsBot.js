import React, { useState } from 'react';
import Layout from '../../components/Layout/Layout';
import Card from '../../components/Card/Card';
import Button from '../../components/Button/Button';
import styles from './AISuggestionsBot.module.css';

const AISuggestionsBot = () => {
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState(null); // Initialize with null

  const PlaceholderSuggestionJSX = () => (
    <div className={styles.suggestionsTextContainer}>
      <p><strong>AI Suggestion:</strong></p>
      <p>Hello Criptonauta! Based on a general analysis (this is a prototype), here are a few ideas:</p>
      <ol>
        <li>
          <strong>Consider Diversification:</strong> If your portfolio is concentrated in one or two coins, 
          exploring other promising projects in different sectors (like DeFi or Web3 infrastructure) could be beneficial.
        </li>
        <li>
          <strong>Review High Performers:</strong> If some assets have grown significantly, you might think 
          about rebalancing by taking some profits and reinvesting in other assets or stablecoins.
        </li>
        <li>
          <strong>Learn More:</strong> Keep an eye on market trends and continue learning about new 
          technologies in the crypto space.
        </li>
      </ol>
      <p><em>Remember: These are general suggestions for prototype purposes. Always do your own research (DYOR) before making investment decisions.</em></p>
    </div>
  );

  const handleGetSuggestions = () => {
    setLoadingSuggestions(true);
    setAiSuggestions(null); // Clear previous suggestions

    setTimeout(() => {
      setAiSuggestions(<PlaceholderSuggestionJSX />);
      setLoadingSuggestions(false);
    }, 1500); // Simulate API call delay
  };

  return (
    <Layout>
      <div className={styles.aiBotContainer}>
        <Card className={styles.mainCard}>
          <h2 className={styles.title}>AI Suggestions Bot</h2>

          <Card className={styles.portfolioSummaryCard}>
            <h3 className={styles.subTitle}>Portfolio Snapshot (Placeholder)</h3>
            <p className={styles.placeholderText}>
              Your portfolio data will be analyzed here. Ensure you have added holdings in the Portfolio Analyzer.
              For now, the AI will provide general suggestions.
            </p>
          </Card>

          <div className={styles.actionArea}>
            <Button onClick={handleGetSuggestions} disabled={loadingSuggestions}>
              {loadingSuggestions ? 'Analyzing your portfolio...' : 'Get AI Suggestions'}
            </Button>
          </div>

          {loadingSuggestions && (
            <p className={styles.loadingText}>Analyzing your portfolio and generating suggestions...</p>
          )}

          {aiSuggestions !== null && (
            <Card className={styles.suggestionsDisplayCard}>
              <h3 className={styles.subTitle}>Suggestions from your AI Assistant</h3>
              {/* Render the JSX directly */}
              {aiSuggestions}
            </Card>
          )}
        </Card>
      </div>
    </Layout>
  );
};

export default AISuggestionsBot;
