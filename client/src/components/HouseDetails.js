import React from 'react';

export default class HouseDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      houseDetails: {},
      error: null,
      loading: false
    }
  }
  componentDidMount() {
    console.log("this.props: " + JSON.stringify(this.props));
    const { id } = this.props.match.params;

    this.setState({ loading: true, error: null });

    fetch(`http://localhost:4321/api/houses/${id}`)
      .then(res => res.json())
      .then(data => {
        console.log("DATA: " + JSON.stringify(data));
        if (data.error) {
          this.setState({ error: data.error, loading: false })
        } else {
          this.setState({ houseDetails: data, error: null, loading: false });
        }
      }).catch((err) => {
        this.setState({ error: 'Sth is wrong.', loading: false });
      })

  }

  render() {
    const { houseDetails, error, loading } = this.state;

    if (loading) {
      return <div>{loading}</div>
    }

    if (error) {
      return <div>{error}</div>
    }
    //ASK I couldn't retrieved info
    return (<div>
      id: {JSON.stringify(houseDetails)}<br />
      price:{houseDetails.price_value}<br />
    </div>);
  }
}