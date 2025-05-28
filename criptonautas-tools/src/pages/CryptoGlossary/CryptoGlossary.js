import React, { useState, useMemo } from 'react';
import Layout from '../../components/Layout/Layout';
import Card from '../../components/Card/Card';
import Input from '../../components/Input/Input';
import styles from './CryptoGlossary.module.css';

const glossaryData = [
  { 
    term: 'Staking', 
    explanation: 'Locking up your crypto assets for a period to support a blockchain network and earn rewards.' 
  },
  { 
    term: 'Farming (Yield Farming)', 
    explanation: 'Lending or staking crypto assets to generate high returns or rewards in the form of additional cryptocurrency.' 
  },
  { 
    term: 'Halving', 
    explanation: 'A process that reduces the rate at which new cryptocurrencies are created. For Bitcoin, it happens approximately every four years.' 
  },
  { 
    term: 'Blockchain', 
    explanation: 'A decentralized, distributed, and immutable digital ledger that records transactions across many computers.' 
  },
  { 
    term: 'DeFi (Decentralized Finance)', 
    explanation: 'Financial services built on blockchain technology that operate without traditional intermediaries.' 
  },
  {
    term: 'NFT (Non-Fungible Token)',
    explanation: 'A unique digital asset representing ownership of real-world items like art, video clips, or even real estate, recorded on a blockchain.'
  },
  {
    term: 'Smart Contract',
    explanation: 'A self-executing contract with the terms of the agreement directly written into code. They run on a blockchain, automatically executing when conditions are met.'
  },
  {
    term: 'Gas Fees',
    explanation: 'Fees paid by users to compensate for the computing energy required to process and validate transactions on a blockchain, like Ethereum.'
  }
];

const CryptoGlossary = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGlossary = useMemo(() => {
    const trimmedQuery = searchQuery.trim().toLowerCase();
    if (!trimmedQuery) {
      return glossaryData;
    }
    return glossaryData.filter(item => 
      item.term.toLowerCase().includes(trimmedQuery) ||
      item.explanation.toLowerCase().includes(trimmedQuery)
    );
  }, [searchQuery]);

  return (
    <Layout>
      <div className={styles.glossaryContainer}>
        <h2 className={styles.title}>Crypto Glossary</h2>

        <div className={styles.searchAndAISection}>
          <Input 
            type="text"
            placeholder="Search terms or explanations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput} 
          />
          <Card className={styles.aiPlaceholderCard}>
            <h3 className={styles.aiTitle}>AI Q&A (Coming Soon!)</h3>
            <p className={styles.aiText}>
              Have a specific question? Our AI assistant will soon help you find answers based on the glossary content!
            </p>
          </Card>
        </div>

        {filteredGlossary.length > 0 ? (
          <div className={styles.glossaryList}>
            {filteredGlossary.map((item, index) => (
              <Card key={index} className={styles.termCard}>
                <h3 className={styles.termTitle}>{item.term}</h3>
                <p className={styles.termExplanation}>{item.explanation}</p>
              </Card>
            ))}
          </div>
        ) : (
          <p className={styles.noResultsText}>No terms match your search query.</p>
        )}
      </div>
    </Layout>
  );
};

export default CryptoGlossary;
