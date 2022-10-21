'use strict';
import HtmlGenerator from "./classes/HtmlGenerator.js"
import Converter from "./classes/Converter.js";

const creator = new HtmlGenerator;

const entryPoint = document.querySelector(".row");
const container = creator.render(entryPoint, "div", ["container"]);
const contentWrapper = creator.render(container, "div", ["content-wrapper"]);
const title = creator.render(contentWrapper, "h3", ["title"], "Currency Converter");
const configure = creator.render(contentWrapper, "div", ["configure"]);
const convertFrom = creator.render(configure, "select", ["convert-from", "form-select", "form-select-lg", "mb-10"])
creator.createAttributes(convertFrom, { "aria-label": '.form-select-lg example' })
const fromCurrencyDefault = creator.render(convertFrom, "option", ["from__currency"], "UAH");
const reversCurrencies = creator.render(configure, "div", ["revers-currencies"]);
const reversCurrenciesLogo = creator.render(reversCurrencies, "img", ['revers-currencies__img']);
creator.createAttributes(reversCurrenciesLogo, { src: "img/currency-reverse.svg" });
const convertTo = creator.render(configure, "select", ["convert-from", "form-select", "form-select-lg", "mb-10"])
creator.createAttributes(convertTo, { "aria-label": '.form-select-lg example' })
const toCurrencyDefault = creator.render(convertTo, "option", ["from__currency"], "UAH");
const cardInputInner = creator.render(contentWrapper, "div", ["card-input-inner"]);
const errorMessage = creator.render(cardInputInner, "div", ["alert", "alert-danger", "hide"], "Something went wrong, try again later :)");
creator.createAttributes(errorMessage, { role: "alert" });
const cardInput = creator.render(cardInputInner, "div", ["card-input"])
const cardTitle = creator.render(cardInput, "span", ["card-title"], "Amount");
const cardInputBlock = creator.render(cardInput, "label", ["card-input-block"]);
const cardInputBlockCurrency = creator.render(cardInputBlock, "span", ["card-input-block__currency"], "---");
const cardInputItem = creator.render(cardInputBlock, "input", ["card-input__item"]);
creator.createAttributes(cardInputItem, { value: 0 });
const cardResult = creator.render(cardInput, "div", ["card-result"]);
const cardResultTop = creator.render(cardResult, "span", ["card-result-top"]);
const cardResultTopValue = creator.render(cardResultTop, "span", ["card-result-top__value"], "---");
const cardResultTopCurrency = creator.render(cardResultTop, "span", ["card-result-top__currency"], "---");
const cardResultTopItem = creator.render(cardResultTop, "span", [], " =")
const cardResultBot = creator.render(cardResult, "div", ["card-result-bot"]);
const cardResultBotValue = creator.render(cardResultBot, "span", ["card-result-top__value"], "---");
const cardResultBotCurrency = creator.render(cardResultBot, "span", ["card-result-top__currency"], "---");
const cardResultBotItem = creator.render(cardResultBot, "span", []);
const offers = creator.render(contentWrapper, "div", ["offers"]);
const offersList = creator.render(offers, "ul", ["offers-list"]);
const USDCount = createOffersListItem("USD");
const EURCount = createOffersListItem("EUR");
const PLNCount = createOffersListItem("PLN");

function createOffersListItem(currency) {
    const offersListItem = creator.render(offersList, "li", ["offers-list-item"]);
    const offersListItemLogo = creator.render(offersListItem, "img", ["offers-list-item__logo"]);
    creator.createAttributes(offersListItemLogo, { src: "img/" + currency + ".png" });
    const offersRight = creator.render(offersListItem, "div", ["offers-right"]);
    const offersRightCurrency = creator.render(offersRight, "span", ["offers-right__currency"], currency);
    const offersRightCount = creator.render(offersRight, "span", ["offers-right__count"], "0.00");
    creator.createAttributes(offersRightCount, { id: currency + "-value" });
    return offersRightCount;
}

const CurrencyConverter = new Converter(
    convertFrom,
    convertTo,
    cardInputBlockCurrency,
    cardInputItem,
    cardResultTopCurrency,
    cardResultBotCurrency,
    cardResultTopValue,
    cardResultBotValue,
    errorMessage,
    reversCurrencies,
    USDCount,
    EURCount,
    PLNCount
);

CurrencyConverter.startConverter();