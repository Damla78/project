import React from 'react';


import { Link } from 'react-router-dom';
import Pages from './Pages';

export default class HousesList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      houses: [],
      cities: [],
      error: null,
      loading: false,
      perPage: 2,
      total: 0,
      searchCriteria: {
        price_min: 0,
        price_max: 1000000,
        location_city: "",
        location_country: "",
        order: "location_country_asc",
        page: 1
      }
    }
  }

  async componentDidMount() {

    await this.fetchCities();//ASK without await console is empty????

    this.setState({
      ...this.state,
      loading: true,
      error: null,
      searchCriteria: { ...this.state.searchCriteria }
    }, this.fetchHouses);

  }

  fetchHouses = (updateUrl = false) => {
    const { searchCriteria } = this.state;
    /*const queryString = Object.keys(this.searchCriteria)
      .map((field) => `${field}=${encodeURI(this.searchCriteria[field])}`)
      .join(`&`);*/
    const queryFilterString = Object.keys(searchCriteria)
      .reduce((query, field) => {
        const val = searchCriteria[field];

        if (val !== null && val !== '') {
          query.push(`${field}=${encodeURI(val)}`);
        }
        return query;
      }, [])
      .join('&');
    console.log("queryFilterString" + queryFilterString);
    //if (updateUrl) {
    this.props.history.push(this.props.location.pathname + '?' + queryFilterString);
    //}

    return fetch(`http://localhost:4321/api/houses?${queryFilterString}`)
      .then(res => res.json())
      .then((HousesList, perPage, totalNumHouses, error) => {//, error
        if (error) {
          this.setState({ houses: [], loading: false, error })
        } else {
          this.setState({
            houses: HousesList.houses,
            error: null,
            loading: false,
            perPage: HousesList.HOUSES_PER_PAGE,
            total: HousesList.totalNumHouses[0].total
          });
        }
      }).catch(() => {
        this.setState({ error: 'Houses could not be loaded. Sth is wrong.', loading: false });
      })
  }

  fetchCities = () => {

    return fetch(`http://localhost:4321/api/houses/cities`)
      .then(res => res.json())
      .then((cities, error) => {//, error
        if (error) {
          this.setState({ cities: [], error })
        } else {
          this.setState({ cities: cities });
        }
      }).catch(() => {
        this.setState({ error: 'Cities could not be loaded. Sth is wrong.' });
      })
  }



  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      ...this.state,
      searchCriteria: {
        ...this.state.searchCriteria,
        [name]: value
      }
    });//, () => this.fetchHouses(true)
    console.log(name + " " + value);
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.fetchHouses();

  }

  pageChange = (page) => {
    console.log('**********page: ' + page);
    this.setState({
      ...this.state,
      searchCriteria: {
        ...this.state.searchCriteria,
        page: page
      }
    }, this.fetchHouses);

  }

  render() {
    const { houses, cities, error, loading, perPage, total,
      searchCriteria: {
        price_min,
        price_max,
        location_city,
        location_country,
        order,
        page
      } } = this.state;


    console.log('RENDER......perPage:' + perPage + ' total: ' + total + ' page: ' + page);

    return (
      <div>
        <form onSubmit={this.handleSubmit} >
          <div>
            <label>
              <strong>Price min:</strong>
              <select name="price_min" value={price_min} onChange={this.handleInputChange}>
                <option value="0">0</option>
                <option value="50000">50000</option>
                <option value="100000">100000</option>
                <option value="200000">200000</option>
                <option value="500000">500000</option>
              </select>
            </label>
          </div>

          <br />

          <div>
            <label>
              <strong>Price max:</strong>
              <select name="price_max" value={price_max} onChange={this.handleInputChange}>
                <option value="50000">50000</option>
                <option value="100000">100000</option>
                <option value="200000">200000</option>
                <option value="500000">500000</option>
                <option value="1000000">1000000</option>
              </select>
            </label>
          </div>

          <br />

          <div>
            <label>
              <strong>City:</strong>
              {cities && <select name="location_city" value={location_city} onChange={this.handleInputChange}>
                <option value="">Select city</option>
                {cities.map((city, i) => (
                  <option key={i} value={city.location_city}>{city.location_city}</option>
                ))}
                {/*
                <select name="location_city" value={location_city} onChange={this.handleInputChange}>
                <option value="">Select city</option>
                <option value="Kiev">Kiev</option>
    <option value="Amsterdam">Amsterdam</option>*/}
              </select>}
            </label>
          </div>

          <br />

          <div>
            <label>
              <strong>Country:</strong>
              <select name="location_country" value={location_country} onChange={this.handleInputChange}>
                <option value="">Select country</option>
                <option value="Netherlands">Netherlands</option>
                <option value="Amsterdam">Amsterdam</option>
              </select>
            </label>
          </div>

          <br />

          <div>
            <label>
              <strong>Order:</strong>
              <select name="order" value={order} onChange={this.handleInputChange}>
                <option value="">Select order</option>
                <option value="location_country_asc">Country Asc</option>
                <option value="location_country_desc">Country Desc</option>
                <option value="price_value_asc">Price Asc</option>
                <option value="price_value_desc">Price Desc</option>
              </select>
            </label>
          </div>

          <br />

          <div>
            <button type="submit" value="Submit">Search</button>
          </div>

          <br />
          <br />
          {loading && <div>loading...</div>}
          {error && <div>{error}</div>}
          {
            houses.length === 0 ? < div > No houses yet.</div> :
              (
                <div>{
                  houses.map((houseObj) => (
                    <div key={houseObj.id}>
                      <Link to={`/houses/${houseObj.id}`} >
                        <span><strong>id: </strong> </span>{houseObj.id}
                        <span> <strong>  price: </strong></span>{houseObj.price_value}
                        <span><strong>   country:</strong> </span>{houseObj.location_country}
                        <span><strong>   city: </strong></span>{houseObj.location_city}</Link>
                    </div>))
                }</div>)
          }
        </form >
        {total && <div><Pages
          page={this.state.searchCriteria.page}
          perPage={this.state.perPage}
          total={this.state.total}
          pageChange={this.pageChange}>
        </Pages></div>}
      </div>
    );
  }
}