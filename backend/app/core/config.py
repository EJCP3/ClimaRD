from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Clima RD API"
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/climard"
    INDOMET_SCRAPE_INTERVAL_MINUTES: int = 30
    S3_ENDPOINT: str = "http://localhost:9000"
    S3_BUCKET: str = "climard-evidencias"
    S3_ACCESS_KEY: str = "minioadmin"
    S3_SECRET_KEY: str = "minioadmin"

    class Config:
        env_file = ".env"

settings = Settings()
