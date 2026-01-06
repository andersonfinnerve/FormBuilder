# 📄 Documento Funcional - Sistema de Formularios

## 1. INFORMACIÓN DEL PROYECTO

| Campo | Valor |
|-------|-------|
| **Proyecto** | Finnerve - Constructor de Formularios |
| **Módulo** | Formularios Dinámicos |
| **Versión** | 1.0.0 |
| **Fecha** | 04 de Enero, 2026 |
| **Autor** | Equipo Finnerve |
| **Stakeholders** | Administradores del Sistema, Usuarios de BackOffice |

---

## 2. RESUMEN EJECUTIVO

### 2.1 Propósito

El **Sistema de Formularios** permite a los administradores del sistema crear, configurar y gestionar formularios dinámicos sin necesidad de desarrollo técnico. Los formularios configurados se utilizan para recopilar información de clientes, prospectos o usuarios en procesos de onboarding, registro, solicitudes y otros flujos del negocio.

### 2.2 Alcance

**En Alcance:**
- ✅ Creación visual de formularios mediante drag & drop
- ✅ Integración con Datos Maestros del BackOffice
- ✅ Configuración de validaciones y lógica condicional
- ✅ Export/Import de formularios
- ✅ Vista previa en tiempo real
- ✅ Versionamiento y control de cambios

**Fuera de Alcance:**
- ❌ Renderizado final del formulario (responsabilidad de Web Pública)
- ❌ Almacenamiento de respuestas de usuarios
- ❌ Reportería y análisis de datos recopilados
- ❌ Integraciones con sistemas externos

### 2.3 Usuarios Objetivo

| Rol | Descripción | Nivel Técnico |
|-----|-------------|---------------|
| **Administrador de Sistemas** | Configura formularios para diferentes procesos del negocio | Bajo - No requiere programación |
| **Analista de Negocio** | Diseña flujos de captura de información | Bajo - Conocimiento del proceso |
| **Gerente de Producto** | Supervisa y aprueba formularios | Bajo - Visión de negocio |

---

## 3. OBJETIVOS DEL NEGOCIO

### 3.1 Objetivos Primarios

1. **Reducir Tiempos de Desarrollo**
   - Antes: 2-4 semanas para crear un formulario nuevo con desarrollo
   - Después: 1-2 horas con el constructor visual
   - **Impacto**: Reducción del 90% en tiempo de implementación

2. **Estandarizar Captura de Datos**
   - Utilizar Datos Maestros para garantizar consistencia
   - Evitar duplicación de campos entre formularios
   - **Impacto**: 100% de campos críticos estandarizados

3. **Mejorar Experiencia de Usuario**
   - Lógica condicional para mostrar solo campos relevantes
   - Validaciones en tiempo real
   - **Impacto**: Reducción del 40% en errores de captura

### 3.2 Métricas de Éxito

| Métrica | Objetivo | Medición |
|---------|----------|----------|
| Tiempo de creación de formulario | < 2 horas | Por formulario creado |
| Reutilización de Datos Maestros | > 70% | % campos del maestro vs totales |
| Tasa de error en captura | < 5% | Errores / total envíos |
| Adopción por usuarios admin | > 90% | % admins usando la herramienta |

---

## 4. DESCRIPCIÓN FUNCIONAL

### 4.1 Funcionalidad Principal

El sistema permite a un usuario **construir visualmente** un formulario arrastrando componentes desde una caja de herramientas hacia un canvas de trabajo, configurando las propiedades de cada campo, y exportando el resultado como un archivo de configuración que puede ser utilizado por otras aplicaciones.

### 4.2 Flujo General

```
[Inicio] → [Seleccionar Campos] → [Configurar Propiedades] 
    → [Aplicar Lógica] → [Vista Previa] → [Exportar/Guardar]
```

---

## 5. CASOS DE USO

### 5.1 CU-001: Crear Formulario de Onboarding de Cliente

**Actor Principal**: Administrador de Sistemas

**Precondiciones**:
- Usuario autenticado con permisos de administrador
- Datos Maestros disponibles en el sistema

**Flujo Normal**:

