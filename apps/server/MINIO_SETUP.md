# MinIO Setup for File Uploads

## Environment Variables

Add the following environment variables to your `.env` file:

```env
# MinIO Configuration
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_USE_SSL=false
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET_NAME=uploads
MINIO_PUBLIC_URL=http://localhost:9000

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
```

## Dependencies

Make sure to install the required dependencies:

```bash
pnpm add minio multer @types/multer uuid @types/uuid
```

## Docker Compose

The MinIO service is already configured in `docker-compose.dep.yaml`:

```yaml
minio:
  image: minio/minio:latest
  command: server /export --console-address ":9090"
  environment:
    - MINIO_ROOT_USER=minioadmin
    - MINIO_ROOT_PASSWORD=minioadmin
  ports:
    - '9000:9000'
    - '9090:9090'
  volumes:
    - uploads:/export
```

## Usage

1. Start the MinIO service: `docker compose -f docker-compose.dep.yaml up -d`
2. Access MinIO console at: http://localhost:9090
3. Login with: minioadmin / minioadmin
4. The uploads bucket will be created automatically when files are uploaded

## API Endpoints

- `POST /files/upload` - Upload a file to MinIO
  - Content-Type: multipart/form-data
  - Body: { file: File }
  - Response: { url: string, filename: string, size: number, type: string }
