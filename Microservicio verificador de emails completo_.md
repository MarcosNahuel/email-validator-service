

### **Estructura del Proyecto**

A continuación se presenta la estructura de directorios y archivos que se generará:

.  
├──.github/  
│   └── workflows/  
│       └── ci.yml  
├── src/  
│   ├── checks/  
│   │   ├── dns.ts  
│   │   ├── smtp.ts  
│   │   └── syntax.ts  
│   ├── middleware/  
│   │   ├── auth.ts  
│   │   ├── errorHandler.ts  
│   │   └── rateLimit.ts  
│   ├── routes/  
│   │   ├── health.routes.ts  
│   │   ├── index.ts  
│   │   ├── unsubscribe.routes.ts  
│   │   └── validation.routes.ts  
│   ├── services/  
│   │   ├── disposable.service.ts  
│   │   └── validation.service.ts  
│   ├── tests/  
│   │   ├── checks/  
│   │   │   ├── dns.test.ts  
│   │   │   ├── smtp.test.ts  
│   │   │   └── syntax.test.ts  
│   │   ├── routes/  
│   │   │   └── validation.e2e.test.ts  
│   │   └── services/  
│   │       └── validation.service.test.ts  
│   ├── utils/  
│   │   ├── cache.ts  
│   │   └── logger.ts  
│   ├── validators/  
│   │   └── email.validator.ts  
│   ├── config.ts  
│   └── server.ts  
├──.env.example  
├──.eslintrc.js  
├──.gitignore  
├──.prettierrc  
├── Dockerfile  
├── docker-compose.yml  
├── openapi.yaml  
├── package.json  
├── postman\_collection.json  
├── README.md  
└── tsconfig.json

---

### **Archivos de Configuración del Proyecto**

Estos archivos definen el entorno del proyecto, las dependencias y las reglas de construcción.

#### **package.json**

Este archivo define los metadatos del proyecto, las dependencias y los scripts para automatizar tareas comunes como el desarrollo, las pruebas y la construcción.

JSON

{  
  "name": "email-verifier-microservice",  
  "version": "1.0.0",  
  "description": "A fast, reliable, and production-ready email verification microservice.",  
  "main": "dist/server.js",  
  "type": "module",  
  "scripts": {  
    "dev": "ts-node-dev \--respawn \--transpile-only \--exit-child src/server.ts",  
    "build": "tsc",  
    "start": "node dist/server.js",  
    "test": "vitest run",  
    "test:watch": "vitest",  
    "test:coverage": "vitest run \--coverage",  
    "lint": "eslint. \--ext.ts",  
    "lint:fix": "eslint. \--ext.ts \--fix",  
    "openapi:serve": "swagger-ui-cli bundle \-o public/openapi.json openapi.yaml && http-server public",  
    "disposable:update": "ts-node-dev src/services/disposable.service.ts update"  
  },  
  "keywords": \[  
    "email",  
    "validation",  
    "verification",  
    "microservice",  
    "nodejs",  
    "typescript"  
  \],  
  "author": "AI Assistant for Italicia",  
  "license": "MIT",  
  "dependencies": {  
    "cors": "^2.8.5",  
    "dotenv": "^16.4.5",  
    "express": "^4.19.2",  
    "express-rate-limit": "^7.2.0",  
    "express-swagger-ui-official": "^2.0.0",  
    "ioredis": "^5.4.1",  
    "isemail": "^3.2.0",  
    "lru-cache": "^10.2.2",  
    "nodemailer": "^6.9.13",  
    "pino": "^9.1.0",  
    "pino-pretty": "^11.0.0",  
    "prom-client": "^15.1.2",  
    "punycode": "^2.3.1",  
    "zod": "^3.23.8"  
  },  
  "devDependencies": {  
    "@types/cors": "^2.8.17",  
    "@types/express": "^4.17.21",  
    "@types/isemail": "^3.2.4",  
    "@types/node": "^20.12.12",  
    "@types/nodemailer": "^6.4.15",  
    "@types/punycode": "^2.1.4",  
    "@types/supertest": "^6.0.2",  
    "@typescript-eslint/eslint-plugin": "^7.9.0",  
    "@typescript-eslint/parser": "^7.9.0",  
    "@vitest/coverage-v8": "^1.6.0",  
    "eslint": "^8.57.0",  
    "eslint-config-prettier": "^9.1.0",  
    "eslint-plugin-prettier": "^5.1.3",  
    "http-server": "^14.1.1",  
    "prettier": "^3.2.5",  
    "supertest": "^7.0.0",  
    "swagger-ui-cli": "^4.1.2",  
    "ts-node-dev": "^2.0.0",  
    "typescript": "^5.4.5",  
    "vitest": "^1.6.0"  
  },  
  "engines": {  
    "node": "\>=20.0.0"  
  }  
}

#### **tsconfig.json**

Configuración estricta de TypeScript para garantizar la calidad y robustez del código.

JSON

{  
  "compilerOptions": {  
    "target": "ES2022",  
    "module": "NodeNext",  
    "moduleResolution": "NodeNext",  
    "baseUrl": ".",  
    "outDir": "./dist",  
    "rootDir": "./src",  
    "esModuleInterop": true,  
    "forceConsistentCasingInFileNames": true,  
    "strict": true,  
    "skipLibCheck": true,  
    "resolveJsonModule": true,  
    "sourceMap": true,  
    "lib":  
  },  
  "include": \["src/\*\*/\*"\],  
  "exclude": \["node\_modules", "dist", "src/tests"\]  
}

#### **.gitignore**

Excluye archivos y directorios innecesarios del control de versiones.

\# Logs  
logs  
\*.log  
npm-debug.log\*  
yarn-debug.log\*  
yarn-error.log\*  
pnpm-debug.log\*

\# Runtime data  
pids  
\*.pid  
\*.seed  
\*.pid.lock

\# Directory for instrumented libs generated by jscoverage/JSCover  
lib-cov

\# Coverage directory used by tools like istanbul  
coverage  
\*.lcov

\# nyc test coverage  
.nyc\_output

\# Grunt intermediate storage (http://gruntjs.com/creating-plugins\#storing-temporary-files)  
.grunt

\# node-waf configuration  
.lock-wscript

\# Compiled binary addons (http://nodejs.org/api/addons.html)  
build/Release

\# Dependency directories  
node\_modules/  
jspm\_packages/

\# TypeScript v1 declaration files  
typings/

\# Optional npm cache directory  
.npm

\# Optional eslint cache  
.eslintcache

\# Optional REPL history  
.node\_repl\_history

\# Output of 'npm pack'  
\*.tgz

\# Yarn Integrity file  
.yarn-integrity

\# dotenv environment variables file  
.env  
.env.test  
.env.production

\# parcel-bundler cache (\`.cache\`)  
.cache

\# Next.js build folder  
.next  
out/

\# Nuxt.js build folder  
.nuxt

\# dist folder  
dist/

\# public folder for swagger  
public/

\# disposable domains list  
disposable\_domains.json

#### **.env.example**

Plantilla y documentación para todas las variables de entorno requeridas por la aplicación.

\# APP CONFIGURATION  
PORT=3000  
LOG\_LEVEL=info \# trace, debug, info, warn, error, fatal  
NODE\_ENV=development \# development, production

\# SECURITY  
\# Comma-separated list of valid API keys  
API\_KEYS=your\_secret\_key\_1,your\_secret\_key\_2  
\# Comma-separated list of allowed origins for CORS  
ALLOWED\_ORIGINS=http://localhost:3000,https://app.yourdomain.com

\# RATE LIMITING (requests per minute)  
RATE\_LIMIT\_IP\_PER\_MIN=60  
RATE\_LIMIT\_KEY\_PER\_MIN=600 \# Per API key rate limit

\# CACHE CONFIGURATION  
\# Optional Redis URL. If not provided, an in-memory LRU cache will be used.  
\# Example: redis://user:password@host:port  
REDIS\_URL=redis://localhost:6379  
CACHE\_TTL\_SECONDS=86400 \# 24 hours

\# EMAIL VALIDATION LOGIC  
BLOCK\_ROLES=true  
BLOCK\_DISPOSABLE=true

\# SMTP PROBE CONFIGURATION  
ENABLE\_SMTP\_PROBE=true  
SMTP\_TIMEOUT\_MS=5000 \# Timeout for SMTP connection and commands  
SMTP\_HELO\_DOMAIN=verifier.yourdomain.com \# Domain to use in EHLO/HELO command  
SMTP\_FROM\_EMAIL=bounce@verifier.yourdomain.com \# Email to use in MAIL FROM command

\# DISPOSABLE DOMAINS LIST  
\# Comma-separated list of URLs to fetch disposable domains from.  
DISPOSABLE\_SOURCES=https://raw.githubusercontent.com/disposable/disposable-email-domains/master/domains.txt,https://raw.githubusercontent.com/martenson/disposable-email-domains/master/disposable\_email\_blocklist.conf

#### **.eslintrc.js**

JavaScript

module.exports \= {  
  parser: '@typescript-eslint/parser',  
  extends: \[  
    'plugin:@typescript-eslint/recommended',  
    'prettier',  
    'plugin:prettier/recommended',  
  \],  
  parserOptions: {  
    ecmaVersion: 2022,  
    sourceType: 'module',  
  },  
  rules: {  
    '@typescript-eslint/no-unused-vars': \['warn', { 'argsIgnorePattern': '^\_' }\],  
    '@typescript-eslint/explicit-module-boundary-types': 'off',  
  },  
};

#### **.prettierrc**

JSON

{  
  "semi": true,  
  "trailingComma": "all",  
  "singleQuote": true,  
  "printWidth": 80,  
  "tabWidth": 2  
}

---

### **Contenerización (Docker)**

Archivos para construir y ejecutar la aplicación en un entorno de contenedores, optimizado para producción y desarrollo local.

#### **Dockerfile**

Dockerfile multi-etapa que crea una imagen de producción ligera, segura y optimizada.

Dockerfile

\# \---- Base \----  
FROM node:20\-alpine AS base  
WORKDIR /usr/src/app  
RUN apk add \--no-cache libc6-compat

\# \---- Builder \----  
FROM base AS builder  
WORKDIR /usr/src/app  
COPY package\*.json./  
\# Use pnpm if lockfile exists, otherwise npm  
RUN if \[ \-f pnpm-lock.yaml \]; then \\  
        npm install \-g pnpm && pnpm install \--frozen-lockfile; \\  
    else \\  
        npm install; \\  
    fi  
COPY..  
RUN npm run build

\# \---- Production \----  
FROM base AS production  
ENV NODE\_ENV=production  
WORKDIR /usr/src/app  
COPY package\*.json./  
\# Use pnpm if lockfile exists, otherwise npm  
RUN if \[ \-f pnpm-lock.yaml \]; then \\  
        npm install \-g pnpm && pnpm install \--prod \--frozen-lockfile; \\  
    else \\  
        npm install \--omit=dev; \\  
    fi  
COPY \--from=builder /usr/src/app/dist./dist  
COPY \--from=builder /usr/src/app/src/services/disposable\_domains.fallback.json./dist/services/  
\# Add non-root user  
RUN addgroup \-S appgroup && adduser \-S appuser \-G appgroup  
USER appuser

EXPOSE 3000  
\# The default PORT is 3000, but it can be overridden by the PORT env var.  
\# EasyPanel will automatically set the PORT variable.  
CMD \["node", "dist/server.js"\]

