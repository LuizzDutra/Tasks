from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    name: str = 'empty'
    origins: list[str] = []
    model_config = SettingsConfigDict(env_file='./server/.env')
