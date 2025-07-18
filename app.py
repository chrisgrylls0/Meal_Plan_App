from flask import Flask, render_template, request, jsonify, send_file
import json
import os
from datetime import datetime, timedelta

app = Flask(__name__)

DATA_DIR = 'data'
MEALS_FILE = os.path.join(DATA_DIR, 'meals.json')
PLAN_FILE = os.path.join(DATA_DIR, 'meal_plan.json')

# Helper functions
def get_next_monday():
    today = datetime.now()
    next_monday = today + timedelta(days=(7 - today.weekday()))
    return next_monday.strftime('%Y-%m-%d')

def get_today():
    return datetime.now().strftime('%Y-%m-%d')

def load_meals():
    with open(MEALS_FILE, 'r') as f:
        return json.load(f)

def load_plan():
    if not os.path.exists(PLAN_FILE):
        return {}
    with open(PLAN_FILE, 'r') as f:
        return json.load(f)

def save_plan(plan):
    with open(PLAN_FILE, 'w') as f:
        json.dump(plan, f)

@app.route('/')
def index():
    meals = load_meals()
    plan = load_plan()
    return render_template('index.html', meals=meals, plan=plan, today=get_today(), next_monday=get_next_monday())

@app.route('/save_plan', methods=['POST'])
def save_meal_plan():
    plan = request.json.get('plan', {})
    save_plan(plan)
    return jsonify({'status': 'success'})

@app.route('/shopping_list')
def shopping_list():
    plan = load_plan()
    meals = load_meals()
    ingredients = {}
    for day, meals_for_day in plan.items():
        for meal_type, meal_name in meals_for_day.items():
            meal = next((m for m in meals if m['name'] == meal_name), None)
            if meal:
                for ingredient in meal['ingredients']:
                    ingredients[ingredient] = ingredients.get(ingredient, 0) + 1
    return jsonify({'ingredients': ingredients})

@app.route('/export_list')
def export_list():
    plan = load_plan()
    meals = load_meals()
    ingredients = {}
    for day, meals_for_day in plan.items():
        for meal_type, meal_name in meals_for_day.items():
            meal = next((m for m in meals if m['name'] == meal_name), None)
            if meal:
                for ingredient in meal['ingredients']:
                    ingredients[ingredient] = ingredients.get(ingredient, 0) + 1
    file_path = os.path.join(DATA_DIR, 'shopping_list.txt')
    with open(file_path, 'w') as f:
        for ingredient, count in ingredients.items():
            f.write(f"{ingredient} x{count}\n")
    return send_file(file_path, as_attachment=True)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
