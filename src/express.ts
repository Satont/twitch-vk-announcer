import { PORT } from './variables'
import express from 'express'

export const expressApp = express()

expressApp.get('/', (req, res) => {
  res.send('Ok')
})

export const expressBootstrap = async () => {
  return expressApp.listen(PORT, '0.0.0.0')
}