1. Usuario accede al Constructor de Formularios
2. Sistema muestra interfaz con canvas vacío y caja de herramientas
3. Usuario arrastra campo "Nombre Completo" desde Datos Maestros
4. Sistema agrega el campo al canvas con configuración bloqueada
5. Usuario arrastra campo "Texto Corto" desde herramientas básicas
6. Usuario renombra el campo a "Comentarios Adicionales"
7. Usuario configura el campo como opcional
8. Usuario arrastra campo "Radio" con opciones "Sí/No"
9. Usuario renombra a "¿Tiene beneficiarios finales?"
10. Usuario arrastra una "Sección" al canvas
11. Usuario configura lógica condicional:
    - Mostrar sección cuando "¿Tiene beneficiarios?" = "Sí"
12. Usuario arrastra Grid "Beneficiarios Finales" del maestro dentro de la sección
13. Usuario presiona "Vista Previa"
14. Sistema muestra formulario renderizado
15. Usuario interactúa con el formulario de prueba
16. Usuario confirma y presiona "Exportar"
17. Sistema genera archivo JSON
18. Usuario guarda el formulario

**Postcondiciones**:
- Formulario guardado en el sistema
- JSON disponible para uso en Web Pública
- Campos nuevos marcados para sincronización con Datos Maestros

**Flujos Alternativos**:

**FA-001: Usuario cancela la creación**
- En cualquier paso, usuario presiona "Cancelar"
- Sistema pregunta si desea guardar borrador
- Usuario confirma o descarta cambios

**FA-002: Validación falla**
- Sistema detecta configuración inválida (ej: campo sin etiqueta)
- Sistema muestra mensaje de error específico
- Usuario corrige el problema
- Continúa flujo normal

**Reglas de Negocio**:
- RN-001: Todo formulario debe tener al menos un campo
- RN-002: Campos del Datos Maestros no pueden editarse
- RN-003: Lógica condicional solo puede referenciar campos anteriores

---

### 5.2 CU-002: Editar Formulario Existente

**Actor Principal**: Administrador de Sistemas

**Precondiciones**:
- Formulario previamente guardado existe
- Usuario tiene permisos de edición

**Flujo Normal**:

1. Usuario accede a lista de formularios
2. Sistema muestra formularios existentes
3. Usuario selecciona formulario a editar
4. Sistema carga configuración en el builder
5. Usuario modifica campos según necesidad
6. Usuario guarda cambios
7. Sistema actualiza versión del formulario

**Postcondiciones**:
- Nueva versión del formulario guardada
- Versión anterior mantenida para histórico

**Reglas de Negocio**:
- RN-004: No se pueden eliminar formularios publicados
- RN-005: Ediciones crean nueva versión automáticamente
- RN-006: Cambios en Datos Maestros se reflejan automáticamente

---

### 5.3 CU-003: Aplicar Lógica Condicional

**Actor Principal**: Analista de Negocio

**Precondiciones**:
- Formulario con al menos 2 campos creado
- Campo trigger debe ser tipo select, radio o checkbox

**Flujo Normal**:

1. Usuario selecciona campo a ocultar condicionalmente
2. Usuario abre panel "Lógica Condicional"
3. Usuario activa switch "Visibilidad"
4. Sistema muestra opciones de configuración
5. Usuario selecciona campo trigger del dropdown
6. Sistema muestra opciones disponibles del campo trigger
7. Usuario selecciona valor de activación
8. Usuario guarda configuración
9. Sistema aplica lógica al campo
10. Usuario prueba en Vista Previa

**Postcondiciones**:
- Campo tiene lógica condicional configurada
- Campo se muestra/oculta según condición en vista previa

**Flujos Alternativos**:

**FA-003: Campo trigger no tiene opciones**
- Sistema muestra campo de texto libre para valor
- Usuario escribe valor exacto esperado

**Reglas de Negocio**:
- RN-007: Un campo solo puede tener una regla de lógica
- RN-008: Trigger debe aparecer antes del campo controlado
- RN-009: No se permiten dependencias circulares

---

### 5.4 CU-004: Utilizar Grid para Datos Tabulares

**Actor Principal**: Administrador de Sistemas

**Precondiciones**:
- Usuario en el constructor de formularios

**Flujo Normal**:

1. Usuario arrastra campo "Grid" desde herramientas avanzadas
2. Sistema crea grid con 2 columnas por defecto
3. Usuario presiona "+ Columna"
4. Sistema agrega nueva columna vacía
5. Usuario configura cada columna:
   - Nombre de columna
   - Tipo de dato (texto/select/archivo)
   - Si es requerida
