import axios from 'axios';

const API_BASE_URL = 'https://api.coingecko.com/api/v3';

export const fetchCurrentPrice = async (cryptoId) => {
  if (!cryptoId) {
    throw new Error('Cryptocurrency ID is required.');
  }
  try {
    const response = await axios.get(`${API_BASE_URL}/simple/price`, {
      params: {
        ids: cryptoId.toLowerCase(),
        vs_currencies: 'brl',
      },
    });

    // The response structure for a successful call with 'bitcoin' and 'brl' is:
    // { "bitcoin": { "brl": 50000 } }
    // The response structure for a successful call with 'bitcoin' and 'brl' is:
    // { "bitcoin": { "brl": 50000 } }
    const price = response.data?.[cryptoId.toLowerCase()]?.['brl'];

    if (price !== undefined && price !== null) {
      return price;
    } else {
      // More user-friendly message
      throw new Error(`Unable to find price data for '${cryptoId}' in BRL. Please verify the cryptocurrency ID and try again.`);
    }
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error Response (fetchCurrentPrice):', error.response.data, error.response.status);
      if (error.response.status === 404) {
        throw new Error(`Cryptocurrency '${cryptoId}' not found. Please check the ID.`);
      }
      throw new Error(`API Error (${error.response.status}): Could not fetch price. Please try again later.`);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('API No Response (fetchCurrentPrice):', error.request);
      throw new Error('Network Error: Unable to connect to the pricing service. Please check your internet connection and try again.');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('API Request Setup Error (fetchCurrentPrice):', error.message);
      throw new Error('Error: Could not process your request due to a setup issue.'); // Generic for other errors
    }
  }
};

export const fetchExchangeRate = async (fromCryptoId, toFiatId) => {
  if (!fromCryptoId || !toFiatId) {
    throw new Error('Both source cryptocurrency ID and target fiat ID are required.');
  }
  try {
    const response = await axios.get(`${API_BASE_URL}/simple/price`, {
      params: {
        ids: fromCryptoId.toLowerCase(),
        vs_currencies: toFiatId.toLowerCase(),
      },
    });

    // Expected response: { "bitcoin": { "brl": 350000 } }
    const rate = response.data?.[fromCryptoId.toLowerCase()]?.[toFiatId.toLowerCase()];

    if (rate !== undefined && rate !== null) {
      return rate;
    } else {
      throw new Error(`Unable to find exchange rate for '${fromCryptoId}' to '${toFiatId.toUpperCase()}'. Please verify the currency IDs.`);
    }
  } catch (error) {
    if (error.response) {
      console.error('API Error Response (fetchExchangeRate):', error.response.data, error.response.status);
      if (error.response.status === 404) {
         throw new Error(`Currency IDs '${fromCryptoId}' or '${toFiatId.toUpperCase()}' not found. Please check the IDs.`);
      }
      throw new Error(`API Error (${error.response.status}): Could not fetch exchange rate. Please try again later.`);
    } else if (error.request) {
      console.error('API No Response (fetchExchangeRate):', error.request);
      throw new Error('Network Error: Unable to connect to the exchange rate service. Please check your internet connection and try again.');
    } else {
      console.error('API Request Setup Error (fetchExchangeRate):', error.message);
      throw new Error('Error: Could not process your request due to a setup issue.');
    }
  }
};
