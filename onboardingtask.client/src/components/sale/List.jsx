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
	Loader,
	Dimmer,
	Image,
} from "semantic-ui-react";

export default class SaleList extends Component {
	state = {
		sales: [],
		salesPaged: [],
		begin: 0,
		end: 5,
		activePage: 1,
		open: false,
		loading: this.props.loading,
		success: false,
		error: false,
		message: "",
	};

	componentDidUpdate(prevProps) {
		if (prevProps.sales !== this.props.sales) {
			this.setState({
				sales: this.props.sales,
				salesPaged: this.props.sales.slice(
					this.state.begin,
					this.state.end
				),
				loading: this.props.loading,
			});
		}
	}

	handleClose = () => {
		this.setState({ open: false });
		this.props.closeForm();
	};

	handleEdit = (record) => {
		this.props.editRecord(record);
	};

	handlePager = (page) => {
		const limit = 5;
		this.setState({
			activePage: page.activePage,
			begin: page.activePage * limit - limit,
			end: page.activePage * limit,
			salesPaged: this.state.sales.slice(
				page.activePage * limit - limit,
				page.activePage * limit
			),
		});
	};

	deleteSale = async () => {
		if (!this.state.recordId) {
			this.setState({
				error: true,
				success: false,
				message: "Invalid sale id",
			});
			return;
		}

		await fetch(`/sales/${this.state.recordId}`, {
			method: "DELETE",
			headers: { "Content-Type": "application/json" },
		})
			.then((data) => {
				if (data.ok) {
					const sales = this.state.sales.filter(
						(sale) => sale.id !== this.state.recordId
					);
					this.setState({ sales });

					const limit = 5;

					this.setState({
						begin: this.state.activePage * limit - limit,
						end: this.state.activePage * limit,
						salesPaged: sales.slice(
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
		return (
			<Segment>
				{this.state.loading ? (
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
							<TableHeaderCell>Customer</TableHeaderCell>
							<TableHeaderCell>Product</TableHeaderCell>
							<TableHeaderCell>Store</TableHeaderCell>
							<TableHeaderCell>Date Sold</TableHeaderCell>
							<TableHeaderCell collapsing>Action</TableHeaderCell>
							<TableHeaderCell collapsing>Action</TableHeaderCell>
						</TableRow>
					</TableHeader>

					<TableBody>
						{this.state.salesPaged.map((item) => (
							<TableRow key={item.id}>
								<TableCell>{item.customerName} </TableCell>
								<TableCell>{item.productName}</TableCell>
								<TableCell>{item.storeName}</TableCell>
								<TableCell>{item.dateSold}</TableCell>
								<TableCell collapsing>
									<Button
										icon
										labelPosition="right"
										color="yellow"
										onClick={() => {
											this.handleEdit(item);
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
					totalPages={Math.ceil(this.state.sales.length / 5)}
					onPageChange={(event, data) => {
						this.handlePager(data);
					}}
				/>

				<Modal
					open={this.state.open}
					onClose={this.handleClose}
					size="small"
				>
					<Modal.Header>Delete Sale</Modal.Header>
					<Modal.Content>
						Are you sure you want to delete this sale?
					</Modal.Content>
					<Modal.Actions>
						<Button onClick={this.handleClose} secondary>
							Cancel
						</Button>
						<Button
							onClick={this.deleteSale}
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