6. Para columnas tipo select, usuario configura opciones
7. Usuario guarda configuración
8. Sistema valida coherencia del grid

**Postcondiciones**:
- Grid configurado listo para uso
- Columnas con validaciones aplicadas

**Flujos Alternativos**:

**FA-004: Utilizar Grid del Maestro**
- En paso 1, usuario arrastra Grid desde Datos Maestros
- Sistema crea grid con columnas pre-configuradas
- Columnas no son editables
- Continúa flujo normal desde paso 7

**Reglas de Negocio**:
- RN-010: Grid debe tener al menos 1 columna
- RN-011: Máximo 10 columnas por grid
- RN-012: Columnas de Grid del maestro son read-only

---

### 5.5 CU-005: Exportar e Importar Formulario

**Actor Principal**: Administrador de Sistemas

**Precondiciones**:
- Formulario completo configurado

**Flujo Normal (Export)**:

1. Usuario presiona botón "Exportar"
2. Sistema genera JSON del formulario
3. Sistema descarga archivo `formulario_[nombre]_[fecha].json`
4. Usuario guarda archivo localmente

**Flujo Normal (Import)**:

1. Usuario presiona botón "Importar"
2. Sistema muestra selector de archivos
3. Usuario selecciona archivo JSON
4. Sistema valida estructura del archivo
5. Sistema carga formulario en el builder
6. Usuario puede editar según necesidad

**Postcondiciones**:
- Formulario exportado/importado correctamente
- Integridad de datos validada

**Flujos Alternativos**:

**FA-005: Archivo JSON inválido**
- Sistema detecta estructura incorrecta
- Sistema muestra error detallado
- Usuario corrige archivo o selecciona otro

**Reglas de Negocio**:
- RN-013: Solo archivos JSON válidos son aceptados
- RN-014: Importar sobrescribe formulario actual (con confirmación)

---

## 6. REQUISITOS FUNCIONALES

### 6.1 Gestión de Campos

| ID | Requisito | Prioridad | Estado |
|----|-----------|-----------|--------|
| RF-001 | El sistema debe permitir agregar campos mediante drag & drop | Alta | ✅ Implementado |
| RF-002 | El sistema debe permitir reordenar campos arrastrándolos | Alta | ✅ Implementado |
| RF-003 | El sistema debe permitir eliminar campos con confirmación | Alta | ✅ Implementado |
| RF-004 | El sistema debe permitir duplicar campos | Media | ✅ Implementado |
| RF-005 | El sistema debe permitir redimensionar campos (full/half width) | Media | ✅ Implementado |
| RF-006 | El sistema debe soportar anidación de campos en secciones | Alta | ✅ Implementado |

### 6.2 Datos Maestros

| ID | Requisito | Prioridad | Estado |
|----|-----------|-----------|--------|
| RF-007 | El sistema debe cargar campos desde Datos Maestros del BackOffice | Alta | ✅ Implementado |
| RF-008 | El sistema debe bloquear edición de campos del maestro | Alta | ✅ Implementado |
| RF-009 | El sistema debe mostrar indicador visual de campos del maestro | Media | ✅ Implementado |
| RF-010 | El sistema debe marcar campos nuevos como pendientes de sincronización | Alta | ✅ Implementado |
| RF-011 | El sistema debe soportar grids completos del maestro | Media | ✅ Implementado |

### 6.3 Configuración de Propiedades

| ID | Requisito | Prioridad | Estado |
|----|-----------|-----------|--------|
| RF-012 | El sistema debe permitir configurar etiqueta del campo | Alta | ✅ Implementado |
| RF-013 | El sistema debe permitir configurar placeholder | Media | ✅ Implementado |
| RF-014 | El sistema debe permitir agregar descripción con formato Markdown | Media | ✅ Implementado |
| RF-015 | El sistema debe permitir marcar campos como requeridos | Alta | ✅ Implementado |
| RF-016 | El sistema debe permitir marcar campos como solo lectura | Baja | ✅ Implementado |
| RF-017 | El sistema debe permitir mapear campo a columna física de BD | Media | ✅ Implementado |

### 6.4 Lógica Condicional

