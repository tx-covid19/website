import React from "react";
import Modal from "react-modal";
import { IntlProvider, FormattedMessage as FM } from 'react-intl';

class Track extends React.Component {
  render() {
    return <button onClick={this.props.onClick} className={this.props.type}></button>
  }
}

Modal.setAppElement('#root')

class App extends React.Component {

  constructor(props) {
    super(props);
    const { language, messages, timezone } = props;
    this.messages = messages;
    this.state = {
      language, timezone,
      track: false,
      signup: false,
      login: false,
    };
  }
  
  handleLanguage(language) {
    this.setState({ language });
    localStorage.setItem('language', language)
  }

  handleTrack(widget) {
    this.setState({ track: true, track_widget: widget });
  }

  handleLogin(e) {
    e.preventDefault();
    this.setState({ login: false });
  }

  handleSignUp() {
    this.setState({ signup: true });
  }

  handleToggleState(state) {
    this.setState({ [state]: !this.state[state] });
  }

  render() {
    let language = this.state.language.toLowerCase();
    const languageWithoutRegionCode = language.split(/[_-]+/)[0];

    if (this.messages[language]) {

    } else if (this.messages[languageWithoutRegionCode]) {
      language = languageWithoutRegionCode
    } else {
      language = 'en'
    }

    const messages = this.messages[language]

    return (
      <IntlProvider locale={this.state.language} messages={messages} timeZone={this.state.timezone}>

        <Modal 
          isOpen={this.state.track}
          onRequestClose={() => this.handleToggleState('track')}
          className="modal"
          overlayClassName="overlay"
          closeTimeoutMS={100}
        >
          <div className="container">
            <div className="content">
              <p><FM id={`widget.${this.state.track_widget}`} /></p>
              <p><input type="text" /></p>
              <button onClick={() => this.handleToggleState('track')}>Track</button>
            </div>
          </div>
        </Modal>

        <Modal 
          isOpen={this.state.signup}
          onRequestClose={() => this.handleToggleState('signup')}
          className="modal signup"
          overlayClassName="overlay"
          closeTimeoutMS={100}
        >
          <div className="container">
            <div className="content">
              <iframe src={this.props.surveys.consent} />
            </div>
          </div>
        </Modal>

        <Modal 
          isOpen={this.state.login}
          onRequestClose={() => this.handleToggleState('login')}
          className="modal login"
          overlayClassName="overlay"
          closeTimeoutMS={100}
        >
          <div className="container">
            <div className="content">
              <form>
                <label>User ID</label>
                <input type="text" name="user" />
                <label>Password</label>
                <input type="password" name="password" />
                <button type="submit" onClick={(e) => this.handleLogin(e)}>Log-in</button>
              </form>
            </div>
          </div>
        </Modal>


        <nav>
          <h1>TX COVID19</h1>
          <ol>
            <li onClick={() => this.handleToggleState('signup')}>Sign-up</li>
            <li onClick={() => this.handleToggleState('login')}>Log-in</li>
            <li className="i18n" data-language={language}>
              <span data-language="en" onClick={() => this.handleLanguage('en')}>ENG</span>
              <span data-language="es" onClick={() => this.handleLanguage('es')}>SPA</span>
              <span data-language="pt" onClick={() => this.handleLanguage('pt')}>POR</span>
            </li>
          </ol>
        </nav>
      
        <main>
          <section id="collections">
              <div>
                <div className="isolation">
                  <h2><FM id="widget.isolation" /></h2>
                  <p>12 <span>days</span></p>
                  <Track onClick={() => this.handleTrack('isolation')} />
                </div>
                <div className="cost">
                  <h2><FM id="widget.cost" /></h2>
                  <p>1205.00 <span>US$</span></p>
                  <Track onClick={() => this.handleTrack('cost')} type="warning" />
                </div>
                <div className="interaction">
                  <h2><FM id="widget.interaction" /></h2>
                  <p>12 <span>people  </span></p>
                  <Track onClick={() => this.handleTrack('interaction')} type="urgent" />
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
      </IntlProvider>
    );
  }
}

export default App;