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
        console.log(HousesList);
      }).catch(() => {
        this.setState({ error: 'Houses could not be loaded. Sth is wrong.', loading: false });
      })

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

      <div>{
        houses.map((houseObj) => (
          <div key={houseObj.id}>
            <Link to={`/houses/${houseObj.id}`} ><span>id: </span>{houseObj.id}  <span>   price: </span>{houseObj.price} </Link>
          </div>))
      }</div>
    );
  }
}