| ID | Requisito | Prioridad | Estado |
|----|-----------|-----------|--------|
| RF-018 | El sistema debe permitir configurar visibilidad condicional | Alta | ✅ Implementado |
| RF-019 | El sistema debe mantener referencia dual (ID local + ID maestro) | Alta | ✅ Implementado |
| RF-020 | El sistema debe validar que trigger sea anterior al campo | Media | ⚠️ Pendiente |
| RF-021 | El sistema debe prevenir dependencias circulares | Alta | ⚠️ Pendiente |
| RF-022 | El sistema debe evaluar lógica en vista previa | Alta | ✅ Implementado |

### 6.5 Validaciones

| ID | Requisito | Prioridad | Estado |
|----|-----------|-----------|--------|
| RF-023 | El sistema debe permitir configurar validación de longitud | Media | ✅ Implementado |
| RF-024 | El sistema debe permitir configurar validación por regex | Media | ✅ Implementado |
| RF-025 | El sistema debe permitir configurar rangos numéricos | Baja | ✅ Implementado |
| RF-026 | El sistema debe validar formato de email | Alta | ⚠️ Validación básica |

### 6.6 Export/Import

| ID | Requisito | Prioridad | Estado |
|----|-----------|-----------|--------|
| RF-027 | El sistema debe exportar formulario como JSON | Alta | ✅ Implementado |
| RF-028 | El sistema debe importar formulario desde JSON | Alta | ✅ Implementado |
| RF-029 | El sistema debe validar estructura del JSON importado | Alta | ⚠️ Validación básica |
| RF-030 | El sistema debe incluir metadata en el export | Media | ✅ Implementado |

### 6.7 Historial y Versionamiento

| ID | Requisito | Prioridad | Estado |
|----|-----------|-----------|--------|
| RF-031 | El sistema debe mantener historial de cambios (Undo/Redo) | Alta | ✅ Implementado |
| RF-032 | El sistema debe permitir deshacer hasta 50 cambios | Media | ✅ Implementado |
| RF-033 | El sistema debe crear versión al guardar | Media | ⚠️ Pendiente |
| RF-034 | El sistema debe permitir restaurar versiones anteriores | Baja | ⚠️ Pendiente |

---

## 7. REGLAS DE NEGOCIO

### 7.1 Campos del Maestro

**RN-001**: Campos que provienen de Datos Maestros tienen `formDataId` tipo `string`  
**RN-002**: Campos nuevos tienen `formDataId` como `null` para ser sincronizados  
**RN-003**: La etiqueta de campos del maestro NO puede modificarse  
**RN-004**: Las opciones de campos del maestro NO pueden modificarse  
**RN-005**: Campos del maestro pueden configurarse como requeridos/opcionales  

### 7.2 Lógica Condicional

**RN-006**: Solo campos de tipo `select`, `radio` o `checkbox` pueden ser triggers  
**RN-007**: Un campo solo puede tener una regla de lógica condicional  
**RN-008**: El campo trigger debe aparecer antes del campo controlado en el formulario  
**RN-009**: No se permiten dependencias circulares (A depende de B, B depende de A)  
**RN-010**: Lógica condicional usa ID local para renderizado, ID maestro para backend  

### 7.3 Grillas

**RN-011**: Grids deben tener mínimo 1 columna  
**RN-012**: Grids tienen máximo 10 columnas  
**RN-013**: Grids del maestro tienen `formDataGridId` tipo `string`  
**RN-014**: Columnas de grids del maestro tienen `formDataGridColumnId` tipo `string`  
**RN-015**: Columnas de grids nuevos tienen `formDataGridColumnId` como `null`  

### 7.4 Validaciones

**RN-016**: Campo tipo `email` debe validar formato de correo electrónico  
**RN-017**: Campo tipo `number` solo acepta valores numéricos  
**RN-018**: Campos con validación de longitud deben tener min ≤ max  
**RN-019**: Campos requeridos deben tener valor antes de envío  

### 7.5 Export/Import

**RN-020**: JSON exportado debe incluir versión del schema  
**RN-021**: JSON debe ser autosuficiente para renderizado en web pública  
**RN-022**: Import de JSON valida estructura antes de cargar  
**RN-023**: Import sobrescribe formulario actual (requiere confirmación)  

---

## 8. INTERFACES DE USUARIO

### 8.1 Pantalla Principal - Constructor de Formularios

