import { Component } from "react";
import {
	Button,
	Form,
	Icon,
	Message,
	MessageHeader,
	Modal,
	Segment,
} from "semantic-ui-react";

export default class SaleForm extends Component {
	state = {
		open: this.props.open ?? false,
		store: this.props.data?.store ?? 0,
		customer: this.props.data?.customer ?? 0,
		product: this.props.data?.product ?? 0,
		dateSold: this.props.data?.dateSold ?? null,
		recordId: 0,
		customers: [],
		products: [],
		stores: [],
		success: false,
		error: false,
		message: "",
	};

	componentDidMount() {
		this.getCustomersList();
		this.getProductsList();
		this.getStoresList();
	}

	componentDidUpdate(prevProps) {
		if (prevProps.recordId !== this.props.recordId) {
			let dateSold = this.props.data.dateSold.replace("T", " ");
			if (dateSold) {
				dateSold = new Date(dateSold);
			} else {
				dateSold = new Date();
			}

			this.setState({
				recordId: this.props.recordId,
				open: this.props.recordId > 0,
				dateSold:
					dateSold.getFullYear() +
					"-" +
					(dateSold.getMonth() + 1 < 10 ? "0" : "") +
					(dateSold.getMonth() + 1) +
					"-" +
					(dateSold.getDate() < 10 ? "0" : "") +
					dateSold.getDate(),
				customer: this.props.data.customerId,
				product: this.props.data.productId,
				store: this.props.data.storeId,
			});
		}

		if (prevProps.message !== this.props.message) {
			this.setState({
				success: this.props.success,
				error: !this.props.success,
				message: this.props.message,
			});
		}
	}

	handleListChange = () => {
		this.props.updateSale();
	};

	handleOpen = () => {
		let dateSold = new Date();
		this.setState({
			open: true,
			dateSold:
				dateSold.getFullYear() +
				"-" +
				(dateSold.getMonth() + 1 < 10 ? "0" : "") +
				(dateSold.getMonth() + 1) +
				"-" +
				(dateSold.getDate() < 10 ? "0" : "") +
				dateSold.getDate(),
			customer: 0,
			store: 0,
			product: 0,
			recordId: 0,
			error: false,
			success: false,
			message: "",
		});
	};

	handleCancel = () => {
		this.setState({
			open: false,
			message: "",
			error: false,
			success: false,
		});
		this.props.closeForm();
	};

	handleClose = () => {
		let dateSold = new Date();
		this.setState({
			open: false,
			customer: 0,
			store: 0,
			product: 0,
			dateSold:
				dateSold.getFullYear() +
				"-" +
				(dateSold.getMonth() + 1 < 10 ? "0" : "") +
				(dateSold.getMonth() + 1) +
				"-" +
				(dateSold.getDate() < 10 ? "0" : "") +
				dateSold.getDate(),
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
		try {
			if (this.state.recordId > 0) {
				await this.updateSale();
			} else {
				await this.addSale();
			}

			this.handleListChange();

			this.handleClose();
		} catch (e) {
			this.setState({
				success: false,
				error: true,
				message: e.message ?? "An error occured.",
			});
		}
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

	addSale = async () => {
		if (!this.state.dateSold) {
			throw new Error("Date sold is required");
		}

		if (!this.state.customer) {
			throw new Error("Customer is required");
		}

		if (!this.state.product) {
			throw new Error("Product is required");
		}

		if (!this.state.store) {
			throw new Error("Store is required");
		}

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
		})
			.then((data) => {
				return data.json();
			})
			.then((json) => {
				if (json.error) {
					throw new Error(
						json.message ?? "Something went wrong please try again."
					);
				} else if (json.errors) {
					let message = [];
					for (let key in json.errors) {
						json.errors[key].forEach((item) => {
							message = [...message, item];
						});
					}

					throw new Error(
						message.length
							? message.join(" ")
							: "Something went wrong please try again."
					);
				} else {
					this.setState({
						success: true,
						error: false,
						message: "New sale saved.",
					});

					return json;
				}
			})
			.catch((error) => {
				this.setState({
					success: false,
					error: true,
					message:
						error?.message ||
						"An error has occurred please try again.",
				});
			});
	};

	updateSale = async () => {
		if (!this.state.dateSold) {
			throw new Error("Date sold is required");
		}

		if (!this.state.customer) {
			throw new Error("Customer is required");
		}

		if (!this.state.product) {
			throw new Error("Product is required");
		}

		if (!this.state.store) {
			throw new Error("Store is required");
		}

		if (!this.state.recordId) {
			throw new Error("Invalid sale ID");
		}

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
		})
			.then((data) => data.json())
			.then((json) => {
				if (json.error) {
					throw new Error(json.message);
				}
				this.setState({
					error: false,
					success: true,
					message: "Sale record updated.",
				});
			})
			.catch((e) => {
				throw new Error(e.message);
			});
	};

	render() {
		const { open, message, success, error } = this.state;
		return (
			<Segment>
				{success && message != "" && (
					<Message positive>
						<MessageHeader>Success</MessageHeader>
						<p>{message}</p>
					</Message>
				)}

				{error && message != "" && (
					<Message negative>
						<MessageHeader>Error</MessageHeader>
						<p>{message}</p>
					</Message>
				)}

				<Button primary onClick={this.handleOpen}>
					New Sale
				</Button>

				<Modal open={open} onClose={this.handleClose} size="small">
					<Modal.Header>
						{this.state.recordId === 0 ? "Create" : "Edit"} Sale
					</Modal.Header>
					<Modal.Content>
						{error && message != "" && (
							<Message negative>
								<MessageHeader>Error</MessageHeader>
								<p>{message}</p>
							</Message>
						)}
						<Form onSubmit={this.handleSubmit}>
							<Form.Field>
								<label>Date</label>
								<input
									type="date"
									name="dateSold"
									onChange={this.handleChange}
									value={this.state.dateSold}
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
						<Button onClick={this.handleCancel} secondary>
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
}
