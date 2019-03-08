import React from 'react';



class Pages extends React.Component {



  constructor(props) {
    super(props);

    this.state = {
      page: 1,
      perPage: 3,
      total: 0,
      lastPage: 1
    }
  }

  forward = () => {

    const pageNum = this.state.page + 1;
    console.log("*****pageNum: " + pageNum);
    this.setState({
      ...this.state,
      page: pageNum
    }, this.props.pageChange(pageNum));
  }
  backward = () => {
    const pageNum = this.state.page - 1;
    this.setState({
      ...this.state,
      page: pageNum
    }, this.props.pageChange(pageNum));
  }

  render() {
    const page = this.props.page;
    const perPage = this.props.perPage;
    const total = this.props.total;
    const lastPage = Math.ceil(total / perPage);


    return (
      <div>
        {(page !== 1) ? < button onClick={this.backward}>back</button> : <div></div>
        }
        {page}/{lastPage}
        {(page !== lastPage) ? <button onClick={this.forward}>></button> : <div></div>}
      </div >);
  }

}
export default Pages;