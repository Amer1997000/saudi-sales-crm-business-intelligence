import { describe, expect, it } from 'vitest'
import { initializeWorkspace, resetWorkspace, saveWorkspace, STORAGE_KEY, type StorageLike } from './workspaceStorage'

class MemoryStorage implements StorageLike {
  private values = new Map<string, string>()
  getItem(key: string) { return this.values.get(key) ?? null }
  setItem(key: string, value: string) { this.values.set(key, value) }
  removeItem(key: string) { this.values.delete(key) }
}

describe('versioned workspace storage', () => {
  it('safely initializes an empty store', () => {
    const storage = new MemoryStorage()
    const workspace = initializeWorkspace(storage)
    expect(workspace.schemaVersion).toBe(1)
    expect(storage.getItem(STORAGE_KEY)).not.toBeNull()
  })

  it('recovers malformed or incompatible values', () => {
    const storage = new MemoryStorage()
    storage.setItem(STORAGE_KEY, '{broken')
    expect(initializeWorkspace(storage).leads.length).toBeGreaterThan(0)
    storage.setItem(STORAGE_KEY, JSON.stringify({ schemaVersion: 99 }))
    expect(initializeWorkspace(storage).schemaVersion).toBe(1)
  })

  it('recovers structurally incomplete JSON values', () => {
    const storage = new MemoryStorage()
    storage.setItem(STORAGE_KEY, JSON.stringify({ schemaVersion: 1, leads: [], accounts: [], opportunities: [], quotations: [], activities: [], representatives: [] }))
    const recovered = initializeWorkspace(storage)
    expect(recovered.metadata.dataClassification).toBe('Synthetic demonstration data')
    expect(recovered.leads.length).toBeGreaterThan(0)
  })

  it('resets the workspace to a fresh independent copy', () => {
    const storage = new MemoryStorage()
    const first = initializeWorkspace(storage)
    first.leads.pop()
    storage.setItem(STORAGE_KEY, JSON.stringify(first))
    expect(resetWorkspace(storage).leads.length).toBe(8)
  })
  it('persists and reloads valid record changes',()=>{const storage=new MemoryStorage();const workspace=initializeWorkspace(storage);workspace.leads[0]={...workspace.leads[0],companyName:'Persisted synthetic edit'};saveWorkspace(storage,workspace);expect(initializeWorkspace(storage).leads[0].companyName).toBe('Persisted synthetic edit')})
})
