from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Define the connection URL directly here
DATABASE_URL = "postgresql+psycopg2://startup_user:startupdb@localhost:5432/startup_db"

engine = create_engine(
    DATABASE_URL,
    echo=True  # Set to False in prod
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
