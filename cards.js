import React from "react";
import Modal from "react-modal";
import { FormattedMessage as FM } from 'react-intl';

function C2F(value) {
  return (value * 9/5) + 32;
}
function F2C(value) {
  return (value - 32) * 5/9;
}

export class Track extends React.Component {
  render() {
    return <button onClick={this.props.onClick} className={this.props.type}></button>
  }
}

export class Base extends React.Component {
  static group = null;
  static tracker = '';
  static value = null;
  static unit = null;
  static format = "%5.2f";
  constructor (props) {
    super(props);
    this.setDefaultState();
  }
  setDefaultState() {
    const { group, tracker, value, unit, format } = this.props;
    this.state = {
      ...this.state,
      group: group || this.group || this.constructor.group,
      tracker: tracker || this.tracker || this.constructor.tracker,
      value: value || this.value || this.constructor.value,
      unit: unit || this.unit || this.constructor.unit,
      format: format || this.format || this.constructor.format,
    }
  }
  renderCardMetric() {
    const { group, tracker, value, unit, format } = this.state
    return (
      <React.Fragment>
        {format.$(value)} {unit ? <span>{unit}</span> : null}
      </React.Fragment>
    )
  }
  renderCard() {
    const { group, tracker, value, unit, format } = this.state
    return (
      <div className={tracker}>
        <h2><FM id={(group ? ['widget', group, tracker] : ['widget', tracker]).join('.')} /></h2>
        <div>{this.renderCardMetric()}</div>
      </div>
    )
  }
  render() {
    return this.renderCard()
  }
}

export class TrackerBase extends Base {
  constructor (props) {
    super(props);
    this.state = {
      ...this.state,
      modal: false,
    }
    this.ref = React.createRef();
  }
  handleTrack() {
    this.setState({ modal: true })
  }
  handleTrackValue() {
    return this.ref.current.value;
  }
  handleSubmitTrack() {
    const value = this.handleTrackValue();
    const { group, tracker } = this.state;
    if (this.props.onTrack) {
      this.props.onTrack({
        group,
        tracker,
        value,
      })
    }
  }
  renderModal() {
    const { group, tracker, value, unit, format } = this.state
    return (
      <Modal
        appElement={document.getElementById('root')}
        isOpen={this.state.modal}
        onRequestClose={() => this.setState({ modal: false })}
        className={`modal ${tracker}`}
        overlayClassName="overlay"
        closeTimeoutMS={100}
      >
        <div className="container">
          <div className="content">
            {this.renderModalContent()}
          </div>
        </div>
      </Modal>
    )
  }
  renderModalContent() {
    const { group, tracker, value, unit, format } = this.state;
    return (
      <React.Fragment>
        <h2><FM id={(group ? ['widget', group, tracker] : ['widget', tracker]).join('.')} /></h2>
        <p><input type="text" ref={this.ref} /></p>
        <button onClick={() => this.handleSubmitTrack()}>Track</button>
      </React.Fragment>
    )
  }
  renderCardMetric() {
    const { group, tracker, value, unit, format } = this.state
    return (
      <React.Fragment>
        {format.$(value)} {unit ? <span>{unit}</span> : null}
      </React.Fragment>
    )
  }
  renderCard() {
    const { group, tracker, value, unit, format } = this.state;
    return (
      <div className={tracker}>
        {this.renderModal()}
        <h2><FM id={(group ? ['widget', group, tracker] : ['widget', tracker]).join('.')} /></h2>
        <div>{this.renderCardMetric()}</div>
        <Track onClick={() => this.handleTrack()} />
      </div>
    )
  }
  render() {
    return this.renderCard()
  }
}

export class Isolation extends TrackerBase {
  static tracker = 'isolation_days';
  static unit = 'days';
  static format = '%d';
}

export class Cost extends TrackerBase {
  static tracker = 'cost';
  static unit = 'US$';

  constructor (props) {
    super(props);
    this.categoryRef = React.createRef();
  }

  handleTrackValue() {
    return {
      category: this.categoryRef.current.value,
      cost: this.ref.current.value,
    }
  }

