import React from 'react';

import { Link } from 'react-router-dom';

export default class HousesList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      houses: [],
      error: null,
      loading: false,
      newPrice: ''
    }
  }
  componentDidMount() {
    this.setState({ loading: true, error: null });

    fetch('http://localhost:4321/api/houses')
      .then(res => res.json())
      .then(HousesList => {
        this.setState({ houses: HousesList, error: null, loading: false });
      }).catch(() => {
        this.setState({ error: 'Houses could not be loaded. Sth is wrong.', loading: false });
      })

  }
  onChangePrice = (e) => {
    this.setState({ newPrice: e.target.value });
  }
  addNewHouse = (e) => {
    fetch('http://localhost:4321/api/houses', {
      method: 'POST',
      body: JSON.stringify({ price: this.state.newPrice }),
      headers: { 'content-type': 'application/json' }
    }).then(response => response.json())
      .then(data => {
        let tempHouses = [...this.state.houses];
        tempHouses.push({ id: data.id, price: data.price });
        this.setState({ houses: tempHouses });
      }).catch(() => {
        this.setState({ error: 'Houses could not be loaded. Sth is wrong.', loading: false });
      })
    e.preventDefault();
  }
  render() {
    const { houses, error, loading } = this.state;
    if (loading) {
      return <div>loading...</div>
    }

    if (error) {
      return <div>{error}</div>
    }

    return (
      <div>
        <div>
          <form onSubmit={this.addNewHouse}>
            <input type='text' value={this.state.newPrice} onChange={this.onChangePrice} />
            <input type='submit' value='Add New Item' />
          </form>
        </div>
        <div>{
          houses.map((houseObj) => (
            <div key={houseObj.id}>
              <Link to={`/houses/${houseObj.id}`} ><span>id: </span>{houseObj.id}  <span>   price: </span>{houseObj.price} </Link>
            </div>))
        }</div>
      </div>);
  }
}