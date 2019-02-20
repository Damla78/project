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
    const { id } = this.props.match.params;

    this.setState({ loading: true, error: null });

    fetch(`http://localhost:4321/api/houses/${id}`)
      .then(res => res.json())
      .then(data => {
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

    return (<div>
      id:{houseDetails.id}<br />
      price:{houseDetails.price}<br />
    </div>);
  }
}