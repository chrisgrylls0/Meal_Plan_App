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
                // Check if ingredient is removed
                let removed = JSON.parse(localStorage.getItem('removedIngredients') || '[]');
                if (removed.includes(ingredient)) return;
                let li = document.createElement('li');
                li.textContent = `${ingredient} x${count}`;
                let btn = document.createElement('button');
                btn.textContent = 'Remove';
                btn.style.marginLeft = '10px';
                btn.onclick = function() {
                    let removed = JSON.parse(localStorage.getItem('removedIngredients') || '[]');
                    removed.push(ingredient);
                    localStorage.setItem('removedIngredients', JSON.stringify(removed));
                    updateShoppingList();
                };
                li.appendChild(btn);
                list.appendChild(li);
            });
        });
    }
    updateShoppingList();
    // Export shopping list
    document.getElementById('export-list').addEventListener('click', function() {
        window.location.href = '/export_list';
    });

    // Copy shopping list to clipboard
    document.getElementById('copy-list').addEventListener('click', function() {
        let items = [];
        document.querySelectorAll('#shopping-list li').forEach(li => {
            // Only copy the text, not the button
            items.push(li.firstChild.textContent);
        });
        const text = items.join('\n');
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                alert('Shopping list copied to clipboard!');
            }, () => {
                alert('Failed to copy shopping list.');
            });
        } else {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            try {
                document.execCommand('copy');
                alert('Shopping list copied to clipboard!');
            } catch (err) {
                alert('Failed to copy shopping list.');
            }
            document.body.removeChild(textarea);
        }
    });

    // Clear table logic
    document.getElementById('clear-plan').addEventListener('click', function() {
        document.querySelectorAll('.selected-meal').forEach(span => {
            span.textContent = '';
        });
    });

    // Reset removed ingredients when saving plan or clearing table
    document.getElementById('save-plan').addEventListener('click', function() {
        localStorage.removeItem('removedIngredients');
    });
    document.getElementById('clear-plan').addEventListener('click', function() {
        localStorage.removeItem('removedIngredients');
        updateShoppingList();
    });
});
