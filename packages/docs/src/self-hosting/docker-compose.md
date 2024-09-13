# Docker Compose Installation

Using Docker Compose allows you to define and manage multi-container Docker applications. For Enclosed, Docker Compose simplifies the process of setting up and maintaining the application, especially when you want to include additional services or need persistent storage.

## Prerequisites

Ensure that you have Docker and Docker Compose installed on your system. You can install Docker Compose by following the instructions on the [official Docker Compose website](https://docs.docker.com/compose/install/).

## Docker Compose Configuration

Below is a sample `docker-compose.yml` file that you can use to deploy Enclosed. This configuration includes options for persistent storage and automatic restart.

```yaml
services:
  enclosed:
    image: corentinth/enclosed
    container_name: enclosed
    ports:
      - "8787:8787"
    volumes:
      - enclosed-data:/app/.data
    restart: unless-stopped

volumes:
  enclosed-data:
    driver: local
```

### Explanation of the Configuration

- **version**: Specifies the version of Docker Compose file format.
- **services**: Defines the services that will be run. In this case, only the `enclosed` service is defined.
- **image**: Specifies the Docker image to use for the `enclosed` service.
- **container_name**: Names the container "enclosed" for easy identification.
- **ports**: Maps port 8787 on your host to port 8787 in the container, making the application accessible on your local machine.
- **volumes**:
  - `enclosed-data:/app/.data`: Maps a local volume to the container's data directory for persistent storage.
- **environment**: Defines environment variables to configure the Enclosed instance. You can adjust these values according to your needs.
- **restart**: Configures the container to always restart unless it is explicitly stopped.

### Persistent Storage

The `volumes` section in the `docker-compose.yml` file maps a named volume (`enclosed-data`) to the container’s data directory. This ensures that your data is not lost when the container is stopped or removed.

### Customizing the Environment

You can modify the environment variables under the `environment` section to customize your instance. For example, you can change the `PORT`, set different CORS origins, or adjust the note size limit.

## Running Enclosed with Docker Compose

Once you have your `docker-compose.yml` file configured, you can start the Enclosed service with the following commands:

### Download the Docker Compose File

You can download the `docker-compose.yml` file directly from the repository:

```bash
curl -O https://raw.githubusercontent.com/CorentinTh/enclosed/main/docker-compose.yml
```

### Start the Service

To start Enclosed using Docker Compose, run:

```bash
docker-compose up -d
```

- `-d`: Runs the containers in detached mode (in the background).

This command will pull the Enclosed image if it is not already available locally, create the container, and start the application.

### Managing the Service

#### View Logs

To view the logs for the Enclosed service, run:

```bash
docker-compose logs -f enclosed
```

#### Stop the Service

To stop the Enclosed service, use:

```bash
docker-compose down
```

This will stop and remove the container, but your data will be preserved in the volume.

#### Restart the Service

If you make changes to the `docker-compose.yml` file or environment variables, you can restart the service with:

```bash
docker-compose down
docker-compose up -d
```

## Updating Enclosed

To update your Enclosed instance to the latest version, pull the latest image and restart the service:

```bash
docker-compose pull enclosed
docker-compose up -d
```

## Advanced Configuration

If you want to include additional services (like a reverse proxy or database) or manage more complex deployments, you can expand the `docker-compose.yml` file accordingly. Docker Compose allows for flexibility in defining multi-container applications, making it a powerful tool for managing your Enclosed instance.

## Next Steps

Once your Enclosed instance is up and running with Docker Compose, you can explore further customization options, integrate with other services, or set up monitoring and backups to ensure the smooth operation of your deployment.
