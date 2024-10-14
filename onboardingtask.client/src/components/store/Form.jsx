import { Component } from "react";
import {
	Button,
	Form,
	Icon,
	Modal,
	Message,
	MessageHeader,
	Segment,
} from "semantic-ui-react";

export default class StoreForm extends Component {
	state = {
		open: this.props.open ?? false,
		name: this.props.record?.name ?? "",
		address: this.props.record?.address ?? "",
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
				address: this.props.data.address,
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
		this.props.updateStore();
	};

	handleOpen = () =>
		this.setState({
			open: true,
			name: "",
			address: "",
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
				await this.updateStore();
			} else {
				await this.addStore();
			}

			this.handleListChange();

			this.setState({ name: "", address: "" });

			this.handleClose();
		} catch (e) {
			this.setState({
				success: false,
				error: true,
				message: e.message ?? "An error occured.",
			});
		}
	};

	addStore = async () => {
		if (this.state.name === "") {
			throw new Error("Store name is required");
		}

		await fetch("/stores", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				id: 0,
				name: this.state.name,
				address: this.state.address,
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
						message: "New store saved.",
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

	updateStore = async () => {
		if (this.state.name === "") {
			throw new Error("Store name is required");
		}

		if (!this.state.recordId) {
			throw new Error("Invalid customer ID");
		}

		await fetch(`/stores/${this.state.recordId}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				id: this.state.recordId,
				name: this.state.name,
				address: this.state.address,
			}),
		})
			.then(() => {
				this.setState({
					error: false,
					success: true,
					message: "Store record updated.",
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
					New Store
				</Button>

				<Modal open={open} onClose={this.handleClose} size="small">
					<Modal.Header>
						{recordId === 0 ? "Create" : "Edit"} Store
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
								<label>Address</label>
								<input
									type="text"
									name="address"
									value={this.state.address}
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
