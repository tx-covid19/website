import React from "react";
import Modal from "react-modal";
import { IntlProvider, FormattedMessage as FM } from 'react-intl';

import {
  Isolation,
  Cost,
  Interaction,
  Screen,
  Mood,
  Weight,
  Temperature,
  WeatherForecast,
  Pollen,
} from './cards';

class Track extends React.Component {
  render() {
    return <button onClick={this.props.onClick} className={this.props.type}></button>
  }
}

Modal.setAppElement('#root')

const SERVER = '/api'

async function api({ url, data = null, auth, json = true, request = false }) {
  const req = await fetch(
    `${SERVER}${url}`, {
      method: data ? 'POST' : 'GET',
      mode: 'cors',
      cache: 'no-cache',
      headers: {
        ...auth && { 'Authorization': `Bearer ${auth}` },
        ...data && { 'Content-Type': 'application/json' },
      },
      body: data ? JSON.stringify(data) : null,
    }
  );

  if (request) {
    return req
  }

  if (json) {
    return await req.json()
  } else {
    return await req.body()
  }
}

class App extends React.Component {

  constructor(props) {
    super(props);
    const { language, messages, timezone } = props;
    this.messages = messages;
    this.state = {
      language, timezone,
      signup: false,
      login: false,
      tokens: JSON.parse(localStorage.getItem('tokens') || '{}')
    };

    this.login = {
      patient_id: React.createRef(),
      password: React.createRef(),
    };

    this.fetchTrack();
  }
  
  async fetchTrack() {
    const trackers = await api({ url: '/user/tracker' });
    this.setState({ trackers });
  }

  async updateTrack(trackers) {
    console.log(trackers)
    return await api({
      url: '/user/tracker',
      data: {
        track_date: new Date(),
        ...trackers
      }
    });
  }

  handleLanguage(language) {
    this.setState({ language });
    localStorage.setItem('language', language);
  }

  async handleLogin(e) {
    e.preventDefault();
    const patient_id = this.login.patient_id.current.value
    const password = this.login.password.current.value
    
    const tokens = await api({
      url: '/user/login',
      data: {
        patient_id, password
      }
    });
    localStorage.setItem('tokens', JSON.stringify(tokens))
    this.setState({ login: false, tokens });
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
                <input type="text" ref={this.login.patient_id} />
                <label>Password</label>
                <input type="password" ref={this.login.password} />
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
                <Isolation value={10} />
                <Cost value={1023.12} />
                <Interaction value={10} />
                <Screen value={120} />

                <Mood value={'GOOD'} onTrack={this.updateTrack} />

                <Weight value={54.2} unit="lbs" />
                <Temperature value={36.2} unit="°F" />
      
                <div className="group">
                  <h2><FM id="widget.environment" /></h2>
                  <div>
                    <WeatherForecast current={24} low={20} high={25} unit="°F" />
                    <Pollen value={'HIGH'} />
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