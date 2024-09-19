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

export default class CustomerForm extends Component {
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
	}

	handleListChange = () => {
		this.props.updateCustomer();
	};

	handleOpen = () =>
		this.setState({ open: true, name: "", address: "", recordId: 0 });

	handleClose = () => {
		this.setState({ open: false });
		this.props.closeForm();
	};
	handleChange = (e) => {
		this.setState({ [e.target.name]: e.target.value });
	};

	handleSubmit = async (e) => {
		e.preventDefault();
		if (this.state.recordId > 0) {
			await this.updateCustomer();
		} else {
			await this.addCustomer();
		}

		this.handleListChange();

		this.setState({ name: "", address: "" });

		this.handleClose();
	};

	render() {
		const { open } = this.state;
		return (
			<Segment>
				{this.state.success && (
					<Message positive>
						<MessageHeader>Success</MessageHeader>
						<p>{this.state.message}</p>
					</Message>
				)}

				{this.state.error && (
					<Message negative>
						<MessageHeader>Error</MessageHeader>
						<p>{this.state.message}</p>
					</Message>
				)}

				<Button primary onClick={this.handleOpen}>
					New Customer
				</Button>

				<Modal open={open} onClose={this.handleClose} size="small">
					<Modal.Header>
						{this.state.recordId === 0 ? "Create" : "Edit"} Customer
					</Modal.Header>
					<Modal.Content>
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

	addCustomer = async () => {
		await fetch("/customersa", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				id: 0,
				name: this.state.name,
				address: this.state.address,
			}),
		})
			.then((data) => {
				if (data.ok) {
					this.setState({
						success: true,
						error: false,
						message: "New customer added.",
					});
					return data.json();
				}
				throw new Error("Something went wrong please try again.");
			})
			.catch((error) => {
				console.log(error);
				this.setState({
					success: false,
					error: true,
					message:
						error?.message ||
						"An error has occurred please try again.",
				});
			});
	};

	updateCustomer = async () => {
		await fetch(`/customers/${this.state.recordId}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				id: this.state.recordId,
				name: this.state.name,
				address: this.state.address,
			}),
		})
			.then((date) => {
				this.setState({
					success: true,
					message: "Customer record updated.",
				});
			})
			.catch((error) => {
				console.log(error);
				this.setState({ error: true });
			});
	};
}
