import React from "react";
import {FormattedMessage as FM} from 'react-intl';

const App = () => 
<React.Fragment>
  <nav>
    <h1>TX COVID19</h1>
    <ol>
      <li>Sign-up</li>
      <li>Login</li>
      <li className="i18n"><span>ENG</span> <span>SPA</span> <span>POR</span></li>
    </ol>
  </nav>

  <main>
    <section id="collections">
        <div>
          <div className="isolation">
            <h2><FM id="widget.isolation" /></h2>
            <p>12 <span>days</span></p>
          </div>
          <div className="cost">
            <h2><FM id="widget.cost" /></h2>
            <p>1205.00 <span>US$</span></p>
            <button>+</button>
          </div>
          <div className="interaction">
            <h2><FM id="widget.cost" /></h2>
            <p>12 <span>people  </span></p>
          </div>
          <div className="screen">
            <h2><FM id="widget.screen" /></h2>
            <p>8:23 <span>hours</span></p>
          </div>
          <div className="mood">
            <h2><FM id="widget.mood" /></h2>
            <p>Good</p>
          </div>
          <div className="weight">
            <h2><FM id="widget.weight" /></h2>
            <p>54.2 <span>kg</span></p>
          </div>
          <div className="temperature">
            <h2><FM id="widget.temperature" /></h2>
            <p>97.3 <span>F</span></p>
          </div>

          <div className="group">
            <h2><FM id="widget.environment" /></h2>
            <div>
              <div className="weather">
                <h3><FM id="widget.environment.forecast" /></h3>
                <p>85 <span>F</span></p>
              </div>
              <div>
                <h3><FM id="widget.environment.pollen" /></h3>
                <p>High</p>
              </div>
            </div>
          </div>

          <div className="group">
            <h2><FM id="widget.covid" /></h2>
            <div>
              <div>
                <h3><FM id="widget.covid.county_cases" /></h3>
                <p>0</p>
              </div>
              <div>
                <h3><FM id="widget.covid.county_deaths" /></h3>
                <p>0</p>
              </div>
              <div>
                <h3><FM id="widget.covid.texas_cases" /></h3>
                <p>0</p>
              </div>
              <div>
                <h3><FM id="widget.covid.texas_deaths" /></h3>
                <p>0</p>
              </div>
              <div>
                <h3><FM id="widget.covid.us_cases" /></h3>
                <p>0</p>
              </div>
              <div>
                <h3><FM id="widget.covid.us_deaths" /></h3>
                <p>0</p>
              </div>
            </div>
          </div>
        </div>
    </section>
  </main>
</React.Fragment>
;

export default App;