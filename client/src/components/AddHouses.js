import React from 'react';
import Report from './Report';

export default class AddHouses extends React.Component {

  state = {
    error: null,
    report: null
  }

  onChangePrice = (e) => {
    this.setState({ newPrice: e.target.value });
  }
  addNewHouse = (e) => {
    e.preventDefault();

    //console.log(JSON.parse(this.dataInput.value));
    fetch('http://localhost:4321/api/houses', {
      method: 'POST',
      body: this.dataInput.value,
      headers: { 'content-type': 'application/json' }
    }).then(response => response.json())
      .then(data => {
        if (data.error) {
          this.setState({ error: data.error });
        } else {
          this.setState({ error: null, report: data });

        }
        console.log("data: ", data);
      }).catch((err) => {
        this.setState({ error: err.message });
      })
  }

  render() {
    const { error, report } = this.state;
    return (
      <div>
        <form onSubmit={this.addNewHouse}>
          <textarea ref={input => this.dataInput = input}></textarea>
          <br />
          {error && (<div>{error}</div>)}
          <br />
          <button type='submit'>Add New Houses</button>
          <br />
          {!!report && <Report report={report} />}
        </form>
      </div>
    );
  }
}