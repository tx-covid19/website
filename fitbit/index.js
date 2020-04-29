import React from "react";
import ReactDOM from "react-dom";

import './index.scss';

class Page extends React.Component {
  render() {
    return (
      <div className="lds-grid">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    )
  }
}

ReactDOM.render(
  <Page />
, document.getElementById("root"));