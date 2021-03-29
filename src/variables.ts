export const PORT = process.env.PORT ? Number(process.env.PORT) : 3000

export const isProduction = process.env.NODE_ENV === 'production'
