import React, { useState, useEffect } from "react";
// import { Multiselect } from "multiselect-react-dropdown";
import {
	FaAngleDoubleLeft,
	FaAngleDoubleRight,
	FaAngleRight,
	FaArrowUp,
	FaArrowDown,
	FaRegSadTear,
	FaAngleLeft,
} from "react-icons/fa";
import PropTypes from "prop-types";
import "./style.css";
export default function DataTable(props) {
	const completeData = props.columnData;
	const [column, setcolumn] = useState(completeData);
	const [pagno, setpage] = useState(0);
	const [rowcount, setrowcount] = useState(10);
	const [filtertemp, setfiltertemp] = useState("");
	const [rangeValues, setrangeValues] = useState([]);
	const [headSorted, setHeadsorted] = useState("");
	const [searchValues, setsearchValues] = useState({});
	const [overallSearch, setoverallSearch] = useState("");
	const pageCount = props.pageCount || [10, 20, 50, 100];

	const sort = (val) => {
		setHeadsorted(val);
		setpage(0);
		updateSelect("pagdd", 0);
		let temp = column;
		let sorted = [];
		let headtitle = [];
		props.rowData.map((val) => headtitle.push(val.title));
		let index = headtitle.indexOf(val);
		try {
			sorted = temp.sort((a, b) => a[index].localeCompare(b[index]));
			val !== filtertemp && (sorted = sorted.reverse());
		} catch (err) {
			sorted = temp.sort(function (a, b) {
				return a[index] - b[index];
			});
			val !== filtertemp && (sorted = sorted.reverse());
		}
		val !== filtertemp ? setfiltertemp(val) : setfiltertemp("");
		setpage(0);
		setcolumn(sorted);
	};
	function minifyValue(labelValue) {
		// Nine Zeroes for Billions
		return Math.abs(Number(labelValue)) >= 1.0e9
			? (Math.abs(Number(labelValue)) / 1.0e9).toFixed(2) + "B"
			: // Six Zeroes for Millions
			Math.abs(Number(labelValue)) >= 1.0e6
			? (Math.abs(Number(labelValue)) / 1.0e6).toFixed(2) + "M"
			: // Three Zeroes for Thousands
			Math.abs(Number(labelValue)) >= 1.0e3
			? (Math.abs(Number(labelValue)) / 1.0e3).toFixed(2) + "K"
			: Math.abs(Number(labelValue).toFixed(2));
	}
	const MasterSearch = (masterSearch, fieldSearch, Range) => {
		let mastersearch = masterSearch || overallSearch;
		let fieldsearch = fieldSearch || searchValues;
		let range = Range || rangeValues;
		console.log({ mastersearch, fieldsearch, range });
		let filtered = [];
		let data = completeData;

		//MasterSearch
		data.map((row) => {
			row.some((col) => {
				if (isNaN(col)) {
					if (
						col.toLowerCase().search(mastersearch.toLowerCase()) !==
						-1
					) {
						filtered.push(row);
						return true;
					}
				} else {
					if (col.toString().search(mastersearch) !== -1) {
						filtered.push(row);
						return true;
					}
				}
				return null;
			});
			return null;
		});
		//Column Search
		Object.keys(fieldsearch).map((key) => {
			filtered.length && (data = filtered);
			filtered = [];
			data &&
				data.map((row) => {
					isNaN(row[key]) &&
						row[key]
							.toLowerCase()
							.search(fieldsearch[key].toLowerCase()) !== -1 &&
						filtered.push(row);
					return null;
				});
			return null;
		});
		//Range Search
		range.map((val, index) => {
			if (val && val.start && val.end) {
				filtered.length && (data = filtered);
				filtered = [];
				data &&
					data.map((row) => {
						if (
							row[index] >= parseInt(val.start) &&
							row[index] <= parseInt(val.end)
						) {
							filtered.push(row);
						}
						return null;
					});
			}
			return null;
		});

		setcolumn(filtered);
	};
	const updateSelect = (id, val) => {
		document.getElementById(id).value = val;
	};
	return (
		<div className="VSDataTable">
			<div className="header">
				<div className="right">
					{props.overallSearch && (
						<div className="master-search">
							<input
								placeholder=" "
								onChange={(e) => {
									setoverallSearch(e.target.value);
									MasterSearch(e.target.value);
								}}
								value={overallSearch}
								id="search"
								type="text"
							/>
							<label htmlFor="search">Search</label>
						</div>
					)}
				</div>
			</div>
			<table>
				<thead>
					<tr>
						{props.displayIndex && <th>S.No</th>}
						{props.rowData.map((val, i) => {
							let active =
								val.title === headSorted ? "active" : "";
							return (
								<th
									width={val.width}
									className={"point"}
									onClick={() =>
										val.sortable && sort(val.title)
									}
									key={i}
								>
									{val.title.replace(/_/g, " ")}
									{val.sortable && (
										<span className={active}>
											<FaArrowDown /> <FaArrowUp />
										</span>
									)}
								</th>
							);
						})}
					</tr>
					{props.columnfilter && (
						<tr className="filter">
							{props.displayIndex && <th></th>}
							{props.rowData.map((val, headIndex) => {
								let rand = Math.round(Math.random());
								return val.filter === "search" ? (
									<th>
										<div className="search-input">
											<input
												id={val.title + rand}
												type="text"
												placeholder=" "
												onChange={(e) => {
													const temp = {
														...searchValues,
														[headIndex]:
															e.target.value,
													};
													setsearchValues(temp);
													MasterSearch(null, temp);
												}}
											/>
											<label htmlFor={val.title + rand}>
												{val.placeholder ||
													val.title.replace(
														/_/g,
														" "
													)}{" "}
											</label>
										</div>
									</th>
								) : val.filter === "range" ? (
									<th>
										<div className="range">
											<div className="lablediv">
												<input
													id={val.title + rand + 1}
													type="number"
													placeholder=" "
													onChange={(e) => {
														let temp = rangeValues;
														if (temp[headIndex]) {
															temp[headIndex] = {
																...temp[
																	headIndex
																],
																start:
																	e.target
																		.value,
															};
														} else {
															temp[headIndex] = {
																start:
																	e.target
																		.value,
															};
														}
														setrangeValues(temp);
														// range();
														MasterSearch(
															null,
															null,
															temp
														);
													}}
												/>
												<label
													htmlFor={
														val.title + rand + 1
													}
												>
													{val.placeholder
														? val.placeholder[0] ||
														  "Min"
														: "Min"}
												</label>
											</div>
											<div className="lablediv">
												<input
													type="number"
													placeholder=" "
													id={val.title + rand}
													onChange={(e) => {
														let temp = rangeValues;
														if (temp[headIndex]) {
															temp[headIndex] = {
																...temp[
																	headIndex
																],
																end:
																	e.target
																		.value,
															};
														} else {
															temp[headIndex] = {
																end:
																	e.target
																		.value,
															};
														}
														setrangeValues(temp);
														// range();
														MasterSearch(
															null,
															null,
															temp
														);
													}}
												/>
												<label
													htmlFor={val.title + rand}
												>
													{val.placeholder
														? val.placeholder[1] ||
														  "Max"
														: "Max"}
												</label>
											</div>
										</div>
									</th>
								) : (
									<th></th>
								);
							})}
						</tr>
					)}
				</thead>
				<tbody>
					{column.length ? (
						column
							.slice(
								pagno * rowcount,
								pagno * rowcount + rowcount
							)
							.map((row, rowi) => {
								return (
									<tr key={rowi}>
										{props.displayIndex && (
											<td className="align-center">
												{rowi + pagno * rowcount + 1}
											</td>
										)}
										{row.map((col, i) => {
											const align =
												props.rowData[i].textAlign;
											let center =
												align === "center"
													? "align-center"
													: align === "right"
													? "align-right"
													: "";
											return props.rowData[i]
												.minifyValue ? (
												<td className={center} key={i}>
													{!isNaN(col)
														? minifyValue(col)
														: col}
												</td>
											) : (
												<td className={center} key={i}>
													{col}
												</td>
											);
										})}
									</tr>
								);
							})
					) : (
						<tr>
							<td
								colSpan={
									props.displayIndex
										? props.rowData.length + 1
										: props.rowData.length
								}
							>
								<div className="nodata">
									<FaRegSadTear />
									<p>No Data Found</p>
								</div>
							</td>
						</tr>
					)}
				</tbody>
			</table>
			<div className="footer">
				<div className="info">
					{`Displaying ${pagno * rowcount + 1} - ${
						parseInt(pagno * rowcount) + parseInt(rowcount) >
						column.length
							? column.length
							: parseInt(pagno * rowcount) + parseInt(rowcount)
					} of ${column.length}`}
				</div>
				<div className="right">
					<div className="dd-head-pagecount">
						<span className="show">Show</span>
						<select
							onChange={(e) => {
								setpage(0);
								updateSelect("pagdd", 0);
								setrowcount(
									e.nativeEvent.target[
										e.nativeEvent.target.selectedIndex
									].text
								);
							}}
							name="pagecount"
						>
							{pageCount.map((count, counti) => {
								return (
									<option value={count} key={counti}>
										{count}
									</option>
								);
							})}
						</select>
						<span className="entries">Entries</span>
					</div>
					<div className="pagniation">
						<FaAngleDoubleLeft
							onClick={() => {
								updateSelect("pagdd", 0);
								setpage(0);
							}}
						/>
						<FaAngleLeft
							onClick={() => {
								pagno && updateSelect("pagdd", pagno - 1);
								pagno && setpage((pagno) => pagno - 1);
							}}
						/>
						<span className="page">Page</span>
						<select
							id="pagdd"
							onChange={(e) =>
								setpage(
									e.nativeEvent.target[
										e.nativeEvent.target.selectedIndex
									].value
								)
							}
							name="pageno"
						>
							{column
								.slice(0, column.length / rowcount)
								.map((row, i) => {
									return (
										<option key={i} value={i}>
											{i + 1}
										</option>
									);
								})}
						</select>
						<FaAngleRight
							onClick={() => {
								if (pagno < column.length / rowcount - 1) {
									updateSelect("pagdd", pagno + 1);
									setpage((pagno) => pagno + 1);
								}
							}}
						/>
						<FaAngleDoubleRight
							onClick={() => {
								let temp = Math.round(
									column.length / rowcount - 1
								);
								updateSelect("pagdd", temp);
								setpage(temp);
							}}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
DataTable.propTypes = {
	rowData: PropTypes.array.isRequired,
	columnData: PropTypes.array.isRequired,
	pageCount: PropTypes.array,
	displayIndex: PropTypes.bool,
	overallSearch: PropTypes.bool,
};
