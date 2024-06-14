from flask_sqlalchemy import SQLAlchemy
from flask import Flask, render_template, request, redirect, url_for, flash
from flask_wtf import FlaskForm
from flask_migrate import Migrate
from wtforms import TextAreaField, SubmitField
from wtforms.validators import DataRequired, Optional

import logging
from logging.handlers import RotatingFileHandler

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///flashcards.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'mysecretkey'
db = SQLAlchemy(app)
migrate = Migrate(app, db)

class Flashcard(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    question = db.Column(db.Text, nullable=False)
    answer = db.Column(db.Text, nullable=False)
    additional_content = db.Column(db.Text, nullable=True)

class FlashcardForm(FlaskForm):
    question = TextAreaField('Question', validators=[DataRequired()])
    answer = TextAreaField('Answer', validators=[DataRequired()])
    additional_content = TextAreaField('Additional Content', validators=[Optional()])
    submit = SubmitField('')


@app.route('/')
def index():
    flashcards = Flashcard.query.all()
    return render_template('index.html', flashcards=flashcards)

@app.route('/add', methods=['GET', 'POST'])
def add():
    form = FlashcardForm()
    form.submit.label.text = 'Add Card'
    if form.validate_on_submit():
        flashcard = Flashcard(
            question=form.question.data,
            answer=form.answer.data,
            additional_content=form.additional_content.data
        )
        db.session.add(flashcard)
        db.session.commit()
        return redirect(url_for('index') + f'#flashcard-{flashcard.id}')
    return render_template('add.html', form=form)

@app.route('/edit/<int:id>', methods=['GET', 'POST'])
def edit(id):
    flashcard = Flashcard.query.get_or_404(id)
    form = FlashcardForm(obj=flashcard)
    form.submit.label.text = 'Update'
    if form.validate_on_submit():
        flashcard.question = form.question.data
        flashcard.answer = form.answer.data
        flashcard.additional_content = form.additional_content.data
        db.session.commit()
        flash('Flashcard updated successfully')
        return redirect(url_for('index') + f'#flashcard-{flashcard.id}')
    return render_template('edit.html', form=form, flashcard=flashcard)

@app.route('/delete/<int:id>', methods=['POST'])
def delete(id):
    flashcard = Flashcard.query.get_or_404(id)
    db.session.delete(flashcard)
    db.session.commit()
    flash('Flashcard deleted successfully')
    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug=True)