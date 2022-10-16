'use strict';

export default class Converter {
    constructor(
        convertFromCurrency,
        convertToCurrency,
        inputLineCurrency,
        valueToConvert,
        outputCurrencyFrom,
        outputCurrencyTo,
        outputValueFrom,
        outputValueTo,
        errorMessageItem,
        reversCurrencyButton,
        usdCount,
        eurCount,
        plnCount,
    ) {
        const _convertFromCurrency = convertFromCurrency;
        const _convertToCurrency = convertToCurrency;
        const _inputLineCurrency = inputLineCurrency;
        const _valueToConvert = valueToConvert;
        const _outputCurrencyFrom = outputCurrencyFrom;
        const _outputCurrencyTo = outputCurrencyTo;
        const _outputValueFrom = outputValueFrom;
        const _outputValueTo = outputValueTo;
        const _errorMessageItem = errorMessageItem;
        const _reversCurrencyButton = reversCurrencyButton;
        const _usdCount = usdCount;
        const _eurCount = eurCount;
        const _plnCount = plnCount;
        const _currencyList = this._createCurrencyList();
        this.GetConvertFromCurrency = () => {
            return _convertFromCurrency;
        }
        this.GetConvertToCurrency = () => {
            return _convertToCurrency;
        }
        this.GetInputLineCurrency = () => {
            return _inputLineCurrency;
        }
        this.GetValueToConvert = () => {
            return _valueToConvert;
        }
        this.GetOutputCurrencyFrom = () => {
            return _outputCurrencyFrom;
        }
        this.GetOutputCurrencyTo = () => {
            return _outputCurrencyTo;
        }
        this.GetOutputValueFrom = () => {
            return _outputValueFrom;
        }
        this.GetOutputValueTo = () => {
            return _outputValueTo;
        }
        this.GetErrorMessageItem = () => {
            return _errorMessageItem;
        }
        this.GetReversCurrencyButton = () => {
            return _reversCurrencyButton;
        }
        this.GetCurrencyList = () => {
            return _currencyList;
        }
        this.GetUSDCount = () => {
            return _usdCount;
        }
        this.GetEURCount = () => {
            return _eurCount;
        }
        this.GetPLCount = () => {
            return _plnCount;
        }
    }

    _createCurrencyList() {
        const resultArray = [];
        const request = new XMLHttpRequest();
        request.open('GET', 'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json');
        request.send();
        request.addEventListener('error', () => {
            this.GetErrorMessageItem().classList.toggle('hide');
        });
        request.addEventListener('load', () => {
            if (request.readyState === 4 && request.status === 200) {
                const data = JSON.parse(request.response);
                data.forEach(e => {
                    resultArray.push(e);
                })
                data.forEach((e) => {
                    this._addCurrencyToList(this.GetConvertFromCurrency(), e.cc);
                    this._addCurrencyToList(this.GetConvertToCurrency(), e.cc);
                })

            } else {
                this.GetErrorMessageItem().classList.toggle('hide');
            }
        })
        return resultArray;
    }

    _addCurrencyToList(parentElement, currencyName) {
        const newElement = document.createElement('option');
        newElement.classList.add('from__currency');
        newElement.innerHTML = currencyName;
        parentElement.append(newElement);
    }

    _convertFromUAH(countUAH, currencyTo) {
        let currency;
        this.GetCurrencyList().forEach(e => {
            if (e.cc === currencyTo) {
                currency = e.rate;
                this.GetOutputValueTo().innerHTML = String((countUAH / currency).toFixed(2));
            }
        })
        return (countUAH / currency);
    }

    _convertToUAH() {
        const countDifferentCurrency = Number(this.GetValueToConvert().value);
        let currency;
        this.GetCurrencyList().forEach(e => {
            if (e.cc === this.GetConvertFromCurrency().value) {
                currency = e.rate;
                this.GetOutputValueTo().innerHTML = String((countDifferentCurrency * currency).toFixed(2));
            }
        })
        return (countDifferentCurrency * currency);
    }

