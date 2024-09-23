<script setup>
import { data } from '../data/configuration.data.ts'
</script>

# Self-Host Configuration

Configuring your self-hosted instance of Enclosed allows you to customize the application to better suit your environment and requirements. This guide covers the key environment variables you can set to control various aspects of the application, including port settings, security options, and storage configurations.

## Environment Variables

Enclosed is configured primarily through environment variables. Below is a list of the available variables, along with their descriptions and default values.

<div v-html="data" />

## Applying Configuration Changes

To apply your configuration changes, ensure that you have exported the environment variables in your shell or included them in your environment configuration file. Then, restart your Enclosed instance to apply the changes.

For Docker deployments, you can pass the environment variables directly when running the container:

```bash
docker run \
    -d --name enclosed \
    --restart unless-stopped \
    -p 8787:8787 \
    -v /path/to/local/data:/app/.data \
    -e SERVER_CORS_ORIGINS="https://example.com" \
    ghcr.io/corentin-th/enclosed
```

## Next Steps

Once your instance is configured, you can proceed to explore advanced deployment options or set up monitoring to ensure your Enclosed instance runs smoothly. For a more complex setup, consider using [Docker Compose](./docker-compose) or deploying on a cloud provider.
