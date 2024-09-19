import React, { Component } from "react";
import { Button, Form, Icon, Modal, Segment } from "semantic-ui-react";
import SemanticDatepicker from "react-semantic-ui-datepickers";

export default class SaleForm extends Component {
	state = {
		open: this.props.open ?? false,
		store: this.props.data?.store ?? 0,
		customer: this.props.data?.customer ?? 0,
		product: this.props.data?.product ?? 0,
		dateSold: this.props.data?.dateSold ?? new Date(),
		recordId: 0,
		customers: [],
		products: [],
		stores: [],
	};

	componentDidMount() {
		this.getCustomersList();
		this.getProductsList();
		this.getStoresList();
	}

	componentDidUpdate(prevProps) {
		if (prevProps.recordId !== this.props.recordId) {
			this.setState({
				recordId: this.props.recordId,
				open: this.props.recordId > 0,
				dateSold: this.props.data.dateSold,
				customer: this.props.data.customerId,
				product: this.props.data.productId,
				store: this.props.data.storeId,
			});
		}
	}

	handleListChange = () => {
		this.props.updateSale();
	};

	handleOpen = () =>
		this.setState({ open: true, name: "", address: "", recordId: 0 });

	handleClose = () => {
		this.setState({
			open: false,
			customer: 0,
			store: 0,
			product: 0,
			dateSold: new Date(),
			recordId: 0,
		});

		this.props.closeForm();
	};

	handleChange = (e) => {
		this.setState({ [e.target.name]: e.target.value });
	};

	handleChangeDate = (event, data) => {
		if (this.state.dateSold !== data.value)
			this.setState({ dateSold: data.value });
	};

	handleSubmit = async (e) => {
		e.preventDefault();
		if (this.state.recordId > 0) {
			await this.updateSale();
		} else {
			await this.addSale();
		}

		this.handleListChange();

		this.handleClose();
	};

	getCustomersList = async () => {
		await fetch("/customers")
			.then((data) => data.json())
			.then((json) => this.setState({ customers: json, loading: false }))
			.catch((error) => {
				console.log(error);
			});
	};

	getProductsList = async () => {
		await fetch("/products")
			.then((data) => data.json())
			.then((json) => this.setState({ products: json, loading: false }))
			.catch((error) => {
				console.log(error);
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
		const { open } = this.state;
		return (
			<Segment>
				<Button primary onClick={this.handleOpen}>
					New Sale
				</Button>

				<Modal open={open} onClose={this.handleClose} size="small">
					<Modal.Header>
						{this.state.recordId === 0 ? "Create" : "Edit"} Sale
					</Modal.Header>
					<Modal.Content>
						<Form onSubmit={this.handleSubmit}>
							<Form.Field>
								<label>Date</label>
								<SemanticDatepicker
									name="dateSold"
									onChange={this.handleChangeDate}
									value={
										this.state.dateSold
											? new Date(this.state.dateSold)
											: new Date()
									}
									autoComplete="off"
								/>
							</Form.Field>
							<Form.Field>
								<label>Customer</label>
								<select
									name="customer"
									value={this.state.customer}
									onChange={this.handleChange}
									required
								>
									<option value="0">Select Customer</option>
									{this.state.customers.map((customer) => {
										return (
											<option
												key={customer.id}
												value={customer.id}
											>
												{customer.name}
											</option>
										);
									})}
								</select>
							</Form.Field>
							<Form.Field>
								<label>Product</label>
								<select
									name="product"
									value={this.state.product}
									onChange={this.handleChange}
									required
								>
									<option value="0">Select Product</option>
									{this.state.products.map((product) => {
										return (
											<option
												key={product.id}
												value={product.id}
											>
												{product.name}
											</option>
										);
									})}
								</select>
							</Form.Field>

							<Form.Field>
								<label>Store</label>
								<select
									name="store"
									value={this.state.store}
									onChange={this.handleChange}
									required
								>
									<option value="0">Select Store</option>
									{this.state.stores.map((store) => {
										return (
											<option
												key={store.id}
												value={store.id}
											>
												{store.name}
											</option>
										);
									})}
								</select>
							</Form.Field>
						</Form>
					</Modal.Content>
					<Modal.Actions>
						<Button onClick={this.handleClose} secondary>
							Cancel
						</Button>
						<Button
							onClick={this.handleSubmit}
							positive
							icon
							labelPosition="right"
						>
							{this.state.recordId === 0 ? "Create" : "Edit"}{" "}
							<Icon name="check circle" />
						</Button>
					</Modal.Actions>
				</Modal>
			</Segment>
		);
	}

	addSale = async () => {
		await fetch("/sales", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				id: 0,
				productId: this.state.product,
				customerId: this.state.customer,
				storeId: this.state.store,
				dateSold: this.state.dateSold,
			}),
		}).then((data) => data.json());
	};

	updateSale = async () => {
		await fetch(`/sales/${this.state.recordId}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				id: this.state.recordId,
				productId: this.state.product,
				customerId: this.state.customer,
				storeId: this.state.store,
				dateSold: this.state.dateSold,
			}),
		}).catch((error) => {
			console.log(error);
		});
	};
}
