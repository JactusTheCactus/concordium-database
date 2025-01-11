from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy

# Initialize the Flask app and configure the database URI
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///concordium.db'  # Path to your SQLite database
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False  # Disable modification tracking to save resources

# Initialize the SQLAlchemy object
db = SQLAlchemy(app)

# Define the Character model
class Character(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=True)
    aspect = db.Column(db.String(50), nullable=True)
    animal = db.Column(db.String(50), nullable=True)
    weapon = db.Column(db.String(50), nullable=True)
    color = db.Column(db.String(50), nullable=True)
    power = db.Column(db.String(100), nullable=True)
    species = db.Column(db.String(50), nullable=True)
    rank = db.Column(db.String(50), nullable=True)
    alignment = db.Column(db.String(10), nullable=True)  # "Sin" or "Virtue"
    inverse = db.Column(db.String(50), nullable=True)

def clear_database():
    """
    Clears all data from the Character table.
    """
    Character.query.delete()  # Deletes all rows from the Character table
    db.session.commit()  # Commit the changes to apply them
    print("All data cleared from the database!")

# Route to the home page, listing all characters
@app.route('/')
def home():
    # Query all characters from the database
    characters = Character.query.all()
    return render_template('home.html', characters=characters)

# Route to display individual character details
@app.route('/character/<int:id>')
def character_detail(id):
    character = Character.query.get_or_404(id)  # Fetch character by ID or return 404 if not found
    return render_template('character_detail.html', character=character)

# Create the database and tables if they don't exist
with app.app_context():
    db.create_all()

# Function to populate the database with initial character data
def populate_database():
    # Sample characters
    def create_character(name,
                         aspect,
                         animal,
                         weapon,
                         color,
                         power,
                         species,
                         rank,
                         alignment,
                         inverse):
        return Character(
            name=name.capitalize(),
            aspect=aspect.capitalize(),
            animal=animal.capitalize(),
            weapon=weapon.capitalize(),
            color=color.capitalize(),
            power=power.capitalize(),
            species=species.capitalize(),
            rank=rank.capitalize(),
            alignment=alignment.capitalize(),
            inverse=inverse.capitalize(),
        )

    characters = [
        create_character("ira","wrath","kraken","chainwhip","red","strength","demon","bellatorium","sin","patience")
    ]
    
    if len(Character.query.all()) == 0:
        db.session.bulk_save_objects(characters)
        db.session.commit()
        print("Database populated with sample characters!")
    else:
        print("Database already contains characters.")

if __name__ == '__main__':
    with app.app_context():
        clear_database()  # Drop and recreate all tables
        populate_database()  # Optional: repopulate the database
    app.run(debug=True)
