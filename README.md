# Sistema de Votaciones Seguras en la Internet Computer Protocol (ICP)

## Visión General

Este proyecto presenta un sistema de votaciones digitales diseñado para optimizar y modernizar el proceso electoral, abordando desafíos tradicionales como el uso excesivo de papel y la necesidad de auditar la confiabilidad del conteo de votos. La implementación de esta solución sobre la **Internet Computer Protocol (ICP)** no solo permite un ahorro significativo de recursos (como la impresión y distribución de boletas), sino que también eleva el estándar de transparencia y seguridad en el proceso de votación.

La idea central es ofrecer una plataforma robusta donde los ciudadanos puedan emitir su voto de manera sencilla y los resultados sean procesados y verificados con una integridad inquebrantable, inherente a la naturaleza descentralizada de la ICP.

## Funcionalidad Clave

El sistema permite:

* **Verificación de Identidad:** Los usuarios ingresan un `IDINE` para verificar si están habilitados para votar y si no han emitido su voto previamente.
* **Emisión de Voto Electrónico:** Una interfaz intuitiva permite a los votantes seleccionar a sus candidatos para las categorías de Presidente, Diputado y Senador.
* **Conteo de Votos en Tiempo Real:** El sistema registra los votos de forma segura y actualiza los resultados en tiempo real.
* **Visualización de Resultados:** Presentación clara y ordenada de los resultados de la votación por cargo, mostrando los votos de cada candidato.
* **Interfaz de Usuario Optimizada:** Diseño de interfaz (UI) con listados de candidatos en recuadros con scroll, permitiendo manejar grandes volúmenes de candidatos de manera eficiente y manteniendo una disposición horizontal para las diferentes categorías de cargos (Presidente, Diputado, Senador, y futuras adiciones como Alcalde, Regidores, etc.).

## ¿Por qué la Internet Computer Protocol (ICP) garantiza la confiabilidad?

La elección de la Internet Computer Protocol (ICP) como infraestructura subyacente no es arbitraria; es fundamental para la promesa de un sistema de votación verdaderamente confiable y a prueba de manipulaciones:

1.  **Descentralización Total:** A diferencia de las soluciones basadas en servidores centralizados (que son puntos únicos de falla y vulnerables a ataques dirigidos), la ICP es una red descentralizada de miles de nodos independientes operados por diversos data centers alrededor del mundo. Esto elimina la dependencia de una sola entidad y distribuye el riesgo.

2.  **Software a Prueba de Manipulaciones (Tamper-Proof Software):** Los canisters (contratos inteligentes de la ICP, donde reside la lógica de votación y los datos) ejecutan su código de manera determinista y a prueba de manipulaciones. Una vez desplegado, el código de votación no puede ser alterado sin el consenso de la red, garantizando que las reglas del proceso de votación y conteo no puedan ser cambiadas a mitad del camino por ninguna autoridad central.

3.  **Transparencia Auditable:** Cada transacción y cada voto registrado en la ICP es inmutable y verificable. Cualquier persona puede auditar la cadena de bloques para confirmar que los votos se han contado correctamente y que el sistema se ha comportado como se espera. No hay "cajas negras" en el proceso.

4.  **Resistencia a la Censura:** La ICP es inherentemente resistente a la censura. Una vez que el sistema de votación está en la red, no puede ser apagado, alterado o censurado por gobiernos, corporaciones o atacantes individuales. Los votos de los ciudadanos permanecen seguros y accesibles.

5.  **Cero Downtime (Alta Disponibilidad):** Los servicios desplegados en la ICP están diseñados para funcionar continuamente. No hay tiempo de inactividad, lo que significa que el proceso de votación puede llevarse a cabo sin interrupciones, un factor crítico en cualquier elección.

6.  **Costo-Efectividad y Escalabilidad:** Al eliminar la necesidad de infraestructuras centralizadas y boletas físicas, el sistema no solo reduce costos operativos y de seguridad, sino que también escala de manera eficiente para manejar un gran número de votantes sin comprometer el rendimiento.

---

## Estructura del Proyecto
```
sistema_votaciones/
├── .dfx/
├── node_modules/
├── src/
│   ├── declarations/              # Declaraciones Candid autogeneradas
│   ├── sistema_votaciones_backend/  # Canister backend en Motoko
│   │   └── main.mo
│   └── sistema_votaciones_frontend/ # Canister frontend (JavaScript/Lit-HTML)
│       ├── assets/
│       │   └── index.html           # Página HTML principal del frontend
│       ├── src/
│       │   ├── App.js               # Lógica principal de la aplicación frontend con Lit-HTML
│       │   ├── main.js              # Punto de entrada del frontend
│       │   ├── styles.css           # Estilos CSS de la aplicación
│       │   └── ... otros assets/scripts
│       └── ...
├── .env
├── .gitignore                    # Archivo para ignorar en Git (ej. node_modules, .dfx)
├── dfx.json                      # Configuración del DFINITY SDK
├── package.json                  # Dependencias de Node.js
└── README.md                     # Este archivo
```

---

## Cómo Iniciar el Proyecto (Desarrollo Local)

Para ejecutar este proyecto localmente en tu máquina, necesitas tener el DFINITY SDK instalado.

1.  **Clona el repositorio:**
    ```bash
    git clone [https://github.com/filazdev/sistema_votaciones_icp.git](https://github.com/filazdev/sistema_votaciones_icp.git)
    cd sistema_votaciones_icp
    ```
    (Si ya estás en el directorio de tu proyecto y solo lo vas a subir por primera vez, omite este paso de clonación y pasa directamente al `npm install`).

2.  **Instala las dependencias del frontend:**
    ```bash
    npm install
    ```
    o si usas `yarn`:
    ```bash
    yarn
    ```

3.  **Inicia el entorno de desarrollo local de la ICP:**
    ```bash
    dfx start --background
    ```

4.  **Despliega tus canisters a la réplica local y genera tu interfaz Candid:**
    ```bash
    dfx deploy
    ```

5.  **Accede a la aplicación:**
    Una vez que la implementación se complete, tu aplicación de frontend estará disponible en una URL local, típicamente: `http://localhost:4943?canisterId={asset_canister_id}`.
    Si estás usando el servidor de desarrollo de `npm start` (ver abajo), la URL será `http://localhost:8080`.

### Notas Adicionales para el Desarrollo:

* **Generar interfaz Candid (para cambios en el backend):** Si realizas cambios en tu canister de backend (`main.mo`), puedes generar una nueva interfaz Candid con:
    ```bash
    npm run generate
    ```
    Esto se ejecuta automáticamente también cada vez que haces `dfx deploy`.

* **Servidor de desarrollo de Frontend:** Si estás realizando cambios en el frontend y quieres que se recarguen automáticamente, puedes iniciar un servidor de desarrollo con:
    ```bash
    npm start
    ```
    Esto usualmente iniciará un servidor en `http://localhost:8080`, proxying las solicitudes a tu réplica local de ICP en el puerto 4943.

---

## Contribución

¡Las contribuciones son bienvenidas! Si tienes ideas para mejorar, reportes de bugs o quieres añadir nuevas funcionalidades, por favor, abre un "issue" o envía un "pull request".

## Licencia

Este proyecto está bajo la Licencia MIT. Para más detalles, consulta el archivo [LICENSE](LICENSE).

---
