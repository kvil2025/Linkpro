# LinkPro — Conexión Presencial y Afinidad Selectiva (MVP)

LinkPro es una aplicación web progresiva (PWA) móvil diseñada para conectar con personas en persona (fiestas, eventos de networking, conferencias o tocatas), comparar intereses/habilidades y decidir con total privacidad qué datos compartir.

---

## 🚀 Características Principales Implementadas

1. **Una cuenta, dos perfiles independientes**:
   - **Modo Personal** (violeta/rosa neón): Foco en intereses, música, salidas, actividades y citas/amistades.
   - **Modo Profesional** (cian/esmeralda neón): Foco en habilidades, necesidades, sinergias y negocios. Una conexión profesional jamás expone tus redes personales ni tu teléfono.
2. **Intercambio Efímero y Seguro (Cross-Platform)**:
   - Código QR dinámico con token aleatorio de alta seguridad (TTL de 5 minutos).
   - Código alternativo de 6 dígitos para lugares ruidosos o con muy baja luminosidad.
   - Diseñado para funcionar 100% en navegadores móviles (iOS y Android) sin depender de NFC P2P restrictivo.
3. **Motor de Afinidad Explicable**:
   - No utiliza números ficticios o "cajas negras".
   - Reporta **Puntuación de coincidencia** y **Cobertura de datos comparados**.
   - En Modo Personal: Afinidad de intereses y compatibilidad de intención.
   - En Modo Profesional: Complementariedad asimétrica ($A_{\text{busca}} \cap B_{\text{ofrece}}$).
4. **Revelación Gradual y Selectiva (Contact Grants)**:
   - Ambas personas ven la afinidad antes de entregar un solo dato de contacto.
   - Cada usuario elige qué canales compartir (solo WhatsApp, solo Instagram, solo LinkedIn, etc.).
5. **Memoria de Encuentro y Notas Privadas**:
   - Guarda automáticamente fecha y lugar del encuentro.
   - Permite registrar una nota privada solo visible para su autor (*"Conversamos cerca de la barra sobre su startup..."*).

---

## 🛠️ Tecnologías Utilizadas

- **Framework**: Next.js 15 (App Router) + React 19 + TypeScript
- **Estilos**: Tailwind CSS con paleta optimizada para pantallas OLED (`#000000`) y alto contraste para discotecas
- **Iconografía**: Lucide React
- **Códigos QR**: `qrcode.react`
- **Almacenamiento Local**: `localStorage` reactivo con simulación de apretón de manos para pruebas inmediatas

---

## 💻 Instrucciones para Ejecución Local

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo
npm run dev

# 3. Compilar para producción
npm run build
npm run start
```

Abre en tu navegador: [http://localhost:3000](http://localhost:3000) (o ábrelo en el navegador de tu celular conectado a la misma red local).
