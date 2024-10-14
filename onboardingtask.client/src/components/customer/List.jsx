import { Component } from "react";
import {
	TableRow,
	TableHeaderCell,
	TableHeader,
	TableCell,
	TableBody,
	Table,
	Button,
	Icon,
	Pagination,
	Modal,
	Segment,
	Dimmer,
	Loader,
	Image,
} from "semantic-ui-react";

export default class CustomerList extends Component {
	state = {
		customers: [],
		customersPaged: [],
		begin: 0,
		end: 5,
		activePage: 1,
		open: false,
		loading: true,
		success: false,
		error: false,
		message: "",
	};

	componentDidUpdate(prevProps) {
		if (prevProps.customers !== this.props.customers) {
			this.setState({
				customers: this.props.customers,
				customersPaged: this.props.customers.slice(
					this.state.begin,
					this.state.end
				),
				loading: this.props.loading,
			});
		}
	}

	handleClose = () => this.setState({ open: false });

	handleEdit = (id, name, address) => {
		this.props.editRecord(id, name, address);
	};

	handlePager = (page) => {
		const limit = 5;
		this.setState({
			activePage: page.activePage,
			begin: page.activePage * limit - limit,
			end: page.activePage * limit,
			customersPaged: this.state.customers.slice(
				page.activePage * limit - limit,
				page.activePage * limit
			),
		});
	};

	deleteCustomer = async () => {
		if (!this.state.recordId) {
			this.setState({
				error: true,
				success: false,
				message: "Invalid customer id",
			});
			return;
		}

		await fetch(`/customers/${this.state.recordId}`, {
			method: "DELETE",
			headers: { "Content-Type": "application/json" },
		})
			.then((data) => {
				if (data.ok) {
					const customers = this.state.customers.filter(
						(customer) => customer.id !== this.state.recordId
					);
					this.setState({ customers });

					const limit = 5;

					this.setState({
						begin: this.state.activePage * limit - limit,
						end: this.state.activePage * limit,
						customersPaged: customers.slice(
							this.state.activePage * limit - limit,
							this.state.activePage * limit
						),
						open: false,
					});

					this.props.deleteRecord(
						true,
						"Record deleted successfully."
					);
				}
				return data.json();
			})
			.then((json) => {
				if (json.error) {
					throw new Error(json.message);
				}
			})
			.catch((e) => {
				this.setState({
					open: false,
				});
				this.props.deleteRecord(
					false,
					e.message || "Something went wrong"
				);
			});
	};

	render() {
		const { loading, customersPaged, customers, open } = this.state;
		return (
			<Segment>
				{loading ? (
					<div>
						<Dimmer active inverted>
							<Loader inverted>Loading</Loader>
						</Dimmer>

						<Image src="https://react.semantic-ui.com/images/wireframe/short-paragraph.png" />
					</div>
				) : (
					""
				)}

				<Table striped>
					<TableHeader>
						<TableRow>
							<TableHeaderCell>Name</TableHeaderCell>
							<TableHeaderCell>Address</TableHeaderCell>
							<TableHeaderCell collapsing>Action</TableHeaderCell>
							<TableHeaderCell collapsing>Action</TableHeaderCell>
						</TableRow>
					</TableHeader>

					<TableBody>
						{customersPaged.map((item) => (
							<TableRow key={item.id}>
								<TableCell>{item.name} </TableCell>
								<TableCell>{item.address}</TableCell>
								<TableCell collapsing>
									<Button
										icon
										labelPosition="right"
										color="yellow"
										onClick={() => {
											this.handleEdit(
												item.id,
												item.name,
												item.address
											);
										}}
									>
										<Icon name="pencil alternate" />
										Edit
									</Button>
								</TableCell>
								<TableCell collapsing>
									<Button
										icon
										labelPosition="right"
										color="red"
										onClick={() => {
											this.setState({
												open: true,
												recordId: item.id,
											});
										}}
									>
										<Icon name="trash alternate" /> Delete
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
				<Pagination
					defaultActivePage={1}
					totalPages={Math.ceil(customers.length / 5)}
					onPageChange={(event, data) => {
						this.handlePager(data);
					}}
				/>

				<Modal open={open} onClose={this.handleClose} size="small">
					<Modal.Header>Delete Customer</Modal.Header>
					<Modal.Content>
						Are you sure you want to delete this customer?
					</Modal.Content>
					<Modal.Actions>
						<Button onClick={this.handleClose} secondary>
							Cancel
						</Button>
						<Button
							onClick={this.deleteCustomer}
							negative
							icon
							labelPosition="right"
						>
							Delete
							<Icon name="delete" />
						</Button>
					</Modal.Actions>
				</Modal>
			</Segment>
		);
	}
}
