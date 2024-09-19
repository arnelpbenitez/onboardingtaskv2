import React, { Component } from "react";
import { Button, Form, Icon, Modal, Segment } from "semantic-ui-react";

export default class ProductForm extends Component {
	state = {
		open: this.props.open ?? false,
		name: this.props.record?.name ?? "",
		price: this.props.record?.price ?? "",
		recordId: 0,
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
	}

	handleListChange = () => {
		this.props.updateProduct();
	};

	handleOpen = () =>
		this.setState({ open: true, name: "", price: "", recordId: 0 });
	handleClose = () => {
		this.setState({ open: false, recordId: 0 });
		this.props.closeForm();
	};
	handleChange = (e) => {
		this.setState({ [e.target.name]: e.target.value });
	};

	handleSubmit = async (e) => {
		e.preventDefault();
		if (this.state.recordId > 0) {
			await this.updateProduct();
		} else {
			await this.addProduct();
		}

		this.handleListChange();

		this.setState({ name: "", price: "" });

		this.handleClose();
	};

	render() {
		const { open } = this.state;
		return (
			<Segment>
				<Button primary onClick={this.handleOpen}>
					New Product
				</Button>

				<Modal open={open} onClose={this.handleClose} size="small">
					<Modal.Header>
						{this.state.recordId === 0 ? "Create" : "Edit"} Product
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
								<label>Price</label>
								<input
									type="text"
									name="price"
									value={this.state.price}
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

	addProduct = async () => {
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
			.catch((error) => {
				console.log(error);
			});
	};

	updateProduct = async () => {
		await fetch(`/products/${this.state.recordId}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				id: this.state.recordId,
				name: this.state.name,
				price: this.state.price,
			}),
		}).catch((error) => {
			console.log(error);
		});
	};
}
