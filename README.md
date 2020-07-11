# VS React Data Table

VS React Datatable is a fast and flexible DataTable which provides lot of custom filtering options like **Overall Search Filter**, **Column Wide Search Filter** and **Column Wide Range Filter**. 

- [VS React Data Table](#vs-react-data-table)
	- [Installation](#installation)
	- [Simple Implementation](#simple-implementation)
	- [Advanced Implementation](#advanced-implementation)
	- [Usage](#usage)
		- [Props](#props)
		- [RowData Object Properties](#rowdata-object-properties)
				- [Note:](#note)
		- [ColumnData Array Properties](#columndata-array-properties)

## Installation
    npm i vs-react-datatable
		(or)
	yarn add vs-react-datatable

## Simple Implementation
	 import React from  'react';
	 import DataTable from  'vs-react-datatable'
	 
	 function  App()  {
		let  pageCount  = [10,  20,  50];
		let  rowData  = [
			{  title:  "name",  sortable:  true,  width:  10  },
			{  title:  "age",  width:  10  },
		];
		let  columnData  = [
			["John",  "30"],
			["Eric",  "43"],
		];
		return (
			<div>
				<DataTable
					rowData={rowData}
					columnData={columnData}
					pageCount={pageCount}
					overallSearch
				/>
			</div>
			);
	}
	export default App;
	
*Simple Implementation of VS React Data Table*
![Simple Implementation of VS React Data Table](https://drive.google.com/uc?export=view&id=1GzY1uz2UaHu8uWajWtmzrYpTOkLLZbI6)
## Advanced Implementation

    import React from  "react";
	import DataTable from  "vs-react-datatable";
	import datas from  "./data.json";
	function  App()  {
		let  pageCount  = [10,  20,  50];
		let  rowData  = [
			{  title:  "Name",  sortable:  true,  filter:  'search'  },
			{  title:  "Date",  sortable:  true,  filter:  'search'  },
			{  title:  "Company",  sortable:  true,  filter:  'search'  },
			{  title:  "Email",  sortable:  true,  filter:  'search'  },
			{  
				title:  "Values",  
				sortable:  true,  
				filter:  'search',  
				textAlign:  'center'  
			},
			{  
				title:  "Large_values", 
				sortable:  true,  
				filter:  'range',  
				placeholder: ['min',  'max'],  
				textAlign:  'center',  minifValue:  true  
			},
		];
		let  columnData  =  datas.data;
		return (
			<div>
				<DataTable
					rowData={rowData}
					columnData={columnData}
					pageCount={pageCount}
					displayIndex
				/>
			</div>
		);
	}
	export default App;

*Advanced Implementation of VS React Data Table*
![Advanced Implementation of VS React Data Table](https://drive.google.com/uc?export=view&id=1oyygti_Tev6t1ORcyB022RHO0yoN-WNu)
## Usage
### Props
| Prop Name | Type | isRequired | Note
|--|--|--|--
| rowData | ArrayOfObject | Required | Header Data Values
| columnData | ArrayOfArray | Required | List Of Column Values 
| pageCount | Array | Optional | List Of Values for Page Count
| displayIndex | Boolean | Optional | If true will Display SerialNumber
| overallSearch | Boolean | Optional | Enables Table wide search 
| columnfilter | Boolean | Optional | Enables column wide search

### RowData Object Properties
| Prop Name | Type | isRequired | Default
|--|--|--|--|--
| Title | String | Required | -
| minifyValue | Boolean | Optional | False
| sortable | Boolean | Optional | False
| width | Number | Optional | -
|filter | Pre Defined Values | Optional | null
| placeholder | String | Optional | null
| textAlign | Pre Defined Values | Optional | null


##### Note: 
- *minifyValues*: Minify Values Thousand(k) and Millions(M). 
- *textAlign*:  This is used to align text for each column. Pre defined values  `center | right`. 
- *filter*: This Properity is used to enable column level search.  Pre defined values 		          			`search | range` search -> enables Text Search in Picrular Column | range -> enabled Numeric range search between two values

### ColumnData Array Properties
*Format:*

    	[
			["value1", "value2", "value3", .....],
			["value1", "value2", "value3", .....],
			["value1", "value2", "value3", .....],
			.
			.
			.
		]
