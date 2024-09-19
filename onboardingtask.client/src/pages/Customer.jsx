import { Component } from "react";
import CustomerList from "../components/customer/List";
import CustomerForm from "../components/customer/Form";
import { Segment } from "semantic-ui-react";

export default class Customer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			customers: [],
			loading: true,
			recordId: 0,
			data: {},
			open: false,
		};
	}

	componentDidMount() {
		this.getCustomersList();
	}

	handleEditRecord = (id, name, address) => {
		this.setState({
			recordId: id,
			data: { id, name, address },
			open: true,
		});
	};

	handleCloseForm = () => {
		this.setState({
			recordId: 0,
		});
	};

	render() {
		return (
			<Segment>
				<CustomerForm
					updateCustomer={this.getCustomersList}
					recordId={this.state.recordId}
					data={this.state.data}
					open={this.state.open}
					closeForm={this.handleCloseForm}
				/>
				<CustomerList
					customers={this.state.customers}
					editRecord={this.handleEditRecord}
					loading={this.state.loading}
				/>
			</Segment>
		);
	}

	getCustomersList = async () => {
		await fetch("/customers")
			.then((data) => data.json())
			.then((json) => this.setState({ customers: json, loading: false }))
			.catch((error) => {
				console.log(error);
			});
	};
}