```
┌─────────────────────────────────────────────────────────────────┐
│ [Logo] Constructor de Formularios        [Preview] [Export] [⚙]│
├──────────┬────────────────────────────────────────┬──────────────┤
│          │                                        │              │
│ TOOLBOX  │           CANVAS                       │  PROPERTIES  │
│          │                                        │              │
│ 🔍Search │  ┌──────────────────────────────┐     │  Campo:      │
│          │  │  [Nombre Completo]           │     │  "Nombre"    │
│ 📦MAESTRO│  │  [___________________]       │     │              │
│ • Campo1 │  │                              │     │  ☑ Requerido │
│ • Campo2 │  │  [Actividad Profesional ▼]  │     │  ☐ Solo lect.│
│          │  │                              │     │              │
│ 📝BÁSICOS│  │  [Sección: Beneficiarios]   │     │  Validación: │
│ • Texto  │  │  └─ [Grid Beneficiarios]    │     │  Min: __     │
│ • Párrafo│  │     ├─ País ▼               │     │  Max: __     │
│ • Número │  │     ├─ RUT                  │     │              │
│          │  │     └─ Nombre               │     │  [Aplicar]   │
│ 📋SELECT │  └──────────────────────────────┘     │              │
│          │                                        │              │
└──────────┴────────────────────────────────────────┴──────────────┘
```

**Elementos Clave**:
1. **Toolbox (Izquierda)**: Campos disponibles para arrastrar
2. **Canvas (Centro)**: Área de construcción del formulario
3. **Properties Panel (Derecha)**: Configuración del campo seleccionado
4. **Toolbar (Superior)**: Acciones globales (Preview, Export, Settings)

### 8.2 Panel de Propiedades

El panel cambia según el tipo de campo seleccionado:

**Para Campo de Texto**:
- ✏️ Etiqueta del Campo
- 📝 Placeholder
- 📄 Descripción (Markdown)
- ☑️ Requerido
- 🔒 Solo Lectura
- 📏 Validación (min/max length)
- 🗂️ Mapeo a Campo Físico

**Para Campo Select**:
- ✏️ Etiqueta del Campo
- 📝 Placeholder
- 📄 Descripción
- ☑️ Requerido
- 📋 Opciones (Manual/Biblioteca/Maestro)
- 🔀 Lógica Condicional

**Para Grid**:
- ✏️ Etiqueta del Grid
- 📄 Descripción
- ➕ Agregar Columna
- 🗑️ Eliminar Columna
- Por cada columna:
  - Nombre
  - Tipo (Texto/Select/Archivo)
  - ☑️ Requerida

### 8.3 Modal de Vista Previa

```
┌─────────────────────────────────────────────────────┐
│  Vista Previa - Formulario de Inscripción      [✕] │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Nombre Completo *                                  │
│  [________________________________]                 │
│                                                     │
│  Actividad Profesional *                            │
│  [Seleccione una opción... ▼]                      │
│                                                     │
│  ¿Tiene beneficiarios finales? *                    │
│  ⚪ Sí  ⚪ No                                        │
│                                                     │
│  ┌─ Beneficiarios Finales ──────────────────────┐  │
│  │                                               │  │
│  │  [+ Agregar Fila]                            │  │
│  │  ┌────────┬──────────┬─────────┬────────┐   │  │
│  │  │ País ▼ │ RUT      │ Nombre  │ [🗑️]   │   │  │
│  │  └────────┴──────────┴─────────┴────────┘   │  │
│  │                                               │  │
│  └───────────────────────────────────────────────┘  │
│                                                     │
│                    [Cerrar Vista Previa]            │
└─────────────────────────────────────────────────────┘
```

**Funcionalidad**:
- Renderizado real del formulario
- Evaluación de lógica condicional en vivo
- Validaciones interactivas
- No guarda datos (solo preview)

---

## 9. FLUJOS DE PROCESO

### 9.1 Diagrama de Flujo: Creación de Formulario

```
[Inicio]
   │
   ▼
[Cargar Builder]
   │
   ▼
[Agregar Campos] ◄────────┐
   │                       │
   ▼                       │
[Configurar Props] ────────┘
   │
   ▼
[¿Lógica? ]───No───┐
   │               │
  Sí               │
   │               │
   ▼               │
[Config. Lógica]   │
   │               │
   └───────┬───────┘
           │
           ▼
   [Vista Previa]
           │
           ▼
   [¿OK?]───No──▶[Ajustar]──┐
      │                      │
     Sí                      │
      │ ◄────────────────────┘
      ▼
   [Exportar]
      │
      ▼
   [Guardar]
      │
      ▼
    [Fin]
```

