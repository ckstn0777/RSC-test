import { Pool } from 'react-pg'
import credentials from '../credentials'

export const db = new Pool(credentials)
