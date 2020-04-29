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
  Cases,
  Fitbit,
  Environment,
  Covid,
} from './cards';

import {
  FitBitSignIn
} from './cards/fitbit';

import {
  Conditional,
  empty,
} from './utils';

import api from './api';

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

    this.state.logged = !empty(this.state.tokens);

    this.login = {
      patient_id: React.createRef(),
      password: React.createRef(),
    };

    this.fitbitSignIn = this.fitbitSignIn.bind(this);
    this.fitbitAuthorize = this.fitbitAuthorize.bind(this);

    if (this.state.logged) {
      this.fetchTrack();
    }
  }
  
  async fetchTrack() {
    const overview = await api({
      url: '/user/overview',
      auth: this.state.tokens.access_token,
    });
    this.setState({ overview });

    const trackers = await api({
      url: '/user/tracker',
      auth: this.state.tokens.access_token,
    });
    this.setState({ trackers });
  }

  async updateTrack(trackers) {
    return await api({
      url: '/user/tracker',
      data: {
        track_date: new Date(),
        ...trackers
      }
    });
  }

  async handleLogin(e) {
    e.preventDefault();
    const patient_id = this.login.patient_id.current.value;
    const password = this.login.password.current.value;
    
    const tokens = await api({
      url: '/user/login',
      data: {
        patient_id, password
      }
    });
    if (tokens) {
      localStorage.setItem('tokens', JSON.stringify(tokens));
      this.setState({ login: false, logged: true, tokens });
    }
  }

  async handleLogOut(e) {
    e.preventDefault();
    localStorage.removeItem('tokens');
    this.setState({ logged: false, tokens: null, overview: null, trackers: null });
  }

  handleSignUp() {
    this.setState({ signup: true });
  }

  async fitbitSignIn() {
    const signin = await api({
      url: '/fitbit/request',
      auth: this.state.tokens.access_token,
    });

    if (signin && signin.url) {
      return signin.url;
    }

    return false;
  }

  async fitbitAuthorize(params) {
    const authorize = await api({
      url: `/fitbit/authorize${params}`,
      auth: this.state.tokens.access_token,
    });
    await this.fetchTrack();
  }

  handleLanguage(language) {
    this.setState({ language });
    localStorage.setItem('language', language);
  }

  handleToggleState(state) {
    this.setState({ [state]: !this.state[state] });
  }

  render() {
    let language = this.state.language.toLowerCase();
    const languageWithoutRegionCode = language.split(/[_-]+/)[0];

    if (this.messages[language]) {

    } else if (this.messages[languageWithoutRegionCode]) {
      language = languageWithoutRegionCode;
    } else {
      language = 'en';
    }

    const messages = this.messages[language];

    const overview = this.state.overview || {};

    return (
      <IntlProvider locale={this.state.language} messages={messages} timeZone={this.state.timezone}>

        <Modal 
          isOpen={this.state.signup}
          onRequestClose={() => this.handleToggleState('signup')}
          className="modal signup"
          overlayClassName="overlay"
          closeTimeoutMS={100}
          appElement={document.getElementById('root')}
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
          appElement={document.getElementById('root')}
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
            <Conditional if={this.state.logged}>
              <li onClick={(e) => this.handleLogOut(e)}>Log-out</li>
            </Conditional>
            <Conditional if={!this.state.logged}>
              <li onClick={() => this.handleToggleState('signup')}>Sign-up</li>
              <li onClick={() => this.handleToggleState('login')}>Log-in</li>
            </Conditional>
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
              <Conditional if={!empty(overview)}><Isolation value={10} /></Conditional>
              <Conditional if={!empty(overview)}><Cost value={1023.12} /></Conditional>
              <Conditional if={!empty(overview)}><Interaction value={10} /></Conditional>
              <Conditional if={!empty(overview)}><Screen value={120} /></Conditional>

              <Conditional if={!empty(overview)}><Mood value={'GOOD'} onTrack={this.updateTrack} /></Conditional>

              <Conditional if={!empty(overview)}><Weight value={54.2} unit="lbs" /></Conditional>
              <Conditional if={!empty(overview)}><Temperature value={36.2} unit="°F" /></Conditional>

              <Conditional if={!empty(overview)}>
                <Fitbit>
                  <Conditional if={!overview.fitbit}>
                    <FitBitSignIn onSignIn={this.fitbitSignIn} onAuthorize={this.fitbitAuthorize} />
                  </Conditional>
                </Fitbit>
              </Conditional>
    
              <Environment>
                <WeatherForecast current={24} low={20} high={25} unit="°F" />
                <Pollen value={'HIGH'} />
              </Environment>
    
              <Covid>
                <Cases level="county" cases={0} deaths={0} />
                <Cases level="country" cases={0} deaths={0} />
                <Cases level="world" cases={0} deaths={0} />
              </Covid>
            </div>
          </section>
        </main>
      </IntlProvider>
    );
  }
}

export default App;