### 9.2 Diagrama de Flujo: Sincronización con Maestro

```
[Backend recibe JSON]
         │
         ▼
  [Iterar campos]
         │
         ▼
[¿formDataId?]
    │      │
  null   string
    │      │
    ▼      ▼
[Crear  [Vincular
 en      campo
Maestro] existente]
    │      │
    └──┬───┘
       │
       ▼
[¿Tiene lógica?]
    │      │
   No     Sí
    │      │
    │      ▼
    │  [¿triggerFormDataId?]
    │      │         │
    │    null      string
    │      │         │
    │      ▼         ▼
    │  [Buscar  [Vincular
    │   trigger  trigger
    │   por ID   directo]
    │   local]     │
    │      │       │
    │      └───┬───┘
    │          │
    └────┬─────┘
         │
         ▼
   [Guardar Form
    actualizado]
         │
         ▼
       [Fin]
```

---

## 10. MATRICES DE TRAZABILIDAD

### 10.1 Objetivos de Negocio → Requisitos Funcionales

| Objetivo | Requisitos Relacionados |
|----------|------------------------|
| Reducir tiempos de desarrollo | RF-001, RF-002, RF-003, RF-007, RF-027 |
| Estandarizar captura de datos | RF-007, RF-008, RF-009, RF-010, RF-011 |
| Mejorar experiencia de usuario | RF-018, RF-019, RF-022, RF-023, RF-024 |

### 10.2 Casos de Uso → Requisitos Funcionales

| Caso de Uso | Requisitos Relacionados |
|-------------|------------------------|
| CU-001: Crear Formulario | RF-001, RF-007, RF-012, RF-015, RF-027 |
| CU-002: Editar Formulario | RF-002, RF-003, RF-031, RF-032 |
| CU-003: Lógica Condicional | RF-018, RF-019, RF-020, RF-022 |
| CU-004: Grid Tabular | RF-011, RF-012, RF-013, RF-014 |
| CU-005: Export/Import | RF-027, RF-028, RF-029, RF-030 |

---

## 11. GLOSARIO

| Término | Definición |
|---------|------------|
| **Canvas** | Área de trabajo donde se construye visualmente el formulario |
| **Datos Maestros** | Campos estandarizados del BackOffice que pueden reutilizarse |
| **Drag & Drop** | Arrastrar y soltar elementos con el mouse |
| **Field / Campo** | Elemento individual del formulario (input, select, etc.) |
| **FormDataId** | Identificador único del campo en el sistema de Datos Maestros |
| **FormDataGridId** | Identificador único de un grid en el sistema de Datos Maestros |
| **Grid** | Tabla de datos donde el usuario puede agregar múltiples filas |
| **JSON** | Formato de intercambio de datos (JavaScript Object Notation) |
| **Lógica Condicional** | Regla para mostrar/ocultar campos según otras respuestas |
| **Sección** | Agrupador de campos con un título |
| **Toolbox** | Caja de herramientas con campos disponibles para agregar |
| **Trigger** | Campo que controla la visibilidad de otro campo |
| **triggerId** | ID local del campo trigger (usado en frontend) |
| **triggerFormDataId** | ID del maestro del campo trigger (usado en backend) |

---

## 12. SUPUESTOS Y DEPENDENCIAS

### 12.1 Supuestos

1. Los Datos Maestros están disponibles y actualizados en el BackOffice
2. Los usuarios tienen conocimiento básico de diseño de formularios
3. La web pública puede interpretar el JSON generado
4. El backend puede procesar la sincronización con Datos Maestros
5. Los navegadores soportan HTML5 Drag & Drop API

### 12.2 Dependencias

| Dependencia | Criticidad | Proveedor |
|-------------|-----------|-----------|
| API de Datos Maestros | Alta | BackOffice System |
| Servicio de Almacenamiento | Alta | Backend API |
| Librería de Renderizado | Alta | Web Pública |
| Autenticación de Usuarios | Alta | Identity Server |

---

## 13. RESTRICCIONES

### 13.1 Restricciones Técnicas

- El sistema debe funcionar en navegadores modernos (Chrome, Firefox, Edge)
- El JSON generado no debe exceder 5MB
- Máximo 100 campos por formulario
- Máximo 10 niveles de anidación (secciones dentro de secciones)

