# Generación de PDF para Incapacidades

## Descripción
El servicio de incapacidades ahora genera automáticamente un PDF cuando se radica una nueva incapacidad mediante el endpoint POST `/create`.

## Funcionalidades Implementadas

### 1. Generación Automática de PDF
Cuando se crea una incapacidad exitosamente, el sistema:
- Genera un PDF con los datos completos de la incapacidad
- Guarda el archivo en el directorio `pdfs/` con un nombre único
- Retorna la información del PDF en la respuesta

### 2. Contenido del PDF
El PDF generado incluye:
- **Encabezado**: Título del certificado y fecha de generación
- **Información del Certificado**: ID, estado y tipo de incapacidad
- **Información del Empleado**: ID, nombre completo, email, rol, ID de nómina y compañía
- **Período de Incapacidad**: Fechas de inicio y fin, días totales
- **Observaciones**: Si existen
- **Datos JSON Completos**: Representación JSON de todos los datos

### 3. Respuesta del Endpoint

#### Endpoint: `POST /api/incapacities/create`

**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Incapacidad creada exitosamente y PDF generado",
  "data": {
    "id_incapacity": 1,
    "id_user": 123,
    "firstName": "Juan",
    "lastName": "Pérez",
    "email": "juan.perez@example.com",
    "role": "EMPLEADO",
    "id_payroll": 456,
    "id_company": 789,
    "start_date": "2025-01-01T00:00:00.000Z",
    "end_date": "2025-01-05T00:00:00.000Z",
    "type": "ENFERMEDAD_GENERAL",
    "status": "PENDIENTE",
    "observacion": "Gripe fuerte",
    "pdf": {
      "filename": "incapacidad_1_1732320000000.pdf",
      "path": "/pdfs/incapacidad_1_1732320000000.pdf",
      "size": 45678
    }
  }
}
```

### 4. Descarga de PDFs

#### Endpoint: `GET /api/incapacities/pdf/:filename`

**Headers requeridos:**
- `Authorization: Bearer <token>`

**Ejemplo:**
```bash
GET /api/incapacities/pdf/incapacidad_1_1732320000000.pdf
```

**Respuesta:**
- Content-Type: `application/pdf`
- Content-Disposition: `attachment; filename="incapacidad_1_1732320000000.pdf"`
- El archivo PDF como stream de bytes

## Estructura de Archivos

```
IncapacitiesService/
├── pdfs/                                    # Directorio donde se guardan los PDFs
│   └── incapacidad_*.pdf
├── src/
│   ├── shared/
│   │   └── utils/
│   │       └── pdf-generator.util.ts        # Utilidad para generar PDFs
│   └── infrastructure/
│       ├── controllers/
│       │   └── incapacity.controller.ts     # Controlador actualizado
│       └── routers/
│           └── incapacity.router.ts         # Router actualizado
```

## Dependencias Agregadas

```json
{
  "pdfkit": "^0.15.0",
  "@types/pdfkit": "^0.13.4"
}
```

## Uso

### 1. Crear una Incapacidad (genera PDF automáticamente)

```bash
POST /api/incapacities/create
Headers:
  Authorization: Bearer <token>
  Content-Type: application/json

Body:
{
  "id_user": 123,
  "id_payroll": 456,
  "start_date": "2025-01-01",
  "end_date": "2025-01-05",
  "type": "ENFERMEDAD_GENERAL",
  "observacion": "Gripe fuerte"
}
```

### 2. Descargar el PDF Generado

```bash
GET /api/incapacities/pdf/incapacidad_1_1732320000000.pdf
Headers:
  Authorization: Bearer <token>
```

## Notas Técnicas

- Los PDFs se generan en formato A4
- El nombre del archivo incluye el ID de la incapacidad y un timestamp para evitar colisiones
- Los PDFs se almacenan localmente en el servidor
- La descarga requiere autenticación
- El directorio `pdfs/` se crea automáticamente si no existe

## Mejoras Futuras Sugeridas

1. **Almacenamiento en la Nube**: Migrar a S3, Google Cloud Storage o Azure Blob
2. **Limpieza Automática**: Implementar un cron job para eliminar PDFs antiguos
3. **Personalización**: Permitir templates personalizables por compañía
4. **Firma Digital**: Agregar firma digital al PDF
5. **Envío por Email**: Enviar automáticamente el PDF por correo electrónico
6. **Marca de Agua**: Agregar marca de agua según el estado de la incapacidad
