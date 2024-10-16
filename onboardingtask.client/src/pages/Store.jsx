import { Component } from "react";
import StoreList from "../components/store/List";
import StoreForm from "../components/store/Form";

export default class Store extends Component {
	constructor(props) {
		super(props);
		this.state = {
			stores: [],
			loading: true,
			recordId: 0,
			data: {},
			open: false,
		};
	}

	componentDidMount() {
		this.getStoresList();
	}

	handleEditRecord = (id, name, address) => {
		this.setState({
			recordId: id,
			data: { id, name, address },
			open: true,
			message: "",
		});
	};

	handleDeleteRecord = (success, message) => {
		this.setState({
			success: success,
			message: message,
		});
	};

	handleCloseForm = () => {
		this.setState({
			recordId: 0,
		});
	};

	getStoresList = async () => {
		await fetch("/stores")
			.then((data) => data.json())
			.then((json) => this.setState({ stores: json, loading: false }))
			.catch((error) => {
				console.log(error);
			});
	};

	render() {
		return (
			<div>
				<div>
					<StoreForm
						updateStore={this.getStoresList}
						recordId={this.state.recordId}
						data={this.state.data}
						open={this.state.open}
						closeForm={this.handleCloseForm}
						success={this.state.success}
						message={this.state.message}
					/>
					<StoreList
						stores={this.state.stores}
						editRecord={this.handleEditRecord}
						loading={this.state.loading}
						deleteRecord={this.handleDeleteRecord}
					/>
				</div>
			</div>
		);
	}
}
