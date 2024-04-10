import { getExchangeResult, getSupportedCurrencies } from './http/client';
import './style.css';

const ELEMENT_DATA = {
  amountInput: 'data-amount-input',
  baseCurrencySelect: 'data-base-currency-select',
  conversionRate: 'data-conversion-rate',
  conversionResult: 'data-conversion-result',
  exchangeCalculatorForm: 'data-exchange-calculator-form',
  exchangePageForm: 'data-exchange-page-form',
  exchangeRates: 'data-exchange-rates',
  loadingAnimation: 'data-loading-animation',
  targetCurrencySelect: 'data-target-currency-select',
};

const ELEMENT_SELECTORS = {
  ROOT: '#app',
  NAVBAR: '[data-navbar]',
  amountInput: `[${ELEMENT_DATA.amountInput}]`,
  baseCurrencySelect: `[${ELEMENT_DATA.baseCurrencySelect}]`,
  conversionRate: `[${ELEMENT_DATA.conversionRate}]`,
  conversionResult: `[${ELEMENT_DATA.conversionResult}]`,
  exchangeCalculatorForm: `[${ELEMENT_DATA.exchangeCalculatorForm}]`,
  exchangePageForm: `[${ELEMENT_DATA.exchangeCalculatorForm}]`,
  loadingAnimation: `[${ELEMENT_DATA.loadingAnimation}]`,
  targetCurrencySelect: `[${ELEMENT_DATA.targetCurrencySelect}]`,
};

document.addEventListener('DOMContentLoaded', init);

export function getElement(selector) {
  return document.querySelector(selector);
}

export function init() {
  renderNavbarElement();
  renderExchangePage();
}

export function renderExchangePage() {
  getElement(ELEMENT_SELECTORS.ROOT).innerHTML = /*html*/ `
    <h1>Exchange page</h1>
    <div class="exchange-calculator-container">
      <div class="loading-animation" ${ELEMENT_DATA.loadingAnimation}>Loading animation here</div>
      <select ${ELEMENT_DATA.baseCurrencySelect} disabled>
        <option value="">Select base currency</option>
      </select>
      <div ${ELEMENT_DATA.baseCurrencySelect}></div>
    </div>
  `;
}

export function renderExchangeCalculator() {
  getSupportedCurrencies().then((data) => {
    if (data.result === 'success') {
      /**
       * @type {HTMLDivElement}
       */
      const loadingAnimationEl = getElement(ELEMENT_SELECTORS.loadingAnimation);

      /**
       * @type {HTMLSelectElement}
       */
      const baseCurrencySelectEl = getElement(ELEMENT_SELECTORS.baseCurrencySelect);

      /**
       * @type {HTMLSelectElement}
       */
      const targetCurrencySelectEl = getElement(ELEMENT_SELECTORS.targetCurrencySelect);

      let baseOptions = '<option value="">Select base currency</option>';

      let targetOptions = '<option value="">Select base currency</option>';

      for (const [currencyCode, currencyName] of data.supported_codes) {
        baseOptions += `<option value="${currencyCode}">${currencyName}</option>`;
        targetOptions += `<option value="${currencyCode}">${currencyName}</option>`;
      }

      baseCurrencySelectEl.innerHTML = baseOptions;
      targetCurrencySelectEl.innerHTML = targetOptions;

      baseCurrencySelectEl.disabled = false;
      targetCurrencySelectEl.disabled = false;

      loadingAnimationEl.remove();
    }
  });

  getElement(ELEMENT_SELECTORS.ROOT).innerHTML = /*html*/ `
    <h1>Exchange calculator</h1>
    <div class="exchange-calculator-container">
      <div class="loading-animation" ${ELEMENT_DATA.loadingAnimation}>Loading animation here</div>
      <form ${ELEMENT_DATA.exchangeCalculatorForm}>
        <select ${ELEMENT_DATA.baseCurrencySelect} disabled>
          <option value="">Select base currency</option>
        </select>
        <select ${ELEMENT_DATA.targetCurrencySelect} disabled>
          <option value="">Select base currency</option>
        </select>
        <input type="number" ${ELEMENT_DATA.amountInput} />
        <button type="submit">Calculate</button>
      </form>
      <div>
        Conversion rate:
        <span ${ELEMENT_DATA.conversionRate}></span>
      </div>
      <div>
        Conversion result:
        <span ${ELEMENT_DATA.conversionResult}></span>
      </div>
    </div>
  `;

  getElement(ELEMENT_SELECTORS.exchangeCalculatorForm).addEventListener('submit', (event) => {
    event.preventDefault();

    const amount = getElement(ELEMENT_SELECTORS.amountInput).value;

    const baseCurrency = getElement(ELEMENT_SELECTORS.baseCurrencySelect).value;

    const targetCurrency = getElement(ELEMENT_SELECTORS.targetCurrencySelect).value;

    getExchangeResult(baseCurrency, targetCurrency, amount).then((data) => {
      if (data.result === 'success') {
        const { conversion_rate, conversion_result } = data;

        getElement(ELEMENT_SELECTORS.conversionRate).textContent = conversion_rate;
        getElement(ELEMENT_SELECTORS.conversionResult).textContent = conversion_result;
      }
    });
  });
}

export function renderNavbarElement() {
  const navbarElement = getElement(ELEMENT_SELECTORS.NAVBAR);
  navbarElement.innerHTML = /*html*/ `
    <nav>
      <button data-exchange-btn>Exchange</button>
      <button data-exchange-calculator-btn>Exchange calculator</button>
    </nav>
  `;

  navbarElement.querySelector('[data-exchange-btn]').addEventListener('click', () => {
    renderExchangePage();
  });
  navbarElement.querySelector('[data-exchange-calculator-btn]').addEventListener('click', () => {
    renderExchangeCalculator();
  });
}
