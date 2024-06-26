"""Add additional_content to Flashcard model

Revision ID: 0d28089da034
Revises: 
Create Date: 2024-06-11 12:16:36.222564

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '0d28089da034'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('flashcard', sa.Column('additional_content', sa.Text(), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('flashcard', 'additional_content')
    # ### end Alembic commands ###