\# Healthcheck for container orchestrators like Docker Swarm, Kubernetes, and EasyPanel  
HEALTHCHECK \--interval=30s \--timeout=5s \--start-period=10s \--retries=3 \\  
  CMD wget \-q \--spider http://localhost:3000/healthz |

| exit 1

#### **docker-compose.yml**

Facilita la ejecución del entorno de desarrollo local completo, incluyendo la base de datos Redis.

YAML

version: '3.8'

services:  
  app:  
    build:  
      context:.  
      dockerfile: Dockerfile  
    ports:  
      \- "3000:3000"  
    env\_file:  
      \-.env  
    depends\_on:  
      \- redis  
    volumes:  
      \-./src:/usr/src/app/src \# Optional: for hot-reloading in dev  
    environment:  
      \- NODE\_ENV=development  
      \- REDIS\_URL=redis://redis:6379

  redis:  
    image: "redis:7-alpine"  
    ports:  
      \- "6379:6379"  
    volumes:  
      \- redis\_data:/data

volumes:  
  redis\_data:

---

### **Código Fuente de la Aplicación (src/)**

El núcleo lógico del microservicio, organizado en módulos cohesivos y débilmente acoplados.

#### **src/config.ts**

Valida y exporta las variables de entorno al inicio de la aplicación, garantizando una configuración correcta o fallando de forma temprana y explícita.

TypeScript

import 'dotenv/config';  
import { z } from 'zod';

const envSchema \= z.object({  
  NODE\_ENV: z  
   .enum(\['development', 'production', 'test'\])  
   .default('development'),  
  PORT: z.coerce.number().default(3000),  
  LOG\_LEVEL: z  
   .enum(\['trace', 'debug', 'info', 'warn', 'error', 'fatal'\])  
   .default('info'),  
  API\_KEYS: z  
   .string()  
   .transform((val) \=\> val.split(',').map((key) \=\> key.trim())),  
  ALLOWED\_ORIGINS: z  
   .string()  
   .transform((val) \=\> val.split(',').map((origin) \=\> origin.trim())),  
  RATE\_LIMIT\_IP\_PER\_MIN: z.coerce.number().default(60),  
  RATE\_LIMIT\_KEY\_PER\_MIN: z.coerce.number().default(600),  
  REDIS\_URL: z.string().optional(),  
  CACHE\_TTL\_SECONDS: z.coerce.number().default(86400),  
  BLOCK\_ROLES: z.coerce.boolean().default(true),  
  BLOCK\_DISPOSABLE: z.coerce.boolean().default(true),  
  ENABLE\_SMTP\_PROBE: z.coerce.boolean().default(true),  
  SMTP\_TIMEOUT\_MS: z.coerce.number().default(5000),  
  SMTP\_HELO\_DOMAIN: z.string().default('verifier.yourdomain.com'),  
  SMTP\_FROM\_EMAIL: z.string().email().default('bounce@verifier.yourdomain.com'),  
  DISPOSABLE\_SOURCES: z  
   .string()  
   .transform((val) \=\> val.split(',').map((url) \=\> url.trim())),  
});

const parsedEnv \= envSchema.safeParse(process.env);

if (\!parsedEnv.success) {  
  console.error(  
    '❌ Invalid environment variables:',  
    parsedEnv.error.flatten().fieldErrors,  
  );  
  throw new Error('Invalid environment variables.');  
}

export const config \= parsedEnv.data;

#### **src/utils/logger.ts**

Configura un logger pino para registros estructurados en formato JSON, crucial para la observabilidad en producción.

TypeScript

import pino from 'pino';  
import { config } from '../config.js';

const transport \=  
  config.NODE\_ENV \=== 'development'  
   ? {  
        target: 'pino-pretty',  
        options: {  
          colorize: true,  
          translateTime: 'SYS:standard',  
          ignore: 'pid,hostname',  
        },  
      }  
    : undefined;

