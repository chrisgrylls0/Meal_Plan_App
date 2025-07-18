document.addEventListener('DOMContentLoaded', function() {
    // Drag and drop logic
    let draggedMeal = null;
    document.querySelectorAll('.meal-item').forEach(item => {
        item.addEventListener('dragstart', function(e) {
            draggedMeal = this.getAttribute('data-name');
        });
    });
    document.querySelectorAll('.drop-cell').forEach(cell => {
        cell.addEventListener('dragover', function(e) {
            e.preventDefault();
        });
        cell.addEventListener('drop', function(e) {
            e.preventDefault();
            if (draggedMeal) {
                this.querySelector('.selected-meal').textContent = draggedMeal;
                draggedMeal = null;
            }
        });
    });
    // Save plan
    document.getElementById('save-plan').addEventListener('click', function() {
        let plan = {};
        document.querySelectorAll('tbody tr').forEach(row => {
            let day = row.getAttribute('data-day');
            plan[day] = {};
            row.querySelectorAll('.drop-cell').forEach(cell => {
                let mealType = cell.getAttribute('data-meal-type');
                let mealName = cell.querySelector('.selected-meal').textContent;
                plan[day][mealType] = mealName;
            });
        });
        fetch('/save_plan', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ plan })
        }).then(res => res.json()).then(data => {
            if (data.status === 'success') {
                updateShoppingList();
            }
        });
    });
    // Update shopping list
    function updateShoppingList() {
        fetch('/shopping_list').then(res => res.json()).then(data => {
            let list = document.getElementById('shopping-list');
            list.innerHTML = '';
            Object.entries(data.ingredients).forEach(([ingredient, count]) => {
                let li = document.createElement('li');
                li.textContent = `${ingredient} x${count}`;
                list.appendChild(li);
            });
        });
    }
    updateShoppingList();
    // Export shopping list
    document.getElementById('export-list').addEventListener('click', function() {
        window.location.href = '/export_list';
    });

    // Clear table logic
    document.getElementById('clear-plan').addEventListener('click', function() {
        document.querySelectorAll('.selected-meal').forEach(span => {
            span.textContent = '';
        });
    });
});
