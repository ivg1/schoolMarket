//import { useFilter } from "./FilterContext.jsx";
import { FloatingLabel, Dropdown, DropdownItem, Button } from "flowbite-react";
import ListingsDrawer from "../components/ListingsDrawer.jsx";

import { useState } from "react";

//onChange={(e) => setFilters({ ...filters, search: e.target.value })} (in FloatingLabel)
const Filter = ({ setCategory, category }) => {
	return (
			<div className="flex flex-col items-center gap-2 sm:flex-row">
				<div className="flex sm:order-first gap-2">
					<ListingsDrawer />
					<Dropdown label="Categories" color="red">
						<DropdownItem onClick={() => setCategory("all")}>
							All Categories
						</DropdownItem>
						<DropdownItem onClick={() => setCategory("all")}>
							more coming soon
						</DropdownItem>
						{/*
						<DropdownItem>
							Books (incl. textbooks)
						</DropdownItem>
						<DropdownItem>
							Stationery
						</DropdownItem>
						<DropdownItem>
							Homework
						</DropdownItem>
						<DropdownItem>
							Tutoring
						</DropdownItem>
						<DropdownItem>
							Old tests/exams
						</DropdownItem>
						<DropdownItem>
							Leaked tests/exams??
						</DropdownItem>
						*/}
					</Dropdown>
				</div>
				<FloatingLabel
					className="max-w-60 ml"
					variant="outlined"
					label="Search listings"
					color="error"
					value=""
					placeholder="doesnt work"
					readOnly
				/>
			</div>
	);
};

export default Filter;
