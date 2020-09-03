import React, { Component } from 'react';
import './App.css';
import { createProgressions, Pitches } from './ModProg';

import _ from 'lodash';
import { Container, Navbar, Form, FormControl, FormGroup, Row, Col, Table, Badge, Alert } from 'react-bootstrap';

function Chords({ value }) {
  return (
    <span>
      {_.map(value, (chord, i) => {
        return (
          <span key={i}>
            <Badge variant="primary" >{chord.name}</Badge><span> </span>
          </span>
        );
      })
      }
    </span>
  );
}

function Chain({ value }) {
  const { priority, chords } = value;
  const modes = _.join(_.map(chords, 'mode'), '-');
  return (<tr>
    <td>{modes}</td>
    <td><Chords value={chords} /></td>
    <td>{priority}</td>
  </tr>);
}

function Chains({ value }) {
  const { chains: progressions } = value;
  return (
    <Table striped bordered hover size="sm">
      <thead>
        <tr>
          <th>Modes</th>
          <th>Chords</th>
          <th>Favored</th>
        </tr>
      </thead>
      <tbody>
        {_.map(progressions, (chain, i) => {
          return (
            <Chain key={i} value={chain} />
          );
        })
        }
      </tbody>
    </Table>
  );
}

function PitchControl({ value, onChange }) {
  return (
    <FormControl as="select" size="sm" onChange={onChange} value={value}>
      {_.map(Pitches, ton => {
        return (
          <option key={ton}>{ton}</option>
        );
      })}
    </FormControl>
  );
}

function Rank({ value, onChange }) {
  return (
    <FormControl as="select" size="sm" onChange={onChange} value={value}>
      {_.range(1, 8).map(r => {
        return (
          <option key={r}>{r}</option>
        );
      })}
    </FormControl>
  );
}

function LengthControl({ value, min, max, onChange }) {
  return (
    <FormControl as="select" size="sm" onChange={onChange} value={value}>
      {_.range(min, max + 1).map(r => {
        return (
          <option key={r}>{r}</option>
        );
      })}
    </FormControl>
  );
}

function ResultPane({ data }) {
  if (data.errors) {
    return (
      <Alert variant="danger">{data.errors}</Alert>
    );
  } else {
    return (<Chains value={data.chainsResult} />);
  }
}

class ProgPane extends Component {
  constructor(props) {
    super(props);
    this.state = {
      start: 1,
      end: 1,
      pitch: 'C',
      minLen: 2,
      maxLen: 3
    };
    this.handlePitch = this.handlePitch.bind(this);
    this.handleStartRank = this.handleStartRank.bind(this);
    this.handleEndRank = this.handleEndRank.bind(this);
    this.handleMaxLen = this.handleMaxLen.bind(this);
    this.handleMinLen = this.handleMinLen.bind(this);
    this.compute = this.compute.bind(this);
  }

  componentDidMount() {
    this.compute();
  }

  componentWillUnmount() {
  }

  handlePitch(ev) {
    const pitch = ev.target.value;
    this.setState({ pitch });
  }

  handleStartRank(ev) {
    const start = parseInt(ev.target.value);
    this.setState({ start });
  }

  handleEndRank(ev) {
    const end = parseInt(ev.target.value);
    this.setState({ end });
  }

  handleMinLen(ev) {
    const minLen = parseInt(ev.target.value);
    this.setState({ minLen });
  }

  handleMaxLen(ev) {
    const maxLen = parseInt(ev.target.value);
    this.setState({ maxLen });
  }

  compute() {
    var errors = undefined;
    if (this.state.minLen > this.state.maxLen) {
      errors = 'min length must be less or equal than max length';
    }
    if (errors) {
      return { errors };
    } else {
      const chainsResult = createProgressions(this.state);
      return { chainsResult }
    }
  }

  render() {
    const { pitch, minLen, maxLen, start, end } = this.state;
    const result = this.compute();

    return (
      <div>
        <Navbar bg="dark" variant="dark" expand="lg">
          <Navbar.Brand href="#home">Modal Progressions</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
          </Navbar.Collapse>
        </Navbar>
        <Container>
          <Row>
            <Col >
              <ResultPane data={result} />
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

export default ProgPane;
