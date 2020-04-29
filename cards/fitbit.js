import React from "react";
import Modal from "react-modal";
import { FormattedMessage as FM } from 'react-intl';
import { Base } from ".";

export class FitBitSignIn extends Base {
  constructor (props) {
    super(props);
    this.state = {
      ...this.state,
      modal: false,
    }
    this.ref = React.createRef();
    this.iframe = React.createRef();
    this.handleSignIn = this.handleSignIn.bind(this);
    this.handleFitbitIntegration = this.handleFitbitIntegration.bind(this);
  }
  async handleSignIn() {
    const fitbitFlow = await this.props.onSignIn();
    this.setState({ modal: true, modalSrc: fitbitFlow });
    this.handleFitbitIntegration();
  }
  async handleFitbitIntegration() {
    if (this.state.modal) {
      if (this.iframe.current) {
        try {
          const params = this.iframe.current.contentWindow.location.search;
          console.log(params, params.indexOf('code='))
          if (params.indexOf('code=') > -1) {
            await (this.props.onAuthorize && this.props.onAuthorize(params));
            this.setState({ modal: false, modalSrc: null });
            return;
          }
        } catch (error) {
        }
        
      }
      window.setTimeout(this.handleFitbitIntegration, 1000);
    }
  }
  renderModal() {
    return (
      <Modal
        appElement={document.getElementById('root')}
        isOpen={this.state.modal}
        onRequestClose={() => this.setState({ modal: false })}
        className={`modal signup`}
        overlayClassName="overlay"
        closeTimeoutMS={100}
      >
        <div className="container">
          <div className="content">
            <iframe ref={this.iframe} src={this.state.modalSrc}></iframe>
          </div>
        </div>
      </Modal>
    )
  }
  renderCard() {
    return (
      <div className="signin">
        {this.renderModal()}
        <div><button onClick={() => this.handleSignIn()}>Sign-in with Fitbit</button></div>
      </div>
    )
  }
}
