import React, { Component, FunctionComponent } from 'react';
import './App.css';
import { createProgressions, Pitches, Pitch, ChordMode, Progressions, ChordChain, Chord } from './ModProg';
import _ from 'lodash';
import { Container, Navbar, Form, FormControl, FormGroup, Row, Col, Table, Badge, Alert, Nav } from 'react-bootstrap';
import {version} from '../package.json';

const Version = version;

const ChordModes = _.range(1, 8);

/**
 * 
 */
type Result = Readonly<{
  progressions?: Progressions;
  errors?: string
}>;

/**
 * 
 * @param param0 
 */
const Chords: FunctionComponent<Readonly<{
  value?: Chord[];
}>> = ({ value = [] }) => {
  return (
    <span>
      {_.map(value, (chord, i) => (
        <span key={i}>
          <Badge variant="primary" >{chord.name}</Badge><span> </span>
        </span>
      ))}
    </span>
  );
}

/**
 * 
 * @param param0 
 */
const Chain: FunctionComponent<Readonly<{
  value?: ChordChain;
}>> = ({ value }) => {
  if (value) {
    const { avgPriority, priority, chords } = value;
    const modes = _.join(_.map(chords, 'mode'), '-');
    return (<tr>
      <td>{modes}</td>
      <td>
        <Chords value={chords} />
      </td>
      <td>{avgPriority.toFixed(2)}</td>
      <td>{priority}</td>
    </tr>);
  } else {
    return <tr />;
  }
}

/**
 * 
 * @param param0 
 */
const ProgressionsPane: FunctionComponent<Readonly<{
  value?: Progressions;
}>> = ({ value }) => {
  const chains = value?.chains || [];
  return (
    <Table striped bordered hover size="sm">
      <thead>
        <tr>
          <th>Modes</th>
          <th>Chords</th>
          <th>Average Favor</th>
          <th>Total Favor</th>
        </tr>
      </thead>
      <tbody>
        {_.map(chains, (chain, i) => (
          <Chain key={i} value={chain} />
        ))}
      </tbody>
    </Table>
  );
}

/**
 * 
 * @param param0 
 */
const ResultPane: FunctionComponent<Readonly<{
  value?: Result;
}>> = ({ value }) => {
  const errors = value?.errors;
  const progressions = value?.progressions;

  if (errors) {
    return (
      <Alert variant="danger">{errors}</Alert>
    );
  }
  if (progressions) {
    return (<ProgressionsPane value={progressions} />);
  }
  return <div />;
}

/**
 * 
 * @param param0 
 */
const PitchControl: FunctionComponent<Partial<Readonly<{
  value: Pitch;
  onChange: (arg: Pitch) => void
}>>> = ({ value, onChange }) => {
  return (
    <FormControl as="select" size="sm"
      onChange={ev => { if (onChange) { onChange(ev.target.value); } }}
      value={value}>
      {_.map(Pitches, ton => (
        <option key={ton}>{ton}</option>
      ))}
    </FormControl>
  );
};

/**
 * 
 * @param param0 
 */
const Rank: FunctionComponent<Partial<Readonly<{
  value: ChordMode;
  onChange: (arg: ChordMode) => void
}>>> = ({ value, onChange }) => {
  return (
    <FormControl as="select" size="sm"
      onChange={ev => { if (onChange) { onChange(parseInt(ev.target.value)); } }}
      value={value}>
      {ChordModes.map(r => (
        <option key={r}>{r}</option>
      ))}
    </FormControl>
  );
}

/**
 * 
 * @param param0 
 */
const LengthControl: FunctionComponent<Partial<Readonly<{
  value: number;
  min: number;
  max: number;
  onChange: (arg: number) => void
}>>> = ({ value, min = 1, max = 7, onChange }) => {
  return (
    <FormControl as="select" size="sm"
      onChange={ev => { if (onChange) { onChange(parseInt(ev.target.value)) } }}
      value={value}>
      {_.range(min, max + 1).map(r => (
        <option key={r}>{r}</option>
      ))}
    </FormControl>
  );
}

/**
 * 
 */
export class ProgPane extends Component<{}, Readonly<{
  start: ChordMode;
  end: ChordMode;
  pitch: Pitch;
  minLen: number;
  maxLen: number;
}>>
{
  /**
   * 
   * @param props 
   */
  constructor(props: {}) {
    super(props);
    this.state = {
      start: 1,
      end: 1,
      pitch: 'C',
      minLen: 2,
      maxLen: 3
    };
    _.bindAll(this, [
      'handlePitch',
      'handleStartRank',
      'handleEndRank',
      'handleMinLen',
      'handleMaxLen',
      'compute'
    ]);
  }

  /**
   * 
   */
  componentDidMount() {
    // this.compute();
  }

  /**
   * 
   * @param pitch 
   */
  private handlePitch(pitch: Pitch) {
    this.setState({ pitch });
  }

  /**
   * 
   * @param start 
   */
  private handleStartRank(start: ChordMode) {
    this.setState({ start });
  }

  /**
   * 
   * @param end 
   */
  private handleEndRank(end: ChordMode) {
    this.setState({ end });
  }

  /**
   * 
   * @param minLen 
   */
  private handleMinLen(minLen: number) {
    this.setState({ minLen });
  }

  /**
   * 
   * @param maxLen 
   */
  private handleMaxLen(maxLen: number) {
    this.setState({ maxLen });
  }

  /**
   * 
   */
  private compute(): Result {
    const errors = (this.state.minLen > this.state.maxLen) ?
      'min length must be less or equal than max length' :
      undefined;
    if (errors) {
      return { errors };
    } else {
      const progressions = createProgressions(this.state);
      return { progressions }
    }
  }

  render() {
    const { pitch, minLen, maxLen, start, end } = this.state;
    const result = this.compute();

    return (
      <div>
        <Navbar bg="dark" variant="dark" expand="lg">
          <Navbar.Brand href="http://www.mmarini.org">www.mmarini.org</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link href="#">Modal Progressions {Version}</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <Container>
          <Row>
            <Col >
              <ResultPane value={result} />
            </Col>
            <Col xs={2}>
              <Form >
                <FormGroup controlId="pitch">
                  <Form.Label>Pitch</Form.Label>
                  <PitchControl value={pitch} onChange={this.handlePitch} />
                </FormGroup>
                <FormGroup controlId="startMode">
                  <Form.Label>Start mode</Form.Label>
                  <Rank value={start} onChange={this.handleStartRank} />
                </FormGroup>
                <FormGroup controlId="endMode">
                  <Form.Label>End mode</Form.Label>
                  <Rank value={end} onChange={this.handleEndRank} />
                </FormGroup>
                <FormGroup controlId="minLen">
                  <Form.Label>Min chain length</Form.Label>
                  <LengthControl value={minLen} min={2} max={8} onChange={this.handleMinLen} />
                </FormGroup>
                <FormGroup controlId="minLen">
                  <Form.Label>Max chain length</Form.Label>
                  <LengthControl value={maxLen} min={2} max={8} onChange={this.handleMaxLen} />
                </FormGroup>
              </Form>
            </Col>
          </Row>
        </Container>
      </div >
    );
  }
}
