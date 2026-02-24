FROM node:20-alpine AS react-build
WORKDIR /app/public

COPY public/package*.json ./

RUN npm ci

COPY public/ .
RUN npm run build


FROM python:3.12-slim
WORKDIR /
# Install uv.
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

COPY server /app/server
COPY --from=react-build /app/public/dist /app/public/dist

# Install the application dependencies.
WORKDIR /app/server
RUN uv sync --frozen --no-cache

EXPOSE 80

#Run the application.
CMD ["uv", "run", "uvicorn", "app:app", "--host", "0.0.0.0", "--port", "80"]

