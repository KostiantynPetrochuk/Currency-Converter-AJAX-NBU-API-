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
        this._convertFromCurrency = convertFromCurrency;
        this._convertToCurrency = convertToCurrency;
        this._inputLineCurrency = inputLineCurrency;
        this._valueToConvert = valueToConvert;
        this._outputCurrencyFrom = outputCurrencyFrom;
        this._outputCurrencyTo = outputCurrencyTo;
        this._outputValueFrom = outputValueFrom;
        this._outputValueTo = outputValueTo;
        this._errorMessageItem = errorMessageItem;
        this._reversCurrencyButton = reversCurrencyButton;
        this._usdCount = usdCount;
        this._eurCount = eurCount;
        this._plnCount = plnCount;
        this._currencyList = this._createCurrencyList();
    }

    GetConvertFromCurrency = () => {
        return this._convertFromCurrency;
    }
    GetConvertToCurrency = () => {
        return this._convertToCurrency;
    }
    GetInputLineCurrency = () => {
        return this._inputLineCurrency;
    }
    GetValueToConvert = () => {
        return this._valueToConvert;
    }
    GetOutputCurrencyFrom = () => {
        return this._outputCurrencyFrom;
    }
    GetOutputCurrencyTo = () => {
        return this._outputCurrencyTo;
    }
    GetOutputValueFrom = () => {
        return this._outputValueFrom;
    }
    GetOutputValueTo = () => {
        return this._outputValueTo;
    }
    GetErrorMessageItem = () => {
        return this._errorMessageItem;
    }
    GetReversCurrencyButton = () => {
        return this._reversCurrencyButton;
    }
    GetCurrencyList = () => {
        return this._currencyList;
    }
    GetUSDCount = () => {
        return this._usdCount;
    }
    GetEURCount = () => {
        return this._eurCount;
    }
    GetPLCount = () => {
        return this._plnCount;
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
            if (USDRate !== undefined) {
                this.GetUSDCount().innerHTML = (this.GetValueToConvert().value / USDRate).toFixed(2);
                this.GetEURCount().innerHTML = (this.GetValueToConvert().value / EURRate).toFixed(2);
                this.GetPLCount().innerHTML = (this.GetValueToConvert().value / PLNRate).toFixed(2);
            }
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

    _toValidateForm = () => {
        if (this.GetValueToConvert().value === '') this.GetValueToConvert().value = 0;
        let valueToValidate = Array.from(this.GetValueToConvert().value);
        if (valueToValidate.length > 19) valueToValidate.length = 19;

        if (valueToValidate[0] === '0' && !isNaN(+valueToValidate[1]) && valueToValidate.length > 1) {
            valueToValidate.shift();
        }
        this.GetValueToConvert().value = valueToValidate
            .map(e => e === '.' ? '.' : Number(e))
            .filter(e => (!isNaN(e) || e === '.'))
            .join('');
        this._calcResult();
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

        this.GetValueToConvert().addEventListener('input', () => this._toValidateForm());
        this.GetReversCurrencyButton().addEventListener('click', () => this._reverseCurrencies());
    }


}