    _calcResult() {
        this._setTopCurrenciesValues();
        this.GetOutputValueFrom().innerHTML = this.GetValueToConvert().value;
        if (this.GetConvertFromCurrency().value === this.GetConvertToCurrency().value) {
            this.GetOutputValueFrom().innerHTML = this.GetValueToConvert().value;
            this.GetOutputValueTo().innerHTML = this.GetValueToConvert().value;
        } else if (this.GetConvertFromCurrency().value === "UAH" && this.GetConvertToCurrency().value !== "UAH") {
            this._convertFromUAH(Number(this.GetValueToConvert().value), this.GetConvertToCurrency().value);
        } else if (this.GetConvertFromCurrency().value !== "UAH" && this.GetConvertToCurrency().value === "UAH") {
            this._convertToUAH();
        } else {
            this._convertFromUAH(this._convertToUAH(), this.GetConvertToCurrency().value);
        }
    }

    _reverseCurrencies() {
        const reverseCurrencyFrom = this.GetConvertFromCurrency().value;
        this.GetConvertFromCurrency().value = this.GetConvertToCurrency().value;
        this.GetConvertToCurrency().value = reverseCurrencyFrom;
        const inputChangeEvent = new Event('change');
        this.GetValueToConvert().value = this.GetOutputValueTo().innerHTML;
        this.GetConvertFromCurrency().dispatchEvent(inputChangeEvent);
        this.GetConvertToCurrency().dispatchEvent(inputChangeEvent);
    }

    _setTopCurrenciesValues() {
        let USDRate;
        let EURRate;
        let PLNRate;
        this.GetCurrencyList().forEach(e => {
            if (e.cc === "USD") {
                USDRate = e.rate;
            } else if (e.cc === "EUR") {
                EURRate = e.rate;
            } else if (e.cc === "PLN") {
                PLNRate = e.rate;
            }
        });
        if (this.GetConvertFromCurrency().value === "UAH") {

            this.GetUSDCount().innerHTML = (this.GetValueToConvert().value / USDRate).toFixed(2);
            this.GetEURCount().innerHTML = (this.GetValueToConvert().value / EURRate).toFixed(2);
            this.GetPLCount().innerHTML = (this.GetValueToConvert().value / PLNRate).toFixed(2);
        } else {
            let currencyFrom;
            this.GetCurrencyList().forEach(e => {
                if (e.cc === this.GetConvertFromCurrency().value) {
                    currencyFrom = e.rate;
                }

            });
            this.GetUSDCount().innerHTML = ((this.GetValueToConvert().value * currencyFrom) / USDRate).toFixed(2);
            this.GetEURCount().innerHTML = ((this.GetValueToConvert().value * currencyFrom) / EURRate).toFixed(2);
            this.GetPLCount().innerHTML = ((this.GetValueToConvert().value * currencyFrom) / PLNRate).toFixed(2);
        }
    }

    startConverter() {
        this._calcResult();

        this.GetInputLineCurrency().innerHTML = this.GetConvertFromCurrency().value;
        this.GetOutputCurrencyFrom().innerHTML = this.GetConvertFromCurrency().value;
        this.GetOutputCurrencyTo().innerHTML = this.GetConvertToCurrency().value;

        this.GetConvertFromCurrency().addEventListener('change', () => {
            this.GetOutputCurrencyFrom().innerHTML = this.GetConvertFromCurrency().value;
            this.GetInputLineCurrency().innerHTML = this.GetConvertFromCurrency().value;
        })
        this.GetConvertToCurrency().addEventListener('change', () => {
            this.GetOutputCurrencyTo().innerHTML = this.GetConvertToCurrency().value;
        });

        this.GetConvertFromCurrency().addEventListener('change', () => this._calcResult());
        this.GetConvertToCurrency().addEventListener('change', () => this._calcResult());
        this.GetValueToConvert().addEventListener('input', () => this._calcResult());
        this.GetReversCurrencyButton().addEventListener('click', () => this._reverseCurrencies());
    }


}




