import $ from 'jquery'
import React from "react";
import ReactDOM from "react-dom";
import App from "./app";

import './index.scss'

import { IntlProvider } from 'react-intl';
import messages_en from "./i18n/en.yaml";

const localeData = {
  en: messages_en,
};

const language =
  (navigator.languages && navigator.languages[0]) ||
  navigator.language ||
  navigator.userLanguage;

const languageWithoutRegionCode = language.toLowerCase().split(/[_-]+/)[0];

const messages =
  localeData[languageWithoutRegionCode] ||
  localeData[language] ||
  localeData.en;

ReactDOM.render(
    <IntlProvider locale={navigator.language} messages={messages} timeZone="America/Chicago">
        <App />
    </IntlProvider>
, document.getElementById("root"));