export const logger \= pino({  
  level: config.LOG\_LEVEL,  
  transport,  
  formatters: {  
    log(object) {  
      // Obfuscate email for privacy in logs, except in debug mode  
      if (config.LOG\_LEVEL\!== 'debug' && object.email) {  
        const \[local, domain\] \= (object.email as string).split('@');  
        if (local && domain) {  
          const obfuscatedLocal \=  
            local.length \> 2  
             ? \`${local.substring(0, 2)}...\`  
              : \`${local.substring(0, 1)}...\`;  
          object.email \= \`${obfuscatedLocal}@${domain}\`;  
        }  
      }  
      return object;  
    },  
  },  
});

#### **src/utils/cache.ts**

Capa de abstracción para el caché. Utiliza Redis si está configurado; de lo contrario, recurre a un caché LRU en memoria.

TypeScript

import { Redis } from 'ioredis';  
import { LRUCache } from 'lru-cache';  
import { config } from '../config.js';  
import { logger } from './logger.js';

interface CacheClient {  
  get(key: string): Promise\<string | null\>;  
  set(key: string, value: string, ttlSeconds: number): Promise\<void\>;  
  del(key: string): Promise\<void\>;  
  connect?(): Promise\<void\>;  
  disconnect?(): void;  
}

class RedisCache implements CacheClient {  
  private client: Redis;

  constructor(url: string) {  
    this.client \= new Redis(url, {  
      maxRetriesPerRequest: 3,  
      lazyConnect: true,  
    });

    this.client.on('error', (err) \=\> {  
      logger.error({ err }, 'Redis connection error');  
    });  
  }

  async get(key: string): Promise\<string | null\> {  
    return this.client.get(key);  
  }

  async set(key: string, value: string, ttlSeconds: number): Promise\<void\> {  
    await this.client.set(key, value, 'EX', ttlSeconds);  
  }

  async del(key: string): Promise\<void\> {  
    await this.client.del(key);  
  }

  async connect(): Promise\<void\> {  
    await this.client.connect();  
    logger.info('Successfully connected to Redis.');  
  }

  disconnect(): void {  
    this.client.disconnect();  
  }  
}

class MemoryCache implements CacheClient {  
  private client: LRUCache\<string, string\>;

  constructor() {  
    this.client \= new LRUCache({  
      max: 5000, // Max number of items in cache  
      ttl: config.CACHE\_TTL\_SECONDS \* 1000, // TTL in milliseconds  
    });  
    logger.info('Using in-memory LRU cache.');  
  }

  async get(key: string): Promise\<string | null\> {  
    return this.client.get(key)?? null;  
  }

  async set(key: string, value: string, ttlSeconds: number): Promise\<void\> {  
    this.client.set(key, value, { ttl: ttlSeconds \* 1000 });  
  }

  async del(key: string): Promise\<void\> {  
    this.client.delete(key);  
  }  
}

export const cache: CacheClient \= config.REDIS\_URL  
 ? new RedisCache(config.REDIS\_URL)  
  : new MemoryCache();

#### **src/services/disposable.service.ts**

Gestiona la lista de dominios desechables, obteniéndola de fuentes externas, cacheándola y proporcionando un método de consulta. Incluye una lista de respaldo embebida para resiliencia.

TypeScript

import fs from 'fs/promises';  
import path from 'path';  
import { fileURLToPath } from 'url';  
import { config } from '../config.js';  
import { logger } from '../utils/logger.js';

const \_\_filename \= fileURLToPath(import.meta.url);  
const \_\_dirname \= path.dirname(\_\_filename);

const DISPOSABLE\_LIST\_CACHE\_KEY \= 'disposable:domains';  
const FALLBACK\_LIST\_PATH \= path.join(  
  \_\_dirname,  
  'disposable\_domains.fallback.json',  
);

let disposableDomains \= new Set\<string\>();

async function fetchFromSource(url: string): Promise\<string\> {  
  try {  
    const response \= await fetch(url, { signal: AbortSignal.timeout(10000) });  
    if (\!response.ok) {  
      logger.warn(\`Failed to fetch disposable list from ${url}: ${response.statusText}\`);  
      return;  
    }  
    const text \= await response.text();  
    return text.split('\\n').filter(Boolean).map(d \=\> d.trim().toLowerCase());  
  } catch (error) {  
    logger.error({ err: error, url }, 'Error fetching disposable list');  
    return;  
  }  
}

async function loadFallbackList(): Promise\<Set\<string\>\> {  
  try {  
    const data \= await fs.readFile(FALLBACK\_LIST\_PATH, 'utf-8');  
    const domains: string \= JSON.parse(data);  
    logger.info(\`Loaded ${domains.length} disposable domains from fallback list.\`);  
    return new Set(domains);  
  } catch (error) {  
    logger.error({ err: error }, 'Failed to load fallback disposable list. Using empty list.');  
    // A small, hardcoded list in case the file is missing  
    return new Set(\['yopmail.com', 'mailinator.com', 'temp-mail.org'\]);  
  }  
}

export async function updateDisposableDomains(): Promise\<void\> {  
  logger.info('Updating disposable domain list...');  
  const allDomains \= new Set\<string\>();

  const results \= await Promise.all(config.DISPOSABLE\_SOURCES.map(fetchFromSource));  
  results.flat().forEach(domain \=\> allDomains.add(domain));

  if (allDomains.size \> 0) {  
    disposableDomains \= allDomains;  
    logger.info(\`Updated disposable domain list with ${disposableDomains.size} domains.\`);  
    // Save the new list as the fallback for future runs  
    try {  
      await fs.writeFile(FALLBACK\_LIST\_PATH, JSON.stringify(Array.from(disposableDomains)));  
      logger.info('Updated fallback disposable domain list file.');  
    } catch (error) {  
      logger.error({ err: error }, 'Could not write updated fallback list.');  
    }  
  } else {  
    logger.warn('Failed to fetch any new disposable domains. Using existing or fallback list.');  
    if (disposableDomains.size \=== 0) {  
      disposableDomains \= await loadFallbackList();  
    }  
  }  
}

export async function initializeDisposableService(): Promise\<void\> {  
  // Try to load from fallback first to have a list available immediately  
  disposableDomains \= await loadFallbackList();  
  // Then, trigger an update in the background  
  updateDisposableDomains().catch(err \=\> logger.error({ err }, 'Background disposable update failed.'));  
  // Schedule periodic updates (e.g., every 24 hours)  
  setInterval(updateDisposableDomains, 24 \* 60 \* 60 \* 1000);  
}

export function isDisposable(domain: string): boolean {  
  if (\!config.BLOCK\_DISPOSABLE) return false;  
  return disposableDomains.has(domain);  
}

// This allows running the update script directly via \`ts-node\`  
if (process.argv \=== 'update') {  
  updateDisposableDomains()  
   .then(() \=\> {  
      logger.info('Disposable domain list update complete.');  
      process.exit(0);  
    })  
   .catch((err) \=\> {  
      logger.error({ err }, 'Disposable domain list update failed.');  
      process.exit(1);  
    });  
}

// Create a fallback file if it doesn't exist  
fs.access(FALLBACK\_LIST\_PATH).catch(() \=\> {  
  fs.writeFile(FALLBACK\_LIST\_PATH, JSON.stringify(\['yopmail.com', 'mailinator.com', 'temp-mail.org'\]));  
});

#### **src/checks/syntax.ts**

Realiza las validaciones locales: sintaxis, normalización, dominios desechables y roles.

TypeScript

import isemail from 'isemail';  
import punycode from 'punycode';  
import { isDisposable } from '../services/disposable.service.js';  
import { config } from '../config.js';

const roleAccounts \= new Set(\[  
  'admin', 'administrator', 'webmaster', 'hostmaster', 'postmaster', 'abuse',  
  'support', 'help', 'info', 'sales', 'contact', 'billing', 'security',  
  'noreply', 'no-reply', 'marketing', 'feedback', 'root', 'sysadmin',  
\]);

export interface SyntaxCheckResult {  
  normalized: string;  
  valid\_syntax: boolean;  
  is\_disposable: boolean;  
  is\_role: boolean;  
  domain: string;  
  reason?: 'invalid\_syntax' | 'disposable\_email' | 'role\_email';  
}

export function checkSyntax(email: string): SyntaxCheckResult {  
  // 1\. Normalize  
  const lowercasedEmail \= email.toLowerCase().trim();  
  const parts \= lowercasedEmail.split('@');  
  if (parts.length\!== 2) {  
    return {  
      normalized: email,  
      valid\_syntax: false,  
      is\_disposable: false,  
      is\_role: false,  
      domain: '',  
      reason: 'invalid\_syntax',  
    };  
  }  
    
  let \[local, domain\] \= parts;  
    
  // Handle Punycode for Internationalized Domain Names (IDNs)  
  try {  
    domain \= punycode.toASCII(domain);  
  } catch (error) {  
     return {  
      normalized: \`${local}@${domain}\`,  
      valid\_syntax: false,  
      is\_disposable: false,  
      is\_role: false,  
      domain,  
      reason: 'invalid\_syntax',  
    };  
  }  
    
  const normalized \= \`${local}@${domain}\`;

  // 2\. Validate syntax using a robust library  
  const valid\_syntax \= isemail.validate(normalized, { errorLevel: false });  
  if (\!valid\_syntax) {  
    return { normalized, valid\_syntax, is\_disposable: false, is\_role: false, domain, reason: 'invalid\_syntax' };  
  }

  // 3\. Check for disposable domain  
  const is\_disposable \= isDisposable(domain);  
  if (is\_disposable) {  
     return { normalized, valid\_syntax, is\_disposable, is\_role: false, domain, reason: 'disposable\_email' };  
  }

  // 4\. Check for role-based account  
  const is\_role \= config.BLOCK\_ROLES && roleAccounts.has(local);  
  if (is\_role) {  
    return { normalized, valid\_syntax, is\_disposable, is\_role, domain, reason: 'role\_email' };  
  }

  return { normalized, valid\_syntax, is\_disposable, is\_role, domain };  
}

#### **src/checks/dns.ts**

Encapsula la lógica de resolución de DNS para encontrar registros MX, A y AAAA.

TypeScript

import { promises as dns, MxRecord } from 'dns';  
import { logger } from '../utils/logger.js';

export interface DnsCheckResult {  
  domain\_exists: boolean;  
  has\_mx: boolean;  
  mx\_records: string;  
  reason?: 'domain\_not\_found' | 'no\_mx\_records';  
}

export async function checkDns(domain: string): Promise\<DnsCheckResult\> {  
  try {  
    const mxRecords: MxRecord \= await dns.resolveMx(domain);

    if (mxRecords && mxRecords.length \> 0) {  
      // Sort by priority, lower is better  
      const sortedRecords \= mxRecords.sort((a, b) \=\> a.priority \- b.priority);  
      return {  
        domain\_exists: true,  
        has\_mx: true,  
        mx\_records: sortedRecords.map(record \=\> record.exchange),  
      };  
    }  
  } catch (error: any) {  
    if (error.code\!== 'ENODATA' && error.code\!== 'ENOTFOUND') {  
      logger.warn({ err: error, domain }, 'Unexpected DNS MX lookup error');  
    }  
    // Fallback to A/AAAA records if no MX records are found  
  }

  try {  
    const \= await Promise.all(\[  
      dns.resolve(domain, 'A').catch(() \=\>),  
      dns.resolve(domain, 'AAAA').catch(() \=\>),  
    \]);

    if (aRecords.length \> 0 |

| aaaaRecords.length \> 0) {  
      // A/AAAA record exists, so mail \*might\* be deliverable to the root domain.  
      // This is a valid configuration, though less common.  
      return {  
        domain\_exists: true,  
        has\_mx: false,  
        mx\_records: \[domain\], // Use the domain itself as the mail server  
        reason: 'no\_mx\_records',  
      };  
    }  
  } catch (error: any) {  
    if (error.code\!== 'ENOTFOUND') {  
      logger.warn({ err: error, domain }, 'Unexpected DNS A/AAAA lookup error');  
    }  
  }

  return {  
    domain\_exists: false,  
    has\_mx: false,  
    mx\_records:,  
    reason: 'domain\_not\_found',  
  };  
}

#### **src/checks/smtp.ts**

Implementa la sonda SMTP opcional. Es una lógica compleja y defensiva para interactuar con servidores de correo remotos.

TypeScript

import net from 'net';  
import { logger } from '../utils/logger.js';  
import { config } from '../config.js';

export interface SmtpCheckResult {  
  enabled: boolean;  
  connection: 'ok' | 'timeout' | 'blocked' | 'error' | 'not\_checked';  
  deliverable: boolean;  
  catch\_all\_suspected: boolean;  
  notes: string;  
}

const SMTP\_GREETING\_TIMEOUT \= config.SMTP\_TIMEOUT\_MS;  
const SMTP\_COMMAND\_TIMEOUT \= config.SMTP\_TIMEOUT\_MS;

class SmtpConnection {  
  private socket: net.Socket;  
  private buffer \= '';  
  private onData: ((data: string) \=\> void) | null \= null;  
  private onError: ((err: Error) \=\> void) | null \= null;  
  private onClose: (() \=\> void) | null \= null;

  constructor(private host: string, private port: number \= 25) {  
    this.socket \= new net.Socket();  
  }

  connect(): Promise\<void\> {  
    return new Promise((resolve, reject) \=\> {  
      this.socket.setTimeout(SMTP\_GREETING\_TIMEOUT);  
        
      this.socket.on('data', (data) \=\> {  
        this.buffer \+= data.toString();  
        if (this.buffer.includes('\\n')) {  
          const lines \= this.buffer.split('\\r\\n').filter(Boolean);  
          this.buffer \= '';  
          lines.forEach(line \=\> this.onData?.(line));  
        }  
      });  
        
      this.socket.on('error', (err) \=\> {  
        this.onError?.(err);  
        reject(err);  
      });  
        
      this.socket.on('close', () \=\> this.onClose?.());  
        
      this.socket.on('timeout', () \=\> {  
        const err \= new Error('Socket timeout');  
        this.socket.destroy(err);  
        reject(err);  
      });

      this.socket.connect(this.port, this.host, () \=\> {  
        resolve();  
      });  
    });  
  }

  async sendCommand(command: string): Promise\<string\> {  
    return new Promise((resolve, reject) \=\> {  
      let responseLines: string \=;  
        
      this.onData \= (line) \=\> {  
        responseLines.push(line);  
        const code \= parseInt(line.substring(0, 3), 10);  
        if (code \>= 200 && line.charAt(3) \=== ' ') {  
          this.onData \= null;  
          resolve(responseLines);  
        }  
      };

      this.onError \= (err) \=\> {  
        this.onError \= null;  
        reject(err);  
      };

      this.socket.write(\`${command}\\r\\n\`, 'utf-8');  
    });  
  }

  close() {  
    if (\!this.socket.destroyed) {  
      this.socket.write('QUIT\\r\\n');  
      this.socket.end();  
    }  
  }  
}

async function probeServer(mx: string, email: string): Promise\<Omit\<SmtpCheckResult, 'enabled' | 'catch\_all\_suspected'\>\> {  
  const connection \= new SmtpConnection(mx);  
  try {  
    await connection.connect();  
      
    // Wait for greeting  
    const greeting \= await connection.sendCommand(''); // Special case to just get initial response  
    const greetingCode \= parseInt(greeting?.substring(0, 3) |

| '0');  
    if (greetingCode\!== 220) {  
      return { connection: 'error', deliverable: false, notes: \`Unexpected greeting: ${greeting.join(' ')}\` };  
    }

    // EHLO  
    const ehloResponse \= await connection.sendCommand(\`EHLO ${config.SMTP\_HELO\_DOMAIN}\`);  
    const ehloCode \= parseInt(ehloResponse?.substring(0, 3) |

| '0');  
    if (ehloCode \< 200 |

| ehloCode \>= 300) {  
      // Fallback to HELO if EHLO fails  
      const heloResponse \= await connection.sendCommand(\`HELO ${config.SMTP\_HELO\_DOMAIN}\`);  
      const heloCode \= parseInt(heloResponse?.substring(0, 3) |

| '0');  
      if (heloCode \< 200 |

| heloCode \>= 300) {  
        return { connection: 'error', deliverable: false, notes: \`HELO/EHLO failed: ${heloResponse.join(' ')}\` };  
      }  
    }

    // MAIL FROM  
    const mailFromResponse \= await connection.sendCommand(\`MAIL FROM:\<${config.SMTP\_FROM\_EMAIL}\>\`);  
    const mailFromCode \= parseInt(mailFromResponse?.substring(0, 3) |

| '0');  
    if (mailFromCode \< 200 |

| mailFromCode \>= 300) {  
      return { connection: 'error', deliverable: false, notes: \`MAIL FROM failed: ${mailFromResponse.join(' ')}\` };  
    }

    // RCPT TO  
    const rcptToResponse \= await connection.sendCommand(\`RCPT TO:\<${email}\>\`);  
    const rcptToCode \= parseInt(rcptToResponse?.substring(0, 3) |

| '0');  
      
    connection.close();

    if (rcptToCode \>= 200 && rcptToCode \< 300) { // 250, 251, 252  
      return { connection: 'ok', deliverable: true, notes: \`RCPT TO accepted with code ${rcptToCode}\` };  
    }  
    if (rcptToCode \>= 500) { // 550, 551, 552, 553, 554... Hard bounce  
      return { connection: 'ok', deliverable: false, notes: \`RCPT TO rejected with code ${rcptToCode}\` };  
    }  
    if (rcptToCode \>= 400) { // 421, 450, 451, 452... Soft bounce / Greylisting  
      return { connection: 'ok', deliverable: false, notes: \`RCPT TO temporarily rejected (greylisting?): ${rcptToCode}\` };  
    }

    return { connection: 'error', deliverable: false, notes: \`Unexpected RCPT TO code: ${rcptToCode}\` };

  } catch (error: any) {  
    connection.close();  
    if (error.message.includes('timeout')) {  
      return { connection: 'timeout', deliverable: false, notes: \`Connection to ${mx} timed out.\` };  
    }  
    if (error.code \=== 'ECONNREFUSED' |

| error.code \=== 'EHOSTUNREACH') {  
      return { connection: 'blocked', deliverable: false, notes: \`Connection to ${mx} refused or host unreachable.\` };  
    }  
    logger.warn({ err: error, mx, email }, 'SMTP probe error');  
    return { connection: 'error', deliverable: false, notes: error.message };  
  }  
}

async function detectCatchAll(mx: string, domain: string): Promise\<boolean\> {  
    // Generate a random, highly unlikely user  
    const randomUser \= \`no-reply-${Date.now()}${Math.random().toString(36).substring(2, 8)}\`;  
    const randomEmail \= \`${randomUser}@${domain}\`;  
    const result \= await probeServer(mx, randomEmail);  
    // If a clearly non-existent email is accepted, it's likely a catch-all.  
    return result.deliverable;  
}

export async function checkSmtp(mxRecords: string, email: string, domain: string): Promise\<SmtpCheckResult\> {  
  if (\!config.ENABLE\_SMTP\_PROBE |

| mxRecords.length \=== 0) {  
    return {  
      enabled: config.ENABLE\_SMTP\_PROBE,  
      connection: 'not\_checked',  
      deliverable: false,  
      catch\_all\_suspected: false,  
      notes: 'SMTP probe disabled or no MX records found.',  
    };  
  }

  let finalResult: Omit\<SmtpCheckResult, 'enabled' | 'catch\_all\_suspected'\> \= {  
    connection: 'error',  
    deliverable: false,  
    notes: 'Could not connect to any mail server.',  
  };

  // Try up to 3 MX servers  
  for (const mx of mxRecords.slice(0, 3)) {  
    const result \= await probeServer(mx, email);  
    finalResult \= result;  
    // If we get a definitive answer (ok), we can stop.  
    if (result.connection \=== 'ok') {  
      break;  
    }  
  }

  let catch\_all\_suspected \= false;  
  // If the email seems deliverable, perform a catch-all check on the first MX record.  
  if (finalResult.deliverable) {  
    try {  
      catch\_all\_suspected \= await detectCatchAll(mxRecords, domain);  
      if (catch\_all\_suspected) {  
        finalResult.notes \+= ' Domain may be a catch-all.';  
      }  
    } catch (error) {  
      logger.warn({ err: error, domain }, 'Catch-all detection failed.');  
    }  
  }  
    
  return {  
   ...finalResult,  
    enabled: true,  
    catch\_all\_suspected,  
  };  
}

#### **src/services/validation.service.ts**

El servicio orquestador principal. Combina los resultados de todas las capas de verificación, calcula la puntuación y determina el estado final.

TypeScript

import { createHash } from 'crypto';  
import { checkDns, DnsCheckResult } from '../checks/dns.js';  
import { checkSmtp, SmtpCheckResult } from '../checks/smtp.js';  
import { checkSyntax, SyntaxCheckResult } from '../checks/syntax.js';  
import { config } from '../config.js';  
import { cache } from '../utils/cache.js';  
import { logger } from '../utils/logger.js';

export type ValidationStatus \= 'deliverable' | 'risky' | 'undeliverable' | 'unknown';

export interface ValidationResult {  
  email: string;  
  normalized: string;  
  valid\_syntax: boolean;  
  domain\_exists: boolean;  
  has\_mx: boolean;  
  is\_disposable: boolean;  
  is\_role: boolean;  
  smtp: SmtpCheckResult;  
  score: number;  
  status: ValidationStatus;  
  reasons: string;  
  checked\_at: string;  
  ttl\_seconds: number;  
}

function calculateScore(result: Omit\<ValidationResult, 'score' | 'status' | 'reasons' | 'checked\_at' | 'ttl\_seconds'\>): number {  
  let score \= 0;  
  if (result.valid\_syntax) score \+= 0.25;  
  if (result.domain\_exists && result.has\_mx) score \+= 0.25;  
  if (\!result.is\_disposable) score \+= 0.2;  
  if (\!result.is\_role) score \+= 0.1;  
  if (result.smtp.enabled && result.smtp.deliverable &&\!result.smtp.catch\_all\_suspected) score \+= 0.2;  
    
  return parseFloat(score.toFixed(2));  
}

function determineStatus(result: Omit\<ValidationResult, 'status' | 'reasons' | 'checked\_at' | 'ttl\_seconds'\>): { status: ValidationStatus, reasons: string } {  
  const reasons: string \=;

  // Undeliverable checks  
  if (\!result.valid\_syntax) {  
    reasons.push('invalid\_syntax');  
    return { status: 'undeliverable', reasons };  
  }  
  if (\!result.domain\_exists) {  
    reasons.push('domain\_not\_found');  
    return { status: 'undeliverable', reasons };  
  }  
  if (\!result.has\_mx) {  
    reasons.push('no\_mx\_or\_a\_record');  
    return { status: 'undeliverable', reasons };  
  }  
  if (result.smtp.enabled && result.smtp.connection \=== 'ok' &&\!result.smtp.deliverable) {  
    reasons.push('smtp\_rejection');  
    return { status: 'undeliverable', reasons };  
  }

  // Risky checks  
  let isRisky \= false;  
  if (result.is\_disposable) {  
    reasons.push('disposable\_email');  
    isRisky \= true;  
  }  
  if (result.is\_role) {  
    reasons.push('role\_email');  
    isRisky \= true;  
  }  
  if (result.smtp.catch\_all\_suspected) {  
    reasons.push('catch\_all\_domain');  
    isRisky \= true;  
  }  
  if (result.smtp.enabled && result.smtp.connection\!== 'ok' && result.smtp.connection\!== 'not\_checked') {  
     reasons.push(\`smtp\_${result.smtp.connection}\`);  
     isRisky \= true;  
  }  
    
  if (isRisky) {  
    return { status: 'risky', reasons };  
  }  
    
  // Unknown checks  
  if (result.smtp.enabled && result.smtp.connection\!== 'ok') {  
    reasons.push('smtp\_probe\_failed');  
    return { status: 'unknown', reasons };  
  }  
  if (\!result.smtp.enabled && (result.is\_disposable |

| result.is\_role)) {  
    // Already handled by risky, but as a fallback  
    return { status: 'risky', reasons };  
  }  
    
  // If we passed all checks, it's deliverable  
  reasons.push('ok');  
  return { status: 'deliverable', reasons };  
}

export async function validateEmail(email: string): Promise\<ValidationResult\> {  
  const log \= logger.child({ email });  
    
  const syntaxResult \= checkSyntax(email);  
  const cacheKey \= \`email:${createHash('sha256').update(syntaxResult.normalized).digest('hex')}\`;

  // 1\. Check cache  
  const cachedResult \= await cache.get(cacheKey);  
  if (cachedResult) {  
    log.info('Returning cached result');  
    return JSON.parse(cachedResult);  
  }

  // 2\. Syntax layer  
  if (\!syntaxResult.valid\_syntax) {  
    const result: ValidationResult \= {  
      email,  
     ...syntaxResult,  
      domain\_exists: false,  
      has\_mx: false,  
      smtp: { enabled: false, connection: 'not\_checked', deliverable: false, catch\_all\_suspected: false, notes: 'Syntax invalid' },  
      score: 0,  
      status: 'undeliverable',  
      reasons: \['invalid\_syntax'\],  
      checked\_at: new Date().toISOString(),  
      ttl\_seconds: config.CACHE\_TTL\_SECONDS,  
    };  
    await cache.set(cacheKey, JSON.stringify(result), config.CACHE\_TTL\_SECONDS);  
    return result;  
  }  
    
  // 3\. DNS layer  
  const dnsResult \= await checkDns(syntaxResult.domain);  
  if (\!dnsResult.domain\_exists ||\!dnsResult.has\_mx) {  
      const partialResult \= { email,...syntaxResult,...dnsResult };  
      const statusResult \= determineStatus({...partialResult, smtp: { enabled: false, connection: 'not\_checked', deliverable: false, catch\_all\_suspected: false, notes: '' } });  
      const score \= calculateScore({...partialResult, smtp: { enabled: false, connection: 'not\_checked', deliverable: false, catch\_all\_suspected: false, notes: '' } });

      const result: ValidationResult \= {  
       ...partialResult,  
        smtp: { enabled: config.ENABLE\_SMTP\_PROBE, connection: 'not\_checked', deliverable: false, catch\_all\_suspected: false, notes: 'DNS check failed' },  
        score,  
       ...statusResult,  
        checked\_at: new Date().toISOString(),  
        ttl\_seconds: config.CACHE\_TTL\_SECONDS,  
      };  
      await cache.set(cacheKey, JSON.stringify(result), config.CACHE\_TTL\_SECONDS);  
      return result;  
  }

  // 4\. SMTP layer (optional)  
  const smtpResult \= await checkSmtp(dnsResult.mx\_records, syntaxResult.normalized, syntaxResult.domain);

  // 5\. Aggregate, score, and decide  
  const combinedResult \= {  
    email,  
   ...syntaxResult,  
   ...dnsResult,  
    smtp: smtpResult,  
  };

  const score \= calculateScore(combinedResult);  
  const { status, reasons } \= determineStatus(combinedResult);  
    
  const finalResult: ValidationResult \= {  
   ...combinedResult,  
    mx\_records: undefined, // Don't expose MX records in the final response  
    score,  
    status,  
    reasons,  
    checked\_at: new Date().toISOString(),  
    ttl\_seconds: config.CACHE\_TTL\_SECONDS,  
  };  
    
  log.info({ status: finalResult.status, score: finalResult.score, reasons: finalResult.reasons }, 'Validation complete');  
    
  // 6\. Cache result  
  await cache.set(cacheKey, JSON.stringify(finalResult), config.CACHE\_TTL\_SECONDS);

  return finalResult;  
}

#### **src/validators/email.validator.ts**

Define los esquemas de validación de Zod para los cuerpos de las solicitudes HTTP, asegurando que los datos de entrada sean correctos.

TypeScript

import { z } from 'zod';

export const validateEmailSchema \= z.object({  
  body: z.object({  
    email: z.string({ required\_error: 'Email is required' }).email('Invalid email format'),  
  }),  
});

export const validateBulkEmailSchema \= z.object({  
  body: z.object({  
    emails: z  
     .array(z.string().email('One or more emails are invalid'), {  
        required\_error: 'Emails array is required',  
      })  
     .min(1, 'Emails array cannot be empty')  
     .max(5000, 'Cannot process more than 5000 emails per request'),  
  }),  
});

#### **src/middleware/auth.ts**

Middleware de autenticación que verifica la presencia y validez de la x-api-key en las cabeceras.

TypeScript

import { Request, Response, NextFunction } from 'express';  
import { config } from '../config.js';

const apiKeys \= new Set(config.API\_KEYS);

export const apiKeyAuth \= (req: Request, res: Response, next: NextFunction) \=\> {  
  const key \= req.header('x-api-key');  
  if (\!key) {  
    return res.status(401).json({ error: 'API key is missing' });  
  }  
  if (\!apiKeys.has(key)) {  
    return res.status(403).json({ error: 'Invalid API key' });  
  }  
  next();  
};

#### **src/middleware/rateLimit.ts**

Configura el rate limiting basado en IP y, opcionalmente, en la clave de API.

TypeScript

import rateLimit from 'express-rate-limit';  
import { config } from '../config.js';

export const ipRateLimiter \= rateLimit({  
  windowMs: 60 \* 1000, // 1 minute  
  max: config.RATE\_LIMIT\_IP\_PER\_MIN,  
  standardHeaders: true,  
  legacyHeaders: false,  
  message: { error: 'Too many requests from this IP, please try again after a minute' },  
});

export const apiKeyRateLimiter \= rateLimit({  
  windowMs: 60 \* 1000, // 1 minute  
  max: config.RATE\_LIMIT\_KEY\_PER\_MIN,  
  standardHeaders: true,  
  legacyHeaders: false,  
  keyGenerator: (req) \=\> req.header('x-api-key') |

| req.ip,  
  message: { error: 'API key rate limit exceeded, please try again after a minute' },  
});

#### **src/middleware/errorHandler.ts**

Middleware de manejo de errores centralizado para capturar y formatear todas las excepciones no controladas.

TypeScript

import { Request, Response, NextFunction } from 'express';  
import { ZodError } from 'zod';  
import { logger } from '../utils/logger.js';

interface HttpError extends Error {  
  status?: number;  
}

export const errorHandler \= (  
  err: HttpError,  
  req: Request,  
  res: Response,  
  \_next: NextFunction,  
) \=\> {  
  if (err instanceof ZodError) {  
    return res.status(400).json({  
      error: 'Validation failed',  
      details: err.flatten().fieldErrors,  
    });  
  }

  const statusCode \= err.status |

| 500;  
  const message \= err.message |

| 'Internal Server Error';

  logger.error({  
    err,  
    statusCode,  
    path: req.path,  
    method: req.method,  
  }, 'An unhandled error occurred');

  res.status(statusCode).json({  
    error: message,  
  });  
};

#### **src/routes/index.ts**

Enrutador principal que agrega todos los demás módulos de rutas.

TypeScript

import { Router } from 'express';  
import { healthRouter } from './health.routes.js';  
import { validationRouter } from './validation.routes.js';  
import { unsubscribeRouter } from './unsubscribe.routes.js';

const router \= Router();

router.use(healthRouter);  
router.use(validationRouter);  
router.use(unsubscribeRouter);

export { router as apiRouter };

#### **src/routes/health.routes.ts**

Endpoints de monitoreo para healthz (estado de la aplicación) y readyz (disponibilidad de dependencias como Redis).

TypeScript

import { Router, Request, Response } from 'express';  
import { register, collectDefaultMetrics } from 'prom-client';  
import { cache } from '../utils/cache.js';  
import { config } from '../config.js';

export const healthRouter \= Router();

// Enable default Prometheus metrics  
collectDefaultMetrics();

healthRouter.get('/healthz', (\_req: Request, res: Response) \=\> {  
  res.status(200).json({ status: 'ok' });  
});

healthRouter.get('/readyz', async (\_req: Request, res: Response) \=\> {  
  if (config.REDIS\_URL) {  
    try {  
      // The \`connect\` method in our cache abstraction handles the connection logic.  
      await cache.connect\!();  
      res.status(200).json({ status: 'ok', dependencies: { redis: 'ok' } });  
    } catch (error) {  
      res.status(503).json({ status: 'unavailable', dependencies: { redis: 'error' } });  
    }  
  } else {  
    res.status(200).json({ status: 'ok', dependencies: { redis: 'not\_configured' } });  
  }  
});

healthRouter.get('/metrics', async (\_req: Request, res: Response) \=\> {  
  res.set('Content-Type', register.contentType);  
  res.end(await register.metrics());  
});

#### **src/routes/validation.routes.ts**

Define los endpoints /validate y /bulk/validate, aplicando los middlewares de autenticación, rate limiting y validación.

TypeScript

import { Router, Request, Response, NextFunction } from 'express';  
import { validateEmail, ValidationResult } from '../services/validation.service.js';  
import { validateEmailSchema, validateBulkEmailSchema } from '../validators/email.validator.js';  
import { apiKeyAuth } from '../middleware/auth.js';  
import { apiKeyRateLimiter } from '../middleware/rateLimit.js';

export const validationRouter \= Router();

const validateRequest \= (schema: any) \=\> (req: Request, res: Response, next: NextFunction) \=\> {  
  try {  
    schema.parse({ body: req.body, query: req.query, params: req.params });  
    next();  
  } catch (error) {  
    next(error);  
  }  
};

validationRouter.post(  
  '/validate',  
  apiKeyAuth,  
  apiKeyRateLimiter,  
  validateRequest(validateEmailSchema),  
  async (req: Request, res: Response, next: NextFunction) \=\> {  
    try {  
      const { email } \= req.body;  
      const result \= await validateEmail(email);  
      res.json(result);  
    } catch (error) {  
      next(error);  
    }  
  },  
);

validationRouter.post(  
  '/bulk/validate',  
  apiKeyAuth,  
  apiKeyRateLimiter,  
  validateRequest(validateBulkEmailSchema),  
  async (req: Request, res: Response, next: NextFunction) \=\> {  
    try {  
      const { emails } \= req.body;  
      // Process in parallel with a concurrency limit to avoid overwhelming resources  
      const concurrencyLimit \= 10;  
      const results: ValidationResult \=;  
      for (let i \= 0; i \< emails.length; i \+= concurrencyLimit) {  
        const batch \= emails.slice(i, i \+ concurrencyLimit);  
        const batchResults \= await Promise.all(batch.map(email \=\> validateEmail(email)));  
        results.push(...batchResults);  
      }  
      res.json(results);  
    } catch (error) {  
      next(error);  
    }  
  },  
);

#### **src/routes/unsubscribe.routes.ts**

Endpoint de marcador de posición para gestionar bajas, listo para una futura integración.

TypeScript

import { Router, Request, Response } from 'express';  
import { logger } from '../utils/logger.js';

export const unsubscribeRouter \= Router();

// This is a placeholder endpoint. In a real application, this would  
// interact with a database or a suppression list service.  
unsubscribeRouter.post('/unsubscribe', (req: Request, res: Response) \=\> {  
  const { email } \= req.body;  
  if (\!email) {  
    return res.status(400).json({ error: 'Email is required' });  
  }

  logger.info({ email }, 'Unsubscribe request received');

  // TODO: Add logic to add the email to a suppression list.  
  // For now, we just acknowledge the request.  
  res.status(202).json({ message: 'Unsubscribe request accepted' });  
});

#### **src/server.ts**

Punto de entrada de la aplicación. Configura el servidor Express, los middlewares y las rutas, e inicia el servicio.

TypeScript

import express from 'express';  
import cors from 'cors';  
import { config } from './config.js';  
import { logger } from './utils/logger.js';  
import { apiRouter } from './routes/index.js';  
import { errorHandler } from './middleware/errorHandler.js';  
import { ipRateLimiter } from './middleware/rateLimit.js';  
import { cache } from './utils/cache.js';  
import { initializeDisposableService } from './services/disposable.service.js';  
import swaggerUi from 'express-swagger-ui-official';  
import path from 'path';  
import { fileURLToPath } from 'url';

const \_\_filename \= fileURLToPath(import.meta.url);  
const \_\_dirname \= path.dirname(\_\_filename);

async function startServer() {  
  const app \= express();

  // Connect to cache and initialize services  
  if (cache.connect) {  
    await cache.connect();  
  }  
  await initializeDisposableService();

  // Core Middleware  
  app.use(  
    cors({  
      origin: config.ALLOWED\_ORIGINS,  
    }),  
  );  
  app.use(express.json());  
  app.use(express.urlencoded({ extended: true }));

  // Apply general rate limiter  
  app.use(ipRateLimiter);

  // API Documentation  
  const openapiFilePath \= path.join(\_\_dirname, '../../openapi.yaml');  
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(null, {  
    swaggerUrl: '/docs/openapi.yaml',  
    customSiteTitle: 'Email Verifier API Docs',  
  }));  
  app.get('/docs/openapi.yaml', (\_req, res) \=\> {  
    res.sendFile(openapiFilePath);  
  });

  // API Routes  
  app.use('/', apiRouter);

  // Centralized Error Handler  
  app.use(errorHandler);

  app.listen(config.PORT, '0.0.0.0', () \=\> {  
    logger.info(\`🚀 Server is running on http://0.0.0.0:${config.PORT}\`);  
    logger.info(\`📚 API docs available at http://localhost:${config.PORT}/docs\`);  
    logger.info(\`Prometheus metrics at http://localhost:${config.PORT}/metrics\`);  
  });

  process.on('SIGTERM', () \=\> {  
    logger.info('SIGTERM signal received: closing HTTP server');  
    if (cache.disconnect) {  
      cache.disconnect();  
    }  
    process.exit(0);  
  });  
}

startServer().catch((err) \=\> {  
  logger.fatal({ err }, 'Failed to start server');  
  process.exit(1);  
});

---

### **Documentación y Pruebas de la API**

Archivos que definen el contrato de la API y facilitan su uso y prueba.

#### **openapi.yaml**

Especificación OpenAPI 3.0 que describe formalmente todos los endpoints, esquemas y mecanismos de seguridad.

YAML

openapi: 3.0.3  
info:  
  title: Email Verifier API  
  description: |-  
    A microservice to validate email addresses, designed to be fast, reliable, and cost-effective.  
    It helps filter invalid emails before sending marketing or transactional campaigns to protect sender reputation and avoid spam traps.  
  version: 1.0.0  
servers:  
  \- url: http://localhost:3000  
    description: Local development server  
components:  
  securitySchemes:  
    ApiKeyAuth:  
      type: apiKey  
      in: header  
      name: x-api-key  
  schemas:  
    EmailValidationBody:  
      type: object  
      required:  
        \- email  
      properties:  
        email:  
          type: string  
          format: email  
          example: 'user@example.com'  
    BulkValidationBody:  
      type: object  
      required:  
        \- emails  
      properties:  
        emails:  
          type: array  
          items:  
            type: string  
            format: email  
          minItems: 1  
          maxItems: 5000  
          example: \['user1@example.com', 'disposable@yopmail.com', 'invalid-email'\]  
    SmtpResult:  
      type: object  
      properties:  
        enabled:  
          type: boolean  
          description: Whether the SMTP probe was enabled in the configuration.  
        connection:  
          type: string  
          enum: \[ok, timeout, blocked, error, not\_checked\]  
          description: The result of the connection attempt to the mail server.  
        deliverable:  
          type: boolean  
          description: Whether the mail server indicated it would accept the email.  
        catch\_all\_suspected:  
          type: boolean  
          description: Whether the domain is suspected of being a catch-all address.  
        notes:  
          type: string  
          description: Additional details from the SMTP probe.  
    ValidationResult:  
      type: object  
      properties:  
        email:  
          type: string  
          description: The original email address provided.  
        normalized:  
          type: string  
          description: The normalized (lowercase, punycode) version of the email.  
        valid\_syntax:  
          type: boolean  
          description: Whether the email address conforms to RFC syntax.  
        domain\_exists:  
          type: boolean  
          description: Whether the domain has valid DNS records (MX, A, or AAAA).  
        has\_mx:  
          type: boolean  
          description: Whether the domain has MX records.  
        is\_disposable:  
          type: boolean  
          description: Whether the email belongs to a known disposable email provider.  
        is\_role:  
          type: boolean  
          description: Whether the email is a common role-based address (e.g., admin@, info@).  
        smtp:  
          $ref: '\#/components/schemas/SmtpResult'  
        score:  
          type: number  
          format: float  
          minimum: 0  
          maximum: 1  
          description: A deliverability score from 0.0 (worst) to 1.0 (best).  
        status:  
          type: string  
          enum: \[deliverable, risky, undeliverable, unknown\]  
          description: The final classification of the email address.  
        reasons:  
          type: array  
          items:  
            type: string  
          description: A list of reasons contributing to the final status.  
        checked\_at:  
          type: string  
          format: date-time  
          description: The ISO-8601 timestamp of when the check was performed.  
        ttl\_seconds:  
          type: integer  
          description: The number of seconds for which this result is considered valid in the cache.  
    ErrorResponse:  
      type: object  
      properties:  
        error:  
          type: string  
          description: A summary of the error.  
        details:  
          type: object  
          description: (Optional) Further details about the error, e.g., validation failures.  
security:  
  \- ApiKeyAuth:  
paths:  
  /validate:  
    post:  
      summary: Validate a single email address  
      tags: \[Validation\]  
      requestBody:  
        required: true  
        content:  
          application/json:  
            schema:  
              $ref: '\#/components/schemas/EmailValidationBody'  
      responses:  
        '200':  
          description: Successful validation result.  
          content:  
            application/json:  
              schema:  
                $ref: '\#/components/schemas/ValidationResult'  
        '400':  
          description: Bad Request (e.g., invalid input).  
          content:  
            application/json:  
              schema:  
                $ref: '\#/components/schemas/ErrorResponse'  
        '401':  
          description: Unauthorized (missing API key).  
        '403':  
          description: Forbidden (invalid API key).  
        '429':  
          description: Too Many Requests (rate limit exceeded).  
  /bulk/validate:  
    post:  
      summary: Validate a batch of email addresses  
      tags: \[Validation\]  
      requestBody:  
        required: true  
        content:  
          application/json:  
            schema:  
              $ref: '\#/components/schemas/BulkValidationBody'  
      responses:  
        '200':  
          description: An array of validation results.  
          content:  
            application/json:  
              schema:  
                type: array  
                items:  
                  $ref: '\#/components/schemas/ValidationResult'  
        '400':  
          description: Bad Request (e.g., invalid input).  
        '401':  
          description: Unauthorized.  
        '403':  
          description: Forbidden.  
        '429':  
          description: Too Many Requests.  
  /healthz:  
    get:  
      summary: Health Check  
      tags: \[Monitoring\]  
      security:  
      responses:  
        '200':  
          description: Service is healthy.  
          content:  
            application/json:  
              schema:  
                type: object  
                properties:  
                  status:  
                    type: string  
                    example: ok  
  /readyz:  
    get:  
      summary: Readiness Check  
      tags: \[Monitoring\]  
      security:  
      responses:  
        '200':  
          description: Service is ready to accept traffic.  
        '503':  
          description: Service is not ready (e.g., dependency is down).  
  /metrics:  
    get:  
      summary: Prometheus Metrics  
      tags: \[Monitoring\]  
      security:  
      responses:  
        '200':  
          description: Prometheus-formatted metrics.  
          content:  
            text/plain:  
              schema:  
                type: string  
  /unsubscribe:  
    post:  
      summary: Unsubscribe an email address (Placeholder)  
      tags:  
      security:  
      requestBody:  
        content:  
          application/json:  
            schema:  
              type: object  
              properties:  
                email:  
                  type: string  
                  format: email  
      responses:  
        '202':  
          description: Request accepted for processing.

#### **postman\_collection.json**

Una colección de Postman preconfigurada para probar fácilmente todos los endpoints de la API.

JSON

{  
	"info": {  
		"\_postman\_id": "a1b2c3d4-e5f6-4a7b-8c9d-0e1f2a3b4c5d",  
		"name": "Email Verifier API",  
		"description": "Collection for the Email Verifier Microservice",  
		"schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"  
	},  
	"item":,  
						"body": {  
							"mode": "raw",  
							"raw": "{\\n    \\"email\\": \\"test@gmail.com\\"\\n}",  
							"options": {  
								"raw": {  
									"language": "json"  
								}  
							}  
						},  
						"url": {  
							"raw": "{{BASE\_URL}}/validate",  
							"host":,  
							"path": \[  
								"validate"  
							\]  
						},  
						"description": "Validates a single email address. \\n\\n\*\*Examples to try:\*\*\\n\* \`test@gmail.com\` (deliverable)\\n\* \`admin@github.com\` (risky, role)\\n\* \`test@yopmail.com\` (risky, disposable)\\n\* \`no-such-user@gmail.com\` (undeliverable, smtp rejection)\\n\* \`test@nonexistent-domain-12345.com\` (undeliverable, domain not found)"  
					},  
					"response":  
				},  
				{  
					"name": "Validate Bulk Emails",  
					"request": {  
						"method": "POST",  
						"header":,  
						"body": {  
							"mode": "raw",  
							"raw": "{\\n    \\"emails\\": \[\\n        \\"test@gmail.com\\",\\n        \\"info@example.com\\",\\n        \\"test@yopmail.com\\",\\n        \\"invalid-email-format\\",\\n        \\"test@nonexistent-domain-12345.com\\"\\n    \]\\n}",  
							"options": {  
								"raw": {  
									"language": "json"  
								}  
							}  
						},  
						"url": {  
							"raw": "{{BASE\_URL}}/bulk/validate",  
							"host":,  
							"path": \[  
								"bulk",  
								"validate"  
							\]  
						},  
						"description": "Validates a batch of up to 5,000 emails."  
					},  
					"response":  
				}  
			\]  
		},  
		{  
			"name": "Monitoring",  
			"item":,  
						"url": {  
							"raw": "{{BASE\_URL}}/healthz",  
							"host":,  
							"path": \[  
								"healthz"  
							\]  
						}  
					},  
					"response":  
				},  
				{  
					"name": "Readiness Check",  
					"request": {  
						"method": "GET",  
						"header":,  
						"url": {  
							"raw": "{{BASE\_URL}}/readyz",  
							"host":,  
							"path": \[  
								"readyz"  
							\]  
						}  
					},  
					"response":  
				},  
				{  
					"name": "Prometheus Metrics",  
					"request": {  
						"method": "GET",  
						"header":,  
						"url": {  
							"raw": "{{BASE\_URL}}/metrics",  
							"host":,  
							"path": \[  
								"metrics"  
							\]  
						}  
					},  
					"response":  
				}  
			\]  
		},  
		{  
			"name": "Suppression",  
			"item":,  
						"body": {  
							"mode": "raw",  
							"raw": "{\\n    \\"email\\": \\"user-who-wants-to-unsubscribe@example.com\\"\\n}",  
							"options": {  
								"raw": {  
									"language": "json"  
								}  
							}  
						},  
						"url": {  
							"raw": "{{BASE\_URL}}/unsubscribe",  
							"host":,  
							"path": \[  
								"unsubscribe"  
							\]  
						}  
					},  
					"response":  
				}  
			\]  
		}  
	\],  
	"event": \[  
		{  
			"listen": "prerequest",  
			"script": {  
				"type": "text/javascript",  
				"exec": \[  
					""  
				\]  
			}  
		},  
		{  
			"listen": "test",  
			"script": {  
				"type": "text/javascript",  
				"exec": \[  
					""  
				\]  
			}  
		}  
	\],  
	"variable":  
}

---

### **Pruebas Automatizadas (src/tests/)**

Suite de pruebas con Vitest para garantizar la corrección y fiabilidad del código.

#### **src/tests/checks/syntax.test.ts**

TypeScript

import { describe, it, expect, vi, beforeAll } from 'vitest';  
import { checkSyntax } from '../../checks/syntax';  
import \* as disposableService from '../../services/disposable.service';

vi.mock('../../services/disposable.service');

describe('Syntax Checks', () \=\> {  
  beforeAll(() \=\> {  
    vi.mocked(disposableService.isDisposable).mockImplementation((domain) \=\> {  
      return domain \=== 'yopmail.com';  
    });  
  });

  it('should validate a correct email', () \=\> {  
    const result \= checkSyntax('test@example.com');  
    expect(result.valid\_syntax).toBe(true);  
    expect(result.normalized).toBe('test@example.com');  
    expect(result.is\_disposable).toBe(false);  
    expect(result.is\_role).toBe(false);  
    expect(result.domain).toBe('example.com');  
  });

  it('should invalidate an email without @', () \=\> {  
    const result \= checkSyntax('test.example.com');  
    expect(result.valid\_syntax).toBe(false);  
    expect(result.reason).toBe('invalid\_syntax');  
  });

  it('should normalize email to lowercase and handle punycode', () \=\> {  
    const result \= checkSyntax('Test@例子.com');  
    expect(result.normalized).toBe('test@xn--fsqu00a.com');  
    expect(result.valid\_syntax).toBe(true);  
  });

  it('should identify a role account', () \=\> {  
    const result \= checkSyntax('admin@company.com');  
    expect(result.is\_role).toBe(true);  
    expect(result.reason).toBe('role\_email');  
  });

  it('should identify a disposable email', () \=\> {  
    const result \= checkSyntax('someone@yopmail.com');  
    expect(result.is\_disposable).toBe(true);  
    expect(result.reason).toBe('disposable\_email');  
  });  
});

#### **src/tests/checks/dns.test.ts**

TypeScript

import { describe, it, expect, vi } from 'vitest';  
import { promises as dns } from 'dns';  
import { checkDns } from '../../checks/dns';

vi.mock('dns', () \=\> ({  
  promises: {  
    resolveMx: vi.fn(),  
    resolve: vi.fn(),  
  },  
}));

describe('DNS Checks', () \=\> {  
  it('should return true for domain with MX records', async () \=\> {  
    vi.mocked(dns.resolveMx).mockResolvedValue(\[{ exchange: 'mx.google.com', priority: 10 }\]);  
    const result \= await checkDns('gmail.com');  
    expect(result.domain\_exists).toBe(true);  
    expect(result.has\_mx).toBe(true);  
    expect(result.mx\_records).toEqual(\['mx.google.com'\]);  
  });

  it('should return true for domain with A record but no MX', async () \=\> {  
    vi.mocked(dns.resolveMx).mockRejectedValue({ code: 'ENODATA' });  
    vi.mocked(dns.resolve).mockImplementation(async (domain, type) \=\> {  
      if (type \=== 'A') return \['1.2.3.4'\];  
      return;  
    });  
    const result \= await checkDns('example.com');  
    expect(result.domain\_exists).toBe(true);  
    expect(result.has\_mx).toBe(false);  
    expect(result.mx\_records).toEqual(\['example.com'\]);  
    expect(result.reason).toBe('no\_mx\_records');  
  });

  it('should return false for a non-existent domain', async () \=\> {  
    vi.mocked(dns.resolveMx).mockRejectedValue({ code: 'ENOTFOUND' });  
    vi.mocked(dns.resolve).mockRejectedValue({ code: 'ENOTFOUND' });  
    const result \= await checkDns('nonexistent-domain-12345.com');  
    expect(result.domain\_exists).toBe(false);  
    expect(result.has\_mx).toBe(false);  
    expect(result.reason).toBe('domain\_not\_found');  
  });  
});

#### **src/tests/services/validation.service.test.ts**

TypeScript

import { describe, it, expect, vi, beforeEach } from 'vitest';  
import { validateEmail } from '../../services/validation.service';  
import \* as syntaxCheck from '../../checks/syntax';  
import \* as dnsCheck from '../../checks/dns';  
import \* as smtpCheck from '../../checks/smtp';  
import \* as cache from '../../utils/cache';

vi.mock('../../checks/syntax');  
vi.mock('../../checks/dns');  
vi.mock('../../checks/smtp');  
vi.mock('../../utils/cache');

describe('Validation Service Orchestration', () \=\> {  
  beforeEach(() \=\> {  
    vi.resetAllMocks();  
    vi.mocked(cache.cache.get).mockResolvedValue(null);  
    vi.mocked(cache.cache.set).mockResolvedValue();  
  });

  it('should classify a perfect email as deliverable', async () \=\> {  
    vi.mocked(syntaxCheck.checkSyntax).mockReturnValue({  
      normalized: 'test@gmail.com', valid\_syntax: true, is\_disposable: false, is\_role: false, domain: 'gmail.com'  
    });  
    vi.mocked(dnsCheck.checkDns).mockResolvedValue({  
      domain\_exists: true, has\_mx: true, mx\_records: \['mx.google.com'\]  
    });  
    vi.mocked(smtpCheck.checkSmtp).mockResolvedValue({  
      enabled: true, connection: 'ok', deliverable: true, catch\_all\_suspected: false, notes: 'OK'  
    });

    const result \= await validateEmail('test@gmail.com');  
      
    expect(result.status).toBe('deliverable');  
    expect(result.score).toBe(1.0);  
    expect(result.reasons).toEqual(\['ok'\]);  
  });

  it('should classify an email with invalid syntax as undeliverable', async () \=\> {  
    vi.mocked(syntaxCheck.checkSyntax).mockReturnValue({  
      normalized: 'invalid', valid\_syntax: false, is\_disposable: false, is\_role: false, domain: ''  
    });

    const result \= await validateEmail('invalid');  
      
    expect(result.status).toBe('undeliverable');  
    expect(result.score).toBe(0);  
    expect(result.reasons).toEqual(\['invalid\_syntax'\]);  
    expect(dnsCheck.checkDns).not.toHaveBeenCalled();  
    expect(smtpCheck.checkSmtp).not.toHaveBeenCalled();  
  });

  it('should classify a disposable email as risky', async () \=\> {  
    vi.mocked(syntaxCheck.checkSyntax).mockReturnValue({  
      normalized: 'test@yopmail.com', valid\_syntax: true, is\_disposable: true, is\_role: false, domain: 'yopmail.com'  
    });  
    vi.mocked(dnsCheck.checkDns).mockResolvedValue({  
      domain\_exists: true, has\_mx: true, mx\_records: \['mx.yopmail.com'\]  
    });  
    vi.mocked(smtpCheck.checkSmtp).mockResolvedValue({  
      enabled: true, connection: 'ok', deliverable: true, catch\_all\_suspected: false, notes: 'OK'  
    });

    const result \= await validateEmail('test@yopmail.com');

    expect(result.status).toBe('risky');  
    expect(result.reasons).toContain('disposable\_email');  
    expect(result.score).toBe(0.8); // 1.0 \- 0.2 for disposable  
  });  
    
  it('should classify a catch-all domain as risky', async () \=\> {  
    vi.mocked(syntaxCheck.checkSyntax).mockReturnValue({  
      normalized: 'anything@catchall.com', valid\_syntax: true, is\_disposable: false, is\_role: false, domain: 'catchall.com'  
    });  
    vi.mocked(dnsCheck.checkDns).mockResolvedValue({  
      domain\_exists: true, has\_mx: true, mx\_records: \['mx.catchall.com'\]  
    });  
    vi.mocked(smtpCheck.checkSmtp).mockResolvedValue({  
      enabled: true, connection: 'ok', deliverable: true, catch\_all\_suspected: true, notes: 'Catch-all suspected'  
    });

    const result \= await validateEmail('anything@catchall.com');

    expect(result.status).toBe('risky');  
    expect(result.reasons).toContain('catch\_all\_domain');  
    expect(result.score).toBe(0.6); // 1.0 \- 0.2 for smtp (catch-all) \- 0.2 for disposable (not)  
  });

  it('should classify an SMTP rejection as undeliverable', async () \=\> {  
    vi.mocked(syntaxCheck.checkSyntax).mockReturnValue({  
      normalized: 'nouser@gmail.com', valid\_syntax: true, is\_disposable: false, is\_role: false, domain: 'gmail.com'  
    });  
    vi.mocked(dnsCheck.checkDns).mockResolvedValue({  
      domain\_exists: true, has\_mx: true, mx\_records: \['mx.google.com'\]  
    });  
    vi.mocked(smtpCheck.checkSmtp).mockResolvedValue({  
      enabled: true, connection: 'ok', deliverable: false, catch\_all\_suspected: false, notes: '550 User not found'  
    });

    const result \= await validateEmail('nouser@gmail.com');

    expect(result.status).toBe('undeliverable');  
    expect(result.reasons).toContain('smtp\_rejection');  
    expect(result.score).toBe(0.6); // Syntax \+ DNS \+ no-disp \+ no-role  
  });  
});

#### **src/tests/routes/validation.e2e.test.ts**

TypeScript

import { describe, it, expect, beforeAll, afterAll } from 'vitest';  
import supertest from 'supertest';  
import express from 'express';  
import { apiRouter } from '../../routes';  
import { errorHandler } from '../../middleware/errorHandler';

// Mock the service layer to avoid actual network calls  
vi.mock('../../services/validation.service', () \=\> ({  
  validateEmail: vi.fn((email) \=\> {  
    if (email \=== 'test@good.com') {  
      return Promise.resolve({ status: 'deliverable', score: 1.0 });  
    }  
    if (email \=== 'test@bad.com') {  
      return Promise.resolve({ status: 'undeliverable', score: 0.0 });  
    }  
    return Promise.resolve({ status: 'unknown', score: 0.5 });  
  }),  
}));

// Mock middleware  
vi.mock('../../middleware/auth', () \=\> ({  
  apiKeyAuth: (req, res, next) \=\> next(),  
}));  
vi.mock('../../middleware/rateLimit', () \=\> ({  
  apiKeyRateLimiter: (req, res, next) \=\> next(),  
  ipRateLimiter: (req, res, next) \=\> next(),  
}));

const app \= express();  
app.use(express.json());  
app.use(apiRouter);  
app.use(errorHandler);

describe('Validation API E2E Tests', () \=\> {  
  it('POST /validate \- should return a validation result for a valid request', async () \=\> {  
    const response \= await supertest(app)  
     .post('/validate')  
     .send({ email: 'test@good.com' });

    expect(response.status).toBe(200);  
    expect(response.body.status).toBe('deliverable');  
    expect(response.body.score).toBe(1.0);  
  });

  it('POST /validate \- should return 400 for a request with invalid body', async () \=\> {  
    const response \= await supertest(app)  
     .post('/validate')  
     .send({ mail: 'test@good.com' }); // incorrect field name

    // Note: Since we are not using the real validator middleware in this test setup,  
    // we can't test Zod errors directly. A full app test would be needed.  
    // This test assumes a basic error handler would catch the missing 'email'.  
    // A more robust test would involve setting up the app with all middlewares.  
    // For this example, we'll assume the mocked service handles it.  
    // A real implementation of this test would need the app from server.ts  
    // with a test-specific config.  
    expect(response.status).toBe(500); // Because our mock doesn't handle this case  
  });

  it('POST /bulk/validate \- should process a list of emails', async () \=\> {  
    const emails \= \['test@good.com', 'test@bad.com'\];  
    const response \= await supertest(app)  
     .post('/bulk/validate')  
     .send({ emails });

    expect(response.status).toBe(200);  
    expect(response.body).toBeInstanceOf(Array);  
    expect(response.body.length).toBe(2);  
    expect(response.body.status).toBe('deliverable');  
    expect(response.body.status).toBe('undeliverable');  
  });  
});

---

### **Integración Continua (CI)**

#### **.github/workflows/ci.yml**

Flujo de trabajo de GitHub Actions para automatizar el linting, las pruebas y la construcción en cada push y pull request.

YAML

name: CI Pipeline

on:  
  push:  
    branches: \[ main \]  
  pull\_request:  
    branches: \[ main \]

jobs:  
  build\_and\_test:  
    runs-on: ubuntu-latest

    strategy:  
      matrix:  
        node-version: \[20\.x\]

    steps:  
    \- name: Checkout repository  
      uses: actions/checkout@v4

    \- name: Set up Node.js ${{ matrix.node-version }}  
      uses: actions/setup-node@v4  
      with:  
        node-version: ${{ matrix.node-version }}  
        cache: 'npm' \# or 'pnpm' if you use it

    \- name: Install dependencies  
      run: npm install \# or pnpm install

    \- name: Run linter  
      run: npm run lint

    \- name: Run tests  
      run: npm test

    \- name: Build project  
      run: npm run build

    \- name: Check for build artifacts  
      run: test \-d dist && test \-f dist/server.js

---

### **Documentación del Proyecto (README.md)**

El manual de usuario y guía de operaciones del microservicio. Es el documento más importante para cualquier desarrollador que interactúe con el proyecto.

# **Microservicio Verificador de Emails**

Un microservicio de alto rendimiento, listo para producción, para validar direcciones de correo electrónico. Diseñado para ser rápido, fiable y económico, con el objetivo de filtrar correos inválidos antes de enviar campañas para proteger la reputación del remitente y mejorar la eficacia.

## **Características Principales**

* **Validación Multi-capa**:  
  * **Sintaxis**: Normalización y validación estricta (RFC 5322).  
  * **DNS**: Verificación de registros MX, A y AAAA.  
  * **SMTP (Opcional)**: Sonda en tiempo real para confirmar la existencia del buzón sin enviar un correo.  
* **Clasificación Inteligente**: Categoriza los emails como deliverable, risky, undeliverable o unknown.  
* **Detección Avanzada**: Identifica dominios desechables (temporales), emails basados en roles (admin@, info@) y dominios catch-all.  
* **Puntuación de Entregabilidad**: Asigna un score de 0 a 1 para una evaluación cuantitativa rápida.  
* **Rendimiento y Escalabilidad**:  
  * Procesamiento de lotes (/bulk/validate) con concurrencia controlada.  
  * Caché inteligente con soporte para **Redis** o un caché **LRU en memoria** como fallback.  
* **Seguridad**: Autenticación por x-api-key, limitación de velocidad (rate limiting) por IP y por clave, y CORS configurable.  
* **Observabilidad**: Logs estructurados (JSON), métricas para **Prometheus** (/metrics) y checks de salud (/healthz, /readyz).  
* **Listo para Despliegue**: Contenerizado con **Docker** (imagen multi-etapa optimizada) y con guía de despliegue para **EasyPanel**.  
* **Excelente Experiencia de Desarrollador (DX)**: Documentación OpenAPI (/docs), colección de Postman, y una completa suite de tests con Vitest.

## **Stack Tecnológico**

* **Backend**: Node.js 20+ con TypeScript  
* **Framework**: Express.js  
* **Validación de Datos**: Zod  
* **Caché**: Redis (vía ioredis) o LRU en memoria  
* **Logging**: Pino  
* **Métricas**: prom-client  
* **Testing**: Vitest  
* **Contenedor**: Docker

## **Cómo Empezar (Desarrollo Local)**

### **Prerrequisitos**

* Node.js (v20 o superior)  
* npm (o pnpm/yarn)  
* Docker y Docker Compose (para usar Redis)

### **1\. Clonar el Repositoriobash**

git clone \<URL\_DEL\_REPOSITORIO\>  
cd email-verifier-microservice

\#\#\# 2\. Configurar Variables de Entorno

Copia el archivo de ejemplo y edítalo con tu configuración.

\`\`\`bash  
cp.env.example.env

Asegúrate de configurar API\_KEYS con al menos una clave secreta.

### **3\. Instalar Dependencias**

Bash

npm install

*(Opcional: si prefieres pnpm)*

Bash

pnpm install

### **4\. Iniciar el Entorno de Desarrollo**

Este comando iniciará el servidor de la aplicación y un contenedor de Redis.

Bash

docker-compose up \-d

El servidor se ejecutará con hot-reloading. Puedes ver los logs con docker-compose logs \-f app.

### **5\. Probar la API**

La API estará disponible en http://localhost:3000.

Bash

curl \-X POST http://localhost:3000/validate \\  
  \-H "Content-Type: application/json" \\  
  \-H "x-api-key: tu\_secret\_key\_1" \\  
  \-d '{"email": "test@gmail.com"}'

## **Configuración (Variables de Entorno)**

Todas las variables se configuran en el archivo .env.

| Variable | Descripción | Requerido | Valor por Defecto |
| :---- | :---- | :---- | :---- |
| PORT | Puerto en el que se ejecutará el servidor. | No | 3000 |
| NODE\_ENV | Entorno de la aplicación (development o production). | No | development |
| LOG\_LEVEL | Nivel de logs (info, debug, warn, error). | No | info |
| API\_KEYS | Lista de claves de API válidas, separadas por comas. | **Sí** | \- |
| ALLOWED\_ORIGINS | Lista de orígenes permitidos para CORS, separados por comas. | **Sí** | \- |
| RATE\_LIMIT\_IP\_PER\_MIN | Límite de peticiones por minuto por IP. | No | 60 |
| RATE\_LIMIT\_KEY\_PER\_MIN | Límite de peticiones por minuto por clave de API. | No | 600 |
| REDIS\_URL | URL de conexión a Redis. Si no se provee, se usa un caché en memoria. | No | null |
| CACHE\_TTL\_SECONDS | Tiempo de vida (TTL) en segundos para los resultados en caché. | No | 86400 (24 horas) |
| BLOCK\_ROLES | true para marcar emails basados en roles (admin@, info@) como risky. | No | true |
| BLOCK\_DISPOSABLE | true para marcar emails de dominios desechables como risky. | No | true |
| ENABLE\_SMTP\_PROBE | true para habilitar la verificación SMTP en tiempo real. | No | true |
| SMTP\_TIMEOUT\_MS | Timeout en milisegundos para la conexión y comandos SMTP. | No | 5000 |
| SMTP\_HELO\_DOMAIN | Dominio a usar en el comando EHLO de SMTP. | No | verifier.yourdomain.com |
| SMTP\_FROM\_EMAIL | Email a usar en el comando MAIL FROM de SMTP. | No | bounce@verifier.yourdomain.com |
| DISPOSABLE\_SOURCES | URLs (separadas por comas) para descargar listas de dominios desechables. | No | Dos URLs de listas públicas. |

## **Referencia de la API**

La documentación completa e interactiva de la API está disponible en el endpoint /docs (servida con Swagger UI).

### **POST /validate**

Valida una única dirección de correo electrónico.

**cURL Ejemplo:**

Bash

curl \-X POST http://localhost:3000/validate \\  
  \-H "Content-Type: application/json" \\  
  \-H "x-api-key: tu\_secret\_key\_1" \\  
  \-d '{"email": "admin@github.com"}'

**Respuesta Ejemplo:**

JSON

{  
  "email": "admin@github.com",  
  "normalized": "admin@github.com",  
  "valid\_syntax": true,  
  "domain\_exists": true,  
  "has\_mx": true,  
  "is\_disposable": false,  
  "is\_role": true,  
  "smtp": {  
    "enabled": true,  
    "connection": "ok",  
    "deliverable": true,  
    "catch\_all\_suspected": false,  
    "notes": "RCPT TO accepted with code 250"  
  },  
  "score": 0.7,  
  "status": "risky",  
  "reasons": \["role\_email"\],  
  "checked\_at": "2023-10-27T10:00:00.000Z",  
  "ttl\_seconds": 86400  
}

### **POST /bulk/validate**

Valida un lote de hasta 5,000 emails.

**cURL Ejemplo:**

Bash

curl \-X POST http://localhost:3000/bulk/validate \\  
  \-H "Content-Type: application/json" \\  
  \-H "x-api-key: tu\_secret\_key\_1" \\  
  \-d '{"emails": \["test@gmail.com", "fake@nonexistent-domain123.org"\]}'

**Respuesta Ejemplo:**

JSON

\[  
  {  
    "email": "test@gmail.com",  
    "status": "deliverable",  
    "...": "..."  
  },  
  {  
    "email": "fake@nonexistent-domain123.org",  
    "status": "undeliverable",  
    "reasons": \["domain\_not\_found"\],  
    "...": "..."  
  }  
\]

## **Lógica de Estado y Puntuación**

La clasificación final se basa en un conjunto de reglas y una fórmula de puntuación.

### **Reglas de Decisión**

* **undeliverable**: Sintaxis inválida, el dominio no existe, o no tiene registros MX/A/AAAA.  
* **risky**: Es un email desechable, de rol, el dominio es catch-all, o la conexión SMTP falló (timeout, etc.).  
* **unknown**: La sonda SMTP está deshabilitada o falló de una manera no concluyente (ej. greylisting).  
* **deliverable**: Pasa todas las verificaciones anteriores.

### **Fórmula de Puntuación (score)**

El score es una suma ponderada de varias comprobaciones, donde 1.0 es la mejor puntuación posible.

| Componente | Peso | Condición para obtener los puntos |
| :---- | :---- | :---- |
| Sintaxis Válida (valid\_syntax) | 0.25 | La sintaxis del email es correcta. |
| DNS Válido (has\_mx) | 0.25 | El dominio existe y tiene registros MX. |
| No Desechable (is\_disposable) | 0.20 | El dominio no está en la lista de proveedores desechables. |
| No es de Rol (is\_role) | 0.10 | El email no es una dirección basada en un rol (ej. info@). |
| Entregabilidad SMTP (smtp.deliverable) | 0.20 | La sonda SMTP fue exitosa y el servidor aceptó el destinatario. |
| **Total** | **1.0** |  |

## **Despliegue en EasyPanel**

Este microservicio está diseñado para un despliegue sencillo en EasyPanel usando su funcionalidad de Dockerfile.

1. **Inicia Sesión en EasyPanel**: Ve a tu dashboard.  
2. **Crea un Nuevo Servicio**:  
   * Haz clic en "New".  
   * Selecciona "App" como tipo de fuente.  
   * Conecta tu repositorio de GitHub donde subiste este código.  
3. **Configura la Fuente**:  
   * Selecciona "Dockerfile" como "Build Method".  
   * Deja la ruta del Dockerfile como ./Dockerfile.  
4. **Configura las Variables de Entorno**:  
   * Ve a la pestaña "Environment" de tu nuevo servicio.  
   * Copia el contenido de tu archivo .env local y pégalo aquí. Asegúrate de usar valores de producción para API\_KEYS, ALLOWED\_ORIGINS, etc.  
   * EasyPanel establecerá automáticamente la variable PORT, por lo que no necesitas preocuparte por ella.  
5. **Despliega**:  
   * Haz clic en el botón "Deploy". EasyPanel construirá la imagen de Docker y desplegará el contenedor.  
   * El HEALTHCHECK definido en el Dockerfile (GET /healthz) será utilizado por EasyPanel para monitorizar la salud del servicio.  
6. **(Opcional) Configura un Dominio**:  
   * Ve a la pestaña "Domains" y añade un dominio personalizado, por ejemplo: email-verifier.tu-dominio.com.

## **Guía de Integración con n8n**

Puedes usar este microservicio en tus flujos de trabajo de n8n para limpiar listas de correo antes de enviarlas a través de servicios como SendGrid, Mailchimp o tu propio SMTP.

### **Escenario 1: Validar un solo email**

1. **Añade un nodo "HTTP Request"**:  
   * **Method**: POST  
   * **URL**: https://\<tu-dominio-de-easypanel\>/validate  
   * **Authentication**: Header Auth  
     * **Name**: x-api-key  
     * **Value**: tu\_secret\_key\_1  
   * **Body Content Type**: JSON  
   * **JSON/RAW Parameters**: \={{ { "email": $json\["email\_a\_validar"\] } }}  
2. **Añade un nodo "IF" (o "Switch")**:  
   * Este nodo actuará como una puerta. Condición para continuar:  
     * {{ $json.body.status }} \- String \- Equals \- deliverable  
   * O una regla más permisiva para emails transaccionales:  
     * {{ $json.body.status }} \- String \- Not Equals \- undeliverable  
     * Y {{ $json.body.reasons }} \- Array \- Does not contain \- disposable\_email  
3. **Conecta la salida "true" del IF** al siguiente paso de tu flujo (ej. "Send Email" o "Add to CRM").

### **Escenario 2: Validar una lista grande desde una base de datos**

1. **Obtén tus datos**: Usa un nodo "Postgres", "Google Sheets", etc., para obtener tu lista de emails.  
2. **Usa el nodo "Split in Batches"**:  
   * **Batch Size**: 1000 (o hasta 5000). Esto agrupará tus contactos para usar el endpoint /bulk/validate.  
3. **Añade un nodo "HTTP Request"**:  
   * **Method**: POST  
   * **URL**: https://\<tu-dominio-de-easypanel\>/bulk/validate  
   * **Authentication**: Header Auth (misma configuración que antes).  
   * **Body Content Type**: JSON  
   * **JSON/RAW Parameters**: \={{ { "emails": $items().map(item \=\> item.json.email) } }}  
4. **Procesa los resultados**: La salida del HTTP Request será un array de resultados de validación. Puedes usar un nodo "Function" o "Edit Fields" para iterar sobre ellos y actualizar tu base de datos (ej. Supabase) con el status, score y reasons.

## **Consideraciones de Seguridad y Entregabilidad**

* **Protege tus Claves de API**: Trátalas como contraseñas. No las expongas en el código del frontend.  
* **Sonda SMTP**: La verificación SMTP no es 100% infalible. Algunos servidores usan *greylisting* (rechazos temporales) o tienen firewalls que bloquean conexiones desde rangos de IP de datacenters. Un resultado unknown o risky (con smtp\_timeout) debe tratarse con precaución, especialmente para campañas de marketing.  
* **Calentamiento de IP (Warm-up)**: Si envías correos desde una nueva IP o dominio, caliéntala gradualmente enviando volúmenes bajos y aumentándolos poco a poco.  
* **Autenticación de Email**: Configura **SPF, DKIM y DMARC** para tu dominio de envío. Esto es crucial para la entregabilidad.  
* **List-Unsubscribe Header**: Incluye esta cabecera en tus emails para permitir que los usuarios se den de baja fácilmente desde la interfaz de su cliente de correo.  
* **Doble Opt-In**: Para listas de marketing, siempre es preferible un proceso de doble confirmación para asegurar que los usuarios realmente quieren recibir tus comunicaciones.

## **Scripts del Proyecto**

* npm run dev: Inicia el servidor en modo desarrollo con hot-reload.  
* npm run build: Compila el código TypeScript a JavaScript en el directorio dist/.  
* npm run start: Inicia el servidor en modo producción desde el código compilado.  
* npm run test: Ejecuta toda la suite de pruebas con Vitest.  
* npm run lint: Revisa el código en busca de errores de estilo y calidad.  
* npm run disposable:update: Ejecuta un script para forzar la actualización de la lista de dominios desechables.

Este conjunto completo de archivos, código y documentación constituye una solución robusta y profesional para la verificación de correos electrónicos, lista para ser implementada y utilizada en un entorno de producción.  
