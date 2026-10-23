from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Migara Portfolio API"
    database_url: str = "postgresql+psycopg://portfolio:portfolio@localhost:5432/portfolio"
    secret_key: str = "local-development-secret-change-me"
    access_token_expire_minutes: int = 720
    cookie_samesite: str = "lax"
    cookie_secure: bool = False
    admin_email: str = "admin@example.com"
    admin_password: str = "change-me-now"
    cors_origins: str = "http://localhost:5173,http://localhost:4173"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()