  renderModalContent() {
    const { group, tracker, value, unit, format } = this.state;
    return (
      <React.Fragment>
        <h2><FM id={(group ? ['widget', group, tracker] : ['widget', tracker]).join('.')} /></h2>
        <p><label>Category: </label>
          <select ref={this.categoryRef}>
            <option>Shopping</option>
            <option>Education</option>
            <option>Delivery</option>
          </select>
        </p>
        <p><label>Cost: </label><input type="text" ref={this.ref} /></p>
        <button onClick={() => this.handleSubmitTrack()}>Track</button>
      </React.Fragment>
    )
  }
}

export class Interaction extends TrackerBase {
  static tracker = 'interaction';
  static unit = 'people';
  static format = '%d';

  handleTrack() {
    this.setState({ value: this.state.value + 1 });
  }
}

export class Screen extends Base {
  static tracker = 'screen';
  static unit = 'hours';

  renderCardMetric() {
    const { group, tracker, value, unit, format } = this.state;
    const hours = (value / 60.0 / 60.0).toFixed(0);
    const minutes = ((value - (+hours * 3600)) / 60).toFixed(0)
    return (
      <React.Fragment>
        {hours}:{minutes.padStart(2, '0')} {unit ? <span>{unit}</span> : null}
      </React.Fragment>
    )
  }
}

export class Mood extends TrackerBase {
  static tracker = 'mood';
  static unit = false;
  static format = '%s';

  renderModalContent() {
    const { group, tracker, value, unit, format } = this.state;
    return (
      <React.Fragment>
        <h2><FM id={(group ? ['widget', group, tracker] : ['widget', tracker]).join('.')} /></h2>
        <p><select ref={this.ref}>
            <option>Good</option>
            <option>Ok</option>
            <option>Meh</option>
            <option>Bad</option>
          </select>
        </p>
        <button onClick={() => this.handleSubmitTrack()}>Track</button>
      </React.Fragment>
    )
  }
}

export class Weight extends TrackerBase {
  static tracker = 'weight';
  static unit = 'kg';

  handleTrackValue() {
    const { unit } = this.state;
    const value = parseFloat(this.ref.current.value);
    return value / (unit === 'lbs' ? 2.2046226218 : 1.0);
  }

  renderCardMetric() {
    const { group, tracker, value, unit, format } = this.state
    return (
      <React.Fragment>
        {format.$(value * (unit === 'lbs' ? 2.2046226218 : 1.0))} <span>{unit}</span>
      </React.Fragment>
    )
  }
}

export class Temperature extends TrackerBase {
  static tracker = 'temperature';
  static unit = '°C';

  handleTrackValue() {
    const { unit } = this.state;
    const value = parseFloat(this.ref.current.value);
    return unit === '°F' ? F2C(value) : value;
  }

  renderCardMetric() {
    const { group, tracker, value, unit, format } = this.state
    return (
      <React.Fragment>
        {format.$(unit === '°F' ? C2F(value) : value)} <span>{unit}</span>
      </React.Fragment>
    )
  }
}

export class WeatherForecast extends Base {
  static group = 'environment';
  static tracker = 'forecast';
  static unit = '°C';

  constructor (props) {
    super(props);
    this.state.value = {
      current: props.current,
      low: props.low,
      high: props.high,
    }
  }
  renderCardMetric() {
    const { group, tracker, value, unit, format } = this.state;
    const current = (unit === '°F' ? C2F(value.current) : value.current)
    const low = (unit === '°F' ? C2F(value.low) : value.low)
    const high = (unit === '°F' ? C2F(value.high) : value.high)

    return (
      <React.Fragment>
        {format.$(current)} <span>{unit}</span>
        <div>
          <span><FM id={(group ? ['widget', group, tracker] : ['widget', tracker]).join('.') + '.low'} />: {format.$(low)} <span>{unit}</span></span>
          <span><FM id={(group ? ['widget', group, tracker] : ['widget', tracker]).join('.') + '.high'} />: {format.$(high)} <span>{unit}</span></span>
        </div>
      </React.Fragment>
    )
  }
}

export class Pollen extends Base {
  static group = 'environment';
  static tracker = 'pollen';
  static unit = false;
  static format = '%s';
}