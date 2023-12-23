document.addEventListener('DOMContentLoaded', function() {
    const uploadForm = document.getElementById('uploadForm');
    const availableFields = document.getElementById('availableFields');
    const displayedFields = document.getElementById('displayedFields');
    const addFieldBtn = document.getElementById('addField');
    const removeFieldBtn = document.getElementById('removeField');
    const productsTable = document.getElementById('productsTable');

    uploadForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const formData = new FormData(uploadForm);
        fetch('/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            renderTable(data);
        })
        .catch(error => console.error('Error uploading file:', error));
    });

    addFieldBtn.addEventListener('click', function() {
        moveOptions(availableFields, displayedFields);
    });

    removeFieldBtn.addEventListener('click', function() {
        moveOptions(displayedFields, availableFields);
    });

    function moveOptions(fromSelect, toSelect) {
        Array.from(fromSelect.selectedOptions).forEach(option => {
            toSelect.appendChild(option);
        });
    }

    function renderTable(data) {

        productsTable.innerHTML = '';

        const table = document.createElement('table');
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');
        table.appendChild(thead);
        table.appendChild(tbody);

        const headerRow = document.createElement('tr');
        Array.from(displayedFields.options).forEach(option => {
            const headerCell = document.createElement('th');
            headerCell.textContent = option.text;
            headerRow.appendChild(headerCell);
        });
        thead.appendChild(headerRow);

        data.forEach(product => {
            const row = document.createElement('tr');
            Array.from(displayedFields.options).forEach(option => {
                const cell = document.createElement('td');
                cell.textContent = product[option.value];
                row.appendChild(cell);
            });
            tbody.appendChild(row);
        });

        productsTable.appendChild(table);
    }
});
