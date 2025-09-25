import { openDB } from 'idb'

const DB_NAME = 'mvp-db'
const STORE = 'reports'

async function getDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: 'id', autoIncrement: true })
      }
    }
  })
}

export async function addReport(report) {
  const db = await getDB()
  return db.add(STORE, report)
}

export async function getAllReports() {
  const db = await getDB()
  return db.getAll(STORE)
}

export async function deleteReport(id) {
  const db = await getDB()
  return db.delete(STORE, id)
}
