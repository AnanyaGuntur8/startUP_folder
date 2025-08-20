from sqlalchemy import create_engine
from app.db.session import Base
from app.models import User, Startup, Customer  # now works because of models/__init__.py

DATABASE_URL = "postgresql+psycopg2://startup_user:startupdb@localhost:5432/startup_db"
engine = create_engine(DATABASE_URL)

# Create tables
Base.metadata.create_all(engine)
print("Tables created successfully!")
