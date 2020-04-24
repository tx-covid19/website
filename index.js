import $ from 'jquery'
import React from "react";
import ReactDOM from "react-dom";
import App from "./app";

import './index.scss'

import surveys from './surveys.yaml';

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

String.form = function(str, arr) {
  var i = -1;
  function callback(exp, p0, p1, p2, p3, p4) {
    if (exp=='%%') return '%';
    if (arr[++i]===undefined) return undefined;
    exp  = p2 ? parseInt(p2.substr(1)) : undefined;
    var base = p3 ? parseInt(p3.substr(1)) : undefined;
    var val;
    switch (p4) {
      case 's': val = arr[i]; break;
      case 'c': val = arr[i][0]; break;
      case 'f': val = parseFloat(arr[i]).toFixed(exp); break;
      case 'p': val = parseFloat(arr[i]).toPrecision(exp); break;
      case 'e': val = parseFloat(arr[i]).toExponential(exp); break;
      case 'x': val = parseInt(arr[i]).toString(base?base:16); break;
      case 'd': val = parseFloat(parseInt(arr[i], base?base:10).toPrecision(exp)).toFixed(0); break;
    }
    val = typeof(val)=='object' ? JSON.stringify(val) : val.toString(base);
    var sz = parseInt(p1); /* padding size */
    var ch = p1 && p1[0]=='0' ? '0' : ' '; /* isnull? */
    while (val.length<sz) val = p0 !== undefined ? val+ch : ch+val; /* isminus? */
    return val;
  }
  var regex = /%(-)?(0?[0-9]+)?([.][0-9]+)?([#][0-9]+)?([scfpexd%])/g;
  return str.replace(regex, callback);
}

String.prototype.$ = function() {
  return String.form(this, Array.prototype.slice.call(arguments));
}

ReactDOM.render(
  <App surveys={surveys} language={language} timezone={"America/Chicago"} messages={messages} />
, document.getElementById("root"));