### 13.2 Restricciones de Negocio

- Solo usuarios con rol "Administrador" pueden crear formularios
- Formularios publicados no pueden eliminarse (solo archivarse)
- Cambios en Datos Maestros se reflejan en todos los formularios
- Histórico de versiones se mantiene por 1 año

### 13.3 Restricciones Legales

- Cumplimiento con GDPR para datos personales
- Campos sensibles deben estar encriptados
- Auditoría de cambios obligatoria

---

## 14. CRITERIOS DE ACEPTACIÓN

### 14.1 CA-001: Creación de Formulario Básico

**Dado** que soy un administrador autenticado  
**Cuando** creo un formulario con 5 campos básicos  
**Entonces** debo poder:
- ✅ Arrastrar campos desde la toolbox
- ✅ Configurar etiquetas y propiedades
- ✅ Marcar campos como requeridos
- ✅ Ver vista previa funcional
- ✅ Exportar JSON válido

### 14.2 CA-002: Uso de Datos Maestros

**Dado** que hay campos disponibles en Datos Maestros  
**Cuando** arrastro un campo del maestro al canvas  
**Entonces** debo observar:
- ✅ Campo agregado con configuración bloqueada
- ✅ Indicador visual "MAESTRO" visible
- ✅ Etiqueta y opciones no editables
- ✅ `formDataId` con valor string en JSON
- ✅ Configuración de requerido/opcional editable

### 14.3 CA-003: Lógica Condicional

**Dado** que tengo un formulario con campo select y una sección  
**Cuando** configuro lógica para mostrar sección si select = "Sí"  
**Entonces** debo observar:
- ✅ Sección oculta inicialmente en preview
- ✅ Sección visible cuando selecciono "Sí"
- ✅ Sección oculta nuevamente cuando cambio a "No"
- ✅ JSON contiene `triggerId` y `triggerFormDataId`

### 14.4 CA-004: Grid del Maestro

**Dado** que hay un grid disponible en Datos Maestros  
**Cuando** arrastro el grid al formulario  
**Entonces** debo observar:
- ✅ Grid agregado con columnas pre-configuradas
- ✅ Columnas no editables
- ✅ Indicador "MAESTRO" en configuración
- ✅ `formDataGridId` con valor string
- ✅ Cada columna tiene `formDataGridColumnId`

### 14.5 CA-005: Export/Import

**Dado** que tengo un formulario completo  
**Cuando** exporto e importo el JSON  
**Entonces** debo observar:
- ✅ Archivo JSON descargado correctamente
- ✅ JSON contiene todos los campos
- ✅ Import restaura formulario idénticamente
- ✅ Lógica condicional funciona tras import
- ✅ Referencias a maestro se mantienen

---

## 15. RIESGOS Y MITIGACIONES

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Cambios en Datos Maestros rompen formularios | Media | Alto | Versionamiento de esquemas, validación en runtime |
| JSON muy grande afecta performance | Baja | Medio | Límite de campos, compresión, paginación |
| Usuario crea lógica circular | Media | Medio | Validación automática, mensajes de error claros |
| Incompatibilidad de versiones de JSON | Alta | Alto | Versión en metadata, migración automática |
| Pérdida de datos al importar | Baja | Alto | Confirmación obligatoria, backup automático |

---

## 16. PLAN DE PRUEBAS FUNCIONALES

### 16.1 Casos de Prueba Prioritarios

| ID | Descripción | Tipo | Prioridad |
|----|-------------|------|-----------|
| PT-001 | Crear formulario con todos los tipos de campo | Funcional | Alta |
| PT-002 | Editar campo del maestro (debe fallar) | Negativa | Alta |
| PT-003 | Configurar lógica condicional compleja | Funcional | Alta |
| PT-004 | Exportar e importar formulario grande (50+ campos) | Performance | Media |
| PT-005 | Crear dependencia circular (debe fallar) | Negativa | Alta |
| PT-006 | Undo/Redo con 20 cambios | Funcional | Media |
| PT-007 | Sincronización de campos nuevos con maestro | Integración | Alta |
| PT-008 | Grid con 10 columnas de diferentes tipos | Funcional | Media |

### 16.2 Escenarios de Prueba End-to-End

