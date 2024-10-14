import { Component } from "react";
import {
	Button,
	Form,
	Icon,
	Modal,
	Segment,
	Message,
	MessageHeader,
} from "semantic-ui-react";

export default class ProductForm extends Component {
	state = {
		open: this.props.open ?? false,
		name: this.props.record?.name ?? "",
		price: this.props.record?.price ?? 0,
		recordId: 0,
		success: false,
		error: false,
		message: "",
	};

	componentDidUpdate(prevProps) {
		if (prevProps.recordId !== this.props.recordId) {
			this.setState({
				recordId: this.props.recordId,
				open: this.props.recordId > 0,
				name: this.props.data.name,
				price: this.props.data.price,
			});
		}

		if (prevProps.message !== this.props.message) {
			this.setState({
				success: this.props.success,
				error: !this.props.success,
				message: this.props.message,
			});
		}
		console.log(prevProps.message, this.props.message);
	}

	handleListChange = () => {
		this.props.updateProduct();
	};

	handleOpen = () =>
		this.setState({
			open: true,
			name: "",
			price: 0,
			recordId: 0,
			error: false,
			success: false,
			message: "",
		});

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
		this.setState({ open: false });
		this.props.closeForm();
	};
	handleChange = (e) => {
		this.setState({ [e.target.name]: e.target.value });
	};

	handleSubmit = async (e) => {
		e.preventDefault();
		try {
			if (this.state.recordId > 0) {
				await this.updateProduct();
			} else {
				await this.addProduct();
			}

			this.handleListChange();

			this.setState({ name: "", price: 0 });

			this.handleClose();
		} catch (e) {
			this.setState({
				success: false,
				error: true,
				message: e.message ?? "An error occured.",
			});
		}
	};

	addProduct = async () => {
		if (this.state.name === "") {
			throw new Error("Product name is required");
		}

		if (isNaN(this.state.price)) {
			throw new Error("Invalid product price.");
		}

		await fetch("/products", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				id: 0,
				name: this.state.name,
				price: this.state.price,
			}),
		})
			.then((data) => data.json())
			.then((json) => {
				if (json.errors) {
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
						message: "New product saved.",
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

	updateProduct = async () => {
		if (this.state.name === "") {
			throw new Error("Product name is required");
		}

		if (isNaN(this.state.price)) {
			throw new Error("Invalid product price.");
		}

		if (!this.state.recordId) {
			throw new Error("Invalid product ID");
		}

		await fetch(`/products/${this.state.recordId}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				id: this.state.recordId,
				name: this.state.name,
				price: this.state.price,
			}),
		})
			.then(() => {
				this.setState({
					error: false,
					success: true,
					message: "Product record updated.",
				});
			})
			.catch(() => {
				this.setState({
					error: true,
					success: false,
					message: "Unable to update the record",
				});
			});
	};

	render() {
		const { open, recordId, success, error, message } = this.state;
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
					New Product
				</Button>

				<Modal open={open} onClose={this.handleClose} size="small">
					<Modal.Header>
						{recordId === 0 ? "Create" : "Edit"} Product
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
								<label>Name</label>
								<input
									type="text"
									name="name"
									value={this.state.name}
									onChange={this.handleChange}
									required
								/>
							</Form.Field>
							<Form.Field>
								<label>Price</label>
								<input
									type="number"
									name="price"
									value={this.state.price}
									onChange={this.handleChange}
									required
								/>
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
							{recordId === 0 ? "Create" : "Edit"}{" "}
							<Icon name="check circle" />
						</Button>
					</Modal.Actions>
				</Modal>
			</Segment>
		);
	}
}
