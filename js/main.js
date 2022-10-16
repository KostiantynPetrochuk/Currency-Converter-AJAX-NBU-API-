'use strict';

import Converter from "./Converter.js";

const CurrencyConverter = new Converter(
    document.querySelector('.convert-from'),
    document.querySelector('.convert-to'),
    document.querySelector('.card-input-block__currency'),
    document.querySelector('.card-input__item'),
    document.querySelector('.card-result-top__currency'),
    document.querySelector('.card-result-bot__currency'),
    document.querySelector('.card-result-top__value'),
    document.querySelector('.card-result-bot__value'),
    document.querySelector('.alert-danger'),
    document.querySelector('.revers-currencies'),
    document.querySelector('#usd-value'),
    document.querySelector('#eur-value'),
    document.querySelector('#pln-value')
);

CurrencyConverter.startConverter();