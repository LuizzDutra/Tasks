from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache

class Settings(BaseSettings):
    name: str = 'empty'
    origins: list[str] = []
    db_url: str = ''
    SECRET_KEY: str = ''
    REFRESH_EXPIRE_DAYS: int = 0
    TOKEN_EXPIRE_SECONDS: int = 0
    model_config = SettingsConfigDict(env_file='./.env')

@lru_cache
def get_settings() -> Settings:
    return Settings()