**E2E-001: Flujo Completo de Onboarding**
1. Crear formulario "Onboarding Cliente Empresa"
2. Agregar 3 campos del maestro
3. Agregar 5 campos personalizados
4. Crear sección con lógica condicional
5. Agregar grid del maestro dentro de sección
6. Configurar validaciones
7. Vista previa y prueba de lógica
8. Exportar JSON
9. Importar JSON en nueva instancia
10. Verificar integridad

**Resultado Esperado**: Formulario funcional en ambas instancias

---

## 17. ANEXOS

### Anexo A: Ejemplo de JSON Completo

```json
{
  "title": "Formulario Onboarding Cliente",
  "description": "Captura de información inicial del cliente",
  "version": "1.0.0",
  "createdAt": "2026-01-04T10:30:00Z",
  "fields": [
    {
      "id": "nombre_completo",
      "type": "text",
      "label": "Nombre Completo",
      "placeholder": "Ej. Juan Pérez",
      "required": true,
      "order": 1,
      "width": "full",
      "formDataId": null
    },
    {
      "id": "actividad_profesional",
      "type": "select",
      "label": "Actividad profesional actual",
      "required": true,
      "order": 2,
      "width": "half",
      "formDataId": "md_001",
      "options": ["Empleado", "Autónomo", "Empresario"],
      "formDataOptions": [
        {"value": "Empleado", "formDataOptionId": "opt_001_1"},
        {"value": "Autónomo", "formDataOptionId": "opt_001_2"}
      ]
    },
    {
      "id": "tiene_beneficiarios",
      "type": "radio",
      "label": "¿Tiene beneficiarios finales?",
      "required": true,
      "order": 3,
      "width": "full",
      "formDataId": null,
      "options": ["Sí", "No"]
    },
    {
      "id": "seccion_beneficiarios",
      "type": "section",
      "label": "BENEFICIARIOS FINALES",
      "order": 4,
      "width": "full",
      "logic": {
        "triggerId": "tiene_beneficiarios",
        "triggerFormDataId": null,
        "value": "Sí",
        "enabled": true
      },
      "children": [
        {
          "id": "grid_beneficiarios",
          "type": "grid",
          "label": "Lista de Beneficiarios",
          "order": 1,
          "width": "full",
          "formDataGridId": "md_grid_001",
          "columns": [
            {
              "id": "col_pais",
              "label": "País",
              "type": "select",
              "required": true,
              "formDataGridColumnId": "col_001",
              "formDataOptions": [
                {"value": "Chile", "formDataOptionId": "opt_col_001_1"}
              ]
            },
            {
              "id": "col_rut",
              "label": "RUT / N° Doc",
              "type": "text",
              "required": true,
              "formDataGridColumnId": "col_002"
            }
          ]
        }
      ]
    }
  ]
}
```

### Anexo B: Mapeo de Roles y Permisos

| Acción | Admin | Analista | Viewer |
|--------|-------|----------|--------|
| Crear formulario | ✅ | ✅ | ❌ |
| Editar formulario | ✅ | ✅ | ❌ |
| Eliminar formulario | ✅ | ❌ | ❌ |
| Ver formularios | ✅ | ✅ | ✅ |
| Exportar JSON | ✅ | ✅ | ✅ |
| Importar JSON | ✅ | ✅ | ❌ |
| Gestionar Datos Maestros | ✅ | ❌ | ❌ |

### Anexo C: Checklist de Implementación

- [x] Drag & Drop de campos
- [x] Integración con Datos Maestros
- [x] Configuración de propiedades
- [x] Lógica condicional
- [x] Validaciones básicas
- [x] Export/Import JSON
- [x] Vista previa
- [x] Undo/Redo
- [x] Grids con columnas
- [ ] Validación de dependencias circulares
- [ ] Versionamiento automático
- [ ] Auditoría de cambios
- [ ] Multi-idioma
- [ ] Templates pre-diseñados

---

## 18. APROBACIONES

| Rol | Nombre | Firma | Fecha |
|-----|--------|-------|-------|
| Product Owner | ___________ | _____ | _____ |
| Líder Técnico | ___________ | _____ | _____ |
| Analista de Negocio | ___________ | _____ | _____ |
| QA Lead | ___________ | _____ | _____ |

---

**Documento Versión**: 1.0  
**Última Actualización**: 04 de Enero, 2026  
**Próxima Revisión**: 04 de Febrero, 2026
