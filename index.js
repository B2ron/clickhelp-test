var data = [
	{ id: 1, name: "Name 1", value: -1 },
	{ id: 2, name: "Name 21", value: 0 },
	{ id: 3, name: "Name 3", value: 1 },
	{ id: 4, name: "Name 2", value: 20 },
	{ id: 5, name: "Name 10", value: 10 }
];

class SortableTable {

	constructor(data) {
		
		const result = document.getElementById('result');
		if( ! result ) throw new Error('Result element not found');
		
		this.result 			= result;

		this.originData 		= data;
		this.filteredData 		= data;
		this.pageSize 			= 3;
		this.currentPage 		= 1;
		this.pagesCount 		= this.getPagesCount();

		this.searchField;
		this.pagination;
		
		this.sortColumn 		= 'name';
		this.isSortDirectionAsc = true;

		this.init();

	}

	init() {

		this.renderTable(this.originData);
		this.sortData();

		this.addSearchField();
		this.searchField = document.getElementById('search-field');
		this.handleSearchField();

		this.addPagination();

	}

	filterData(searchWord = '') {
		const filteredData = ( searchWord.length == 0 ) ? this.originData : this.originData.filter( row => {
			return (
				(row.id + '').toLowerCase().includes(searchWord.toLowerCase()) || 
				(row.name + '').toLowerCase().includes(searchWord.toLowerCase()) || 
				(row.value + '').toLowerCase().includes(searchWord.toLowerCase())
			);
		});
		this.filteredData = filteredData;
		this.renderTable(this.filteredData);
	}

	sortData() {
		if( this.sortColumn == 'name' ) {
			this.filteredData.sort().reverse();
		} else {
			this.filteredData.sort( (a, b) => {
				return ( this.isSortDirectionAsc ) ? a[this.sortColumn] - b[this.sortColumn] : b[this.sortColumn] - a[this.sortColumn];
			});
		}
		this.renderTable(this.filteredData);
	}

	toggleSortDirection() {		
		this.isSortDirectionAsc = !this.isSortDirectionAsc;
	}

	renderTable(data) {

		let tableHtml = '';

		if(data.length == 0) {

			tableHtml += '<p class="nothing-found">No data found</p>';

		} else {

			tableHtml += '<table>';
			data.filter((row, index) => {
				const start = (this.currentPage - 1) * this.pageSize;
				const end 	= this.currentPage * this.pageSize;
				if(	index >= start && index < end ) return true;
			}).forEach( (row, index) => {

				// Table header
				if( index == 0 ) {
					tableHtml += '<tr>';
					for(let key in row)
						tableHtml += `<th>${key}</th>`;
					tableHtml += '</tr>';
				}

				// Table body
				tableHtml += '<tr>';
				for(let key in row)
					tableHtml += `<td>${row[key]}</td>`;
				tableHtml += '</tr>';

			});
		}

		this.result.innerHTML = tableHtml;
		this.handleTableHead();

	}

	handleTableHead() {
		this.result.querySelectorAll('th').forEach( column => {			
			column.addEventListener( 'click', event => {		
				const column = event.target.textContent;
				this.sortColumn = column;
				this.toggleSortDirection();
				this.sortData();
			});
		});
	}

	addSearchField() {
		const input = "<section id='search'><input type='text' id='search-field' placeholder='Search'></section>";
		this.result.insertAdjacentHTML('beforebegin', input );
	}

	handleSearchField() {
		this.searchField.addEventListener( 'keyup', event => {		
			this.filterData(this.searchField.value);
		});
	}

	getPagesCount() {
		return Math.ceil(this.filteredData.length / this.pageSize);
	}

	addPagination() {
		let pagination = '<section id="pagination">';
		for(let i = 1; i <= this.getPagesCount(); i++) {
			pagination += `<button>${i}</button>`;
		}
		pagination += '</section>';
		this.result.insertAdjacentHTML('afterend', pagination );
		
		this.pagination = document.getElementById('pagination');
		this.handlePagination();
	}

	removePagination() {
		this.pagination.remove();
	}

	handlePagination() {
		this.pagination.querySelectorAll('button').forEach( btn => {
			btn.addEventListener( 'click', event => {		
				this.goPage(btn.textContent);
			});
		});
	}

	goPage(newPage) {
		this.currentPage = newPage;
		this.renderTable(this.filteredData);
	}
	
}

new SortableTable(data);