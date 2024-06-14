"""Updated question and answer fields to Text

Revision ID: 0c73e3bf4bb7
Revises: 0d28089da034
Create Date: 2024-06-14 14:22:40.570774

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '0c73e3bf4bb7'
down_revision = '0d28089da034'
branch_labels = None
depends_on = None


def upgrade():
    # Add the new columns
    op.add_column('flashcard', sa.Column('new_question', sa.Text(), nullable=True))
    op.add_column('flashcard', sa.Column('new_answer', sa.Text(), nullable=True))

    # Copy data from old columns to new columns
    conn = op.get_bind()
    conn.execute("UPDATE flashcard SET new_question = question, new_answer = answer")

    # Drop the old columns
    op.drop_column('flashcard', 'question')
    op.drop_column('flashcard', 'answer')

    # Rename the new columns to the original names
    op.alter_column('flashcard', 'new_question', new_column_name='question')
    op.alter_column('flashcard', 'new_answer', new_column_name='answer')

def downgrade():
    # Revert the changes in the downgrade function if necessary
    pass
