import React, { Component } from "react";
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

export default class ProductList extends Component {
	state = {
		products: [],
		productsPaged: [],
		begin: 0,
		end: 5,
		activePage: 1,
		open: false,
		loading: true,
	};

	componentDidUpdate(prevProps) {
		if (prevProps.products !== this.props.products) {
			this.setState({
				products: this.props.products,
				productsPaged: this.props.products.slice(
					this.state.begin,
					this.state.end
				),
				loading: this.props.loading,
			});
		}
	}

	handleClose = () => this.setState({ open: false });

	handleEdit = (id, name, price) => {
		this.props.editRecord(id, name, price);
	};

	handlePager = (page) => {
		const limit = 5;
		this.setState({
			activePage: page.activePage,
			begin: page.activePage * limit - limit,
			end: page.activePage * limit,
			productsPaged: this.state.products.slice(
				page.activePage * limit - limit,
				page.activePage * limit
			),
		});
	};

	deleteProduct = async () => {
		await fetch(`/products/${this.state.recordId}`, {
			method: "DELETE",
			headers: { "Content-Type": "application/json" },
		})
			.then((data) => {
				const products = this.state.products.filter(
					(product) => product.id !== this.state.recordId
				);
				this.setState({ products });

				const limit = 5;

				this.setState({
					begin: this.state.activePage * limit - limit,
					end: this.state.activePage * limit,
					productsPaged: products.slice(
						this.state.activePage * limit - limit,
						this.state.activePage * limit
					),
					open: false,
				});
			})
			.catch((error) => {
				console.log(error);
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
							<TableHeaderCell>Name</TableHeaderCell>
							<TableHeaderCell>Price</TableHeaderCell>
							<TableHeaderCell collapsing>Action</TableHeaderCell>
							<TableHeaderCell collapsing>Action</TableHeaderCell>
						</TableRow>
					</TableHeader>

					<TableBody>
						{this.state.productsPaged.map((item) => (
							<TableRow key={item.id}>
								<TableCell>{item.name} </TableCell>
								<TableCell>{item.price}</TableCell>
								<TableCell collapsing>
									<Button
										icon
										labelPosition="right"
										color="yellow"
										onClick={() => {
											this.handleEdit(
												item.id,
												item.name,
												item.price
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
					totalPages={Math.ceil(this.state.products.length / 5)}
					onPageChange={(event, data) => {
						this.handlePager(data);
					}}
				/>

				<Modal
					open={this.state.open}
					onClose={this.handleClose}
					size="small"
				>
					<Modal.Header>Delete Product</Modal.Header>
					<Modal.Content>
						Are you sure you want to delete this product?
					</Modal.Content>
					<Modal.Actions>
						<Button onClick={this.handleClose} secondary>
							Cancel
						</Button>
						<Button
							onClick={this.deleteProduct}
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
