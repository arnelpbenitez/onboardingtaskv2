import { Component } from "react";
import { Menu } from "semantic-ui-react";
import { Link } from "react-router-dom";

const items = [
	{ key: "customer", name: "Customers", active: true },
	{ key: "product", name: "Products" },
	{ key: "store", name: "Stores" },
	{ key: "sales", name: "Sales" },
];

export class NavMenu extends Component {
	state = { activeItem: "customer" };

	componentDidMount() {
		const currentLocation = window.location.href;
		items.map((item) => {
			if (currentLocation.indexOf(item.key) > 0)
				return this.setState({ activeItem: item.key });
			else return false;
		});
	}

	handleItemClick = (e, { name }) => {
		this.setState({ activeItem: name });
	};

	render() {
		return (
			<Menu>
				{items.map((item) => {
					return (
						<Menu.Item
							key={item.key}
							name={item.key}
							active={this.state.activeItem === item.key}
							onClick={this.handleItemClick}
							as={Link}
							to={`/${item.key}`}
						>
							{item.name}
						</Menu.Item>
					);
				})}
			</Menu>
		);
	}
}
