import axiosInstance from '.';

export async function getRates(baseCurrency) {
  try {
    return (await axiosInstance.get(`/latest/${baseCurrency}`)).data;
  } catch (error) {
    console.error('Error while fetching rates', error);
    return null;
  }
}

export async function getSupportedCurrencies() {
  try {
    return (await axiosInstance.get('/codes')).data;
  } catch (error) {
    console.error('Error while fetching supported currencies', error);
    return null;
  }
}

export async function getExchangeResult(baseCurrency, targetCurrency, amount) {
  try {
    return (await axiosInstance.get(`/pair/${baseCurrency}/${targetCurrency}/${amount}`)).data;
  } catch (error) {
    console.error('Error while fetching exchange result', error);
    return null;
  }
}
