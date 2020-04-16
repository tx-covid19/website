import $ from 'jquery'
import React from "react";
import ReactDOM from "react-dom";
import App from "./app";

import './index.scss'

import messages_en from "./i18n/en.yaml";
import messages_pt from "./i18n/pt.yaml";
import messages_es from "./i18n/es.yaml";

const messages = {
  en: messages_en,
  pt: messages_pt,
  es: messages_es,
};

const language =
  localStorage.getItem('language') ||
  (navigator.languages && navigator.languages[0]) ||
  navigator.language ||
  navigator.userLanguage;

ReactDOM.render(
  <App language={language} timezone={"America/Chicago"} messages={messages} />
, document.getElementById("root"));