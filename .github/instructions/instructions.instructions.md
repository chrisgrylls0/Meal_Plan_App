---
applyTo: '**'
---

# Requirements
- The code must be written in Python.
- App must be hostable on a web server, ideally rasberry pi zero 2 compatible via a docker container.
- I should be able to access the app at a local IP address, so the GUI should be web browser based.
- The app should allow me to select meals from a list, and then drag and drop them into a table for the week.
- The table should have each day of the week as a row, and columns for breakfast, lunch, and dinner.
- for each meal, the ingredients are listed in a separate json file.
- Once the meals are selected in the table, the app should generate a shopping list based on the ingredients of the selected meals.
- the shopping list should be displayed in a separate section of the GUI.
- the shopping list should be exportable to a text file.
- the app should should display the date of next monday, and the current date at the top of the GUI.
- the app should be persistent, so that when others open the app, they see the same meals selected in the table.