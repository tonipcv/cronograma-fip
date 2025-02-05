# Base image
FROM node:18-alpine AS base
WORKDIR /app

# Dependencies
FROM base AS deps
# Copiar arquivos necessários primeiro
COPY package.json package-lock.json* ./
COPY prisma ./prisma
RUN npm ci

# Builder
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Definir variável temporária para o build
ENV NEXTAUTH_SECRET="temporary_secret_for_build"
ENV DATABASE_URL="postgresql://dummy:dummy@dummy:5432/dummy"

# Gerar cliente Prisma e build
RUN npx prisma generate
RUN npm run build

# Runner
FROM base AS runner
ENV NODE_ENV=production

# Criar usuário não-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar arquivos necessários
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma

# Instalar apenas as dependências de produção do Prisma
RUN npm install @prisma/client

# Mudar para usuário não-root
USER nextjs

# Configurar variáveis de ambiente
EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# As variáveis reais devem ser configuradas no EasyPanel
# ENV NEXTAUTH_URL=
# ENV NEXTAUTH_SECRET=
# ENV DATABASE_URL=

CMD ["node", "server.js"] 