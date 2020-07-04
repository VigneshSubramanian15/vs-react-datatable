import React, { useState, useEffect } from "react";
import {
	FaAngleDoubleLeft,
	FaAngleDoubleRight,
	FaAngleRight,
	// FaAngleDown,
	// FaAngleUp,
	FaArrowUp,
	FaArrowDown,
	FaRegSadTear,
	FaAngleLeft,
	FaAngleUp,
} from "react-icons/fa";
import PropTypes from "prop-types";
import "./style.css";
export default function DataTable(props) {
	const completeData = props.row;
	const [column, setcolumn] = useState(completeData);
	const [pagno, setpage] = useState(0);
	const [rowcount, setrowcount] = useState(10);
	const [filtertemp, setfiltertemp] = useState("");
	const [rangeValues, setrangeValues] = useState([]);
	const [headSorted, setHeadsorted] = useState("");
	const [searchValues, setsearchValues] = useState({});
	useEffect(() => {
		search();
		// eslint-disable-next-line
	}, [searchValues]);
	const sort = (val) => {
		setHeadsorted(val);
		setpage(0);
		updateSelect("pagdd", 0);
		let temp = column;
		let sorted = [];
		let headtitle = [];
		props.head.map((val) => headtitle.push(val.title));
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
	const range = (fromsearch) => {
		let data = fromsearch || completeData;
		let filtered = [];
		rangeValues.map((val, index) => {
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
				setcolumn(filtered);
				!fromsearch && search(filtered);
			}
			return null;
		});
	};
	const search = (fromfiltered) => {
		let filtered = [];
		let data = (fromfiltered && fromfiltered.length) || completeData;
		Object.keys(searchValues).map((key) => {
			filtered.length && (data = filtered);
			filtered = [];
			data &&
				data.map((row) => {
					isNaN(row[key]) &&
						row[key]
							.toLowerCase()
							.search(searchValues[key].toLowerCase()) !== -1 &&
						filtered.push(row);
					return null;
				});
			setcolumn(filtered);
			!fromfiltered && range(filtered);
			return null;
		});
	};
	const searchAll = (inp) => {
		let filtered = [];
		let data = completeData;
		data.map((row) => {
			row.some((col) => {
				if (isNaN(col)) {
					if (col.toLowerCase().search(inp.toLowerCase()) !== -1) {
						filtered.push(row);
						return true;
					}
				} else {
					if (col.toString().search(inp) !== -1) {
						filtered.push(row);
						return true;
					}
				}
				return null;
			});
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
					{props.OverallSearch && (
						<div className="master-search">
							<input
								placeholder=" "
								onChange={(e) => {
									searchAll(e.target.value);
								}}
								// value={completesearch}
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
						{props.DisplayIndex && <th>S.No</th>}
						{props.head.map((val, i) => {
							let active =
								val.title === headSorted ? "active" : "";
							return (
								<th
									className={"point"}
									onClick={() => sort(val.title)}
									key={i}
								>
									{val.title.replace(/_/g, " ")}
									<span className={active}>
										<FaArrowDown /> <FaArrowUp />
										{/* <FaAngleUp /> <FaAngleDown /> */}
									</span>
								</th>
							);
						})}
					</tr>
					{!props.OverallSearch && (
						<tr className="filter">
							<th></th>
							{props.head.map((val, headIndex) => {
								let rand = Math.round(Math.random());
								return val.filter === "search" ? (
									<th width={val.width}>
										<div className="search-input">
											<input
												id={val.title + rand}
												type="text"
												placeholder=" "
												onChange={(e) => {
													const temp = e.target.value;
													setsearchValues(
														(searchValues) => ({
															...searchValues,
															[headIndex]: temp,
														})
													);
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
									<th width={val.width}>
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
														range();
													}}
												/>
												<label
													htmlFor={
														val.title + rand + 1
													}
												>
													{val.placeholder[0] ||
														"Min"}
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
														range();
													}}
												/>
												<label
													htmlFor={val.title + rand}
												>
													{val.placeholder[1] ||
														"Max"}
												</label>
											</div>
										</div>
									</th>
								) : (
									<th width={val.width}></th>
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
										{props.DisplayIndex && (
											<td className="align-center">
												{rowi + pagno * rowcount + 1}
											</td>
										)}
										{row.map((col, i) => {
											const align =
												props.head[i].textAlign;
											let center =
												align === "center"
													? "align-center"
													: align === "right"
													? "align-right"
													: "";
											return props.head[i].minifyValue ? (
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
									props.DisplayIndex
										? props.head.length + 1
										: props.head.length
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
							{props.pageCount.map((count, counti) => {
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
	head: PropTypes.array.isRequired,
	DisplayIndex: PropTypes.bool,
	pageCount: PropTypes.array.isRequired,
	OverallSearch: PropTypes.bool,
	row: PropTypes.array.isRequired,
};
