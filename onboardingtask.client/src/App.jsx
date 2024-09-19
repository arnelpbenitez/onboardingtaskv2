import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "semantic-ui-css/semantic.min.css";
import { NavMenu } from "./components/navbar/NavMenu";
import { Container } from "semantic-ui-react";
import Customer from "./pages/Customer";
import Product from "./pages/Product";
import Store from "./pages/Store";
import Sales from "./pages/Sales";
import NotFound from "./pages/NotFound";

function App() {
	return (
		<Router>
			<div className="App">
				<Container>
					<NavMenu />
					<Routes>
						<Route path="/" element={<Customer />} />
						<Route path="/customer" element={<Customer />} />
						<Route path="/product" element={<Product />} />
						<Route path="/store" element={<Store />} />
						<Route path="/sales" element={<Sales />} />
						<Route path="*" element={<NotFound />} />
					</Routes>
				</Container>
			</div>
		</Router>
	);
}

export default App;
