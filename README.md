# Email Validator Service

Servicio Node.js para validar direcciones de email mediante verificación de registros MX y prueba SMTP RCPT TO.

## Características

- ✅ Verificación de registros MX
- ✅ Prueba SMTP RCPT TO con soporte STARTTLS
- ✅ API REST con autenticación por API Key
- ✅ Soporte para GET y POST
- ✅ Logging detallado para debugging
- ✅ Health check endpoint
- ✅ Dockerizado y listo para producción

## Endpoints

### GET /health
Verifica el estado del servicio (no requiere API key)

```bash
curl https://tu-dominio.com/health
```

### GET /validate?email=test@example.com
Valida un email via query parameter

```bash
curl -H "x-api-key: TU_API_KEY" \
     "https://tu-dominio.com/validate?email=test@example.com"
```

### POST /validate
Valida un email via JSON body

```bash
curl -X POST \
     -H "x-api-key: TU_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com"}' \
     https://tu-dominio.com/validate
```

## Variables de Entorno

| Variable | Requerida | Descripción | Ejemplo |
|----------|-----------|-------------|---------|
| `API_KEY` | ✅ | Clave de autenticación para la API | `Thiago2483!` |
| `PORT` | ❌ | Puerto donde escuchar (default: 3000) | `3000` |
| `SMTP_LOG` | ❌ | Activar logging SMTP detallado | `1` |

## Configuración en Easypanel

### 1. Variables de Entorno
En la configuración del servicio en Easypanel, agrega:

```
API_KEY=Thiago2483!
PORT=3000
```

### 2. Configuración del Servicio
- **Puerto del contenedor**: `3000`
- **Start Command**: **NO modificar** - dejar que use el CMD del Dockerfile
- **Health Check**: `/health`

### 3. Despliegue
1. Haz commit y push de los cambios
2. Easypanel detectará los cambios y redeployará automáticamente
3. Verifica los logs para confirmar que el servicio arrancó correctamente

## Configuración en n8n

### Nodo HTTP Request
```json
{
  "parameters": {
    "url": "https://tu-dominio.com/validate?email={{$json.email}}",
    "method": "GET",
    "sendHeaders": true,
    "headerParameters": {
      "parameters": [
        {
          "name": "x-api-key",
          "value": "Thiago2483!"
        }
      ]
    }
  }
}
```

### Configuración Recomendada
- **Método**: GET (más simple) o POST
- **URL**: `https://tu-dominio.com/validate?email={{$json.email}}`
- **Headers**: `x-api-key: Thiago2483!`
- **Retry**: Activar reintentos automáticos para respuestas 4xx

## Respuestas de la API

### Formato de Respuesta
```json
[
  {
    "ok": true,
    "email": "test@example.com",
    "deliverability": "DELIVERABLE",
    "reason": "smtp_250_rcpt"
  }
]
```

### Estados de Deliverability

| Estado | Descripción | Código SMTP |
|--------|-------------|-------------|
| `DELIVERABLE` | Email válido y entregable | 250 (OK) |
| `UNDELIVERABLE` | Email no existe o no aceptado | 550, 551, 553 |
| `RISKY` | Bloqueo temporal o greylisting | 4xx |
| `UNKNOWN` | No se pudo determinar | Varios |

## Troubleshooting

### Error 503 "Service is not started"
- ✅ Verificar que el contenedor esté corriendo
- ✅ Confirmar que escucha en `0.0.0.0:3000`
- ✅ Revisar logs del contenedor
- ✅ No modificar el Start Command en Easypanel

### Error 401 "Unauthorized"
- ✅ Verificar que el header `x-api-key` esté presente
- ✅ Confirmar que la API_KEY coincida en Easypanel y n8n

### Error 404 "Endpoint not found"
- ✅ Verificar que la ruta sea correcta
- ✅ Confirmar que el servicio esté desplegado con la versión más reciente

### Logs de Debug
Para activar logging SMTP detallado, agrega:
```
SMTP_LOG=1
```

## Desarrollo Local

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
export API_KEY=test_key
export PORT=3000

# Ejecutar
npm start
```

## Docker

```bash
# Construir imagen
docker build -t email-validator .

# Ejecutar contenedor
docker run -p 3000:3000 -e API_KEY=test_key email-validator
```

## Versión
1.0.8 - Mejorado con logging detallado y mejor manejo de errores
