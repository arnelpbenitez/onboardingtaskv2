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

export default class StoreList extends Component {
	state = {
		stores: [],
		storesPaged: [],
		begin: 0,
		end: 5,
		activePage: 1,
		open: false,
		loading: true,
	};

	componentDidUpdate(prevProps) {
		if (prevProps.stores !== this.props.stores) {
			this.setState({
				stores: this.props.stores,
				storesPaged: this.props.stores.slice(
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
			storesPaged: this.state.stores.slice(
				page.activePage * limit - limit,
				page.activePage * limit
			),
		});
	};

	deleteStore = async () => {
		await fetch(`/stores/${this.state.recordId}`, {
			method: "DELETE",
			headers: { "Content-Type": "application/json" },
		}).then((data) => {
			const stores = this.state.stores.filter(
				(store) => store.id !== this.state.recordId
			);
			this.setState({ stores });

			const limit = 5;

			this.setState({
				begin: this.state.activePage * limit - limit,
				end: this.state.activePage * limit,
				storesPaged: stores.slice(
					this.state.activePage * limit - limit,
					this.state.activePage * limit
				),
				open: false,
			});
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
							<TableHeaderCell>Address</TableHeaderCell>
							<TableHeaderCell collapsing>Action</TableHeaderCell>
							<TableHeaderCell collapsing>Action</TableHeaderCell>
						</TableRow>
					</TableHeader>

					<TableBody>
						{this.state.storesPaged.map((item) => (
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
					totalPages={Math.ceil(this.state.stores.length / 5)}
					onPageChange={(event, data) => {
						this.handlePager(data);
					}}
				/>

				<Modal
					open={this.state.open}
					onClose={this.handleClose}
					size="small"
				>
					<Modal.Header>Delete Store</Modal.Header>
					<Modal.Content>
						Are you sure you want to delete this store?
					</Modal.Content>
					<Modal.Actions>
						<Button onClick={this.handleClose} secondary>
							Cancel
						</Button>
						<Button
							onClick={this.deleteStore}
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
