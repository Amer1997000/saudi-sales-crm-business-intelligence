import { cloneDemoWorkspace } from '../data/demoData'
import type { CrmWorkspace } from '../domain/models'

export const SCHEMA_VERSION = 1
export const STORAGE_KEY = 'riyadah-crm-workspace-v1'

export interface StorageLike {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
  removeItem(key: string): void
}

const isWorkspace = (value: unknown): value is CrmWorkspace => {
  if (!value || typeof value !== 'object') return false
  const item = value as Partial<CrmWorkspace>
  const collections = ['leads', 'accounts', 'opportunities', 'quotations', 'activities', 'representatives'] as const
  const metadata = item.metadata as Partial<CrmWorkspace['metadata']> | undefined
  return item.schemaVersion === SCHEMA_VERSION && collections.every((key) =>
    Array.isArray(item[key]) && item[key].every((record) => record && typeof record === 'object' && typeof (record as { id?: unknown }).id === 'string')
  ) && metadata?.dataClassification === 'Synthetic demonstration data' && metadata.companyScenario === 'Fictional' && typeof metadata.asOfDate === 'string'
}

export function saveWorkspace(storage: StorageLike, workspace: CrmWorkspace): void {
  storage.setItem(STORAGE_KEY, JSON.stringify(workspace))
}

export function initializeWorkspace(storage: StorageLike): CrmWorkspace {
  const stored = storage.getItem(STORAGE_KEY)
  if (stored) {
    try {
      const parsed: unknown = JSON.parse(stored)
      if (isWorkspace(parsed)) return parsed
    } catch {
      // A malformed local copy is replaced by a known-safe demonstration workspace.
    }
  }
  const workspace = cloneDemoWorkspace()
  saveWorkspace(storage, workspace)
  return workspace
}

export function resetWorkspace(storage: StorageLike): CrmWorkspace {
  storage.removeItem(STORAGE_KEY)
  return initializeWorkspace(storage)
}
