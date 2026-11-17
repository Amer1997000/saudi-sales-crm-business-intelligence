import type { Account, CrmWorkspace, Lead, Opportunity, SaudiCity, SaudiRegion } from './models'
import { STAGE_PROBABILITIES } from './rules'

export type LeadInput = Omit<Lead, 'id'|'createdAt'|'updatedAt'|'convertedAccountId'|'convertedOpportunityId'>
export type AccountInput = Omit<Account, 'id'|'createdAt'|'updatedAt'|'sourceLeadId'> & { sourceLeadId?: string }
export interface FieldErrors { [field: string]: string }
export interface ConversionInput { opportunityTitle: string; opportunityValueSar: number; expectedCloseDate: string }
export interface ServiceOptions { id: () => string; now: () => string }

const defaultOptions: ServiceOptions = { id: () => crypto.randomUUID(), now: () => new Date().toISOString() }
const normalize = (value: string) => value.trim().toLocaleLowerCase('en')
const uniqueId=(prefix:string,existing:Set<string>,options:ServiceOptions)=>{for(let attempt=0;attempt<100;attempt++){const candidate=`${prefix}-${options.id()}`;if(!existing.has(candidate))return candidate}throw new Error(`Unable to allocate a unique ${prefix} identifier.`)}

export function validateLead(input: LeadInput): FieldErrors {
  const errors: FieldErrors = {}
  if (!input.companyName.trim()) errors.companyName = 'Company name is required.'
  if (!input.contactName.trim()) errors.contactName = 'Contact name is required.'
  if (!input.industry.trim()) errors.industry = 'Industry is required.'
  if (!input.city) errors.city = 'City is required.'
  if (!input.assignedSalesRepId) errors.assignedSalesRepId = 'Sales representative is required.'
  if (input.estimatedValueSar !== undefined && (!Number.isFinite(input.estimatedValueSar) || input.estimatedValueSar < 0)) errors.estimatedValueSar = 'Estimated value must be zero or greater.'
  if (input.score !== undefined && (!Number.isInteger(input.score) || input.score < 0 || input.score > 100)) errors.score = 'Score must be a whole number from 0 to 100.'
  if (input.status === 'Unqualified' && !input.disqualificationReason?.trim()) errors.disqualificationReason = 'A reason is required for an unqualified lead.'
  return errors
}

export function validateAccount(input: AccountInput): FieldErrors {
  const errors: FieldErrors = {}
  if (!input.legalName.trim()) errors.legalName = 'Legal name is required.'
  if (!input.industry.trim()) errors.industry = 'Industry is required.'
  if (!input.primaryContactName.trim()) errors.primaryContactName = 'Primary contact is required.'
  if (!input.assignedSalesRepId) errors.assignedSalesRepId = 'Sales representative is required.'
  return errors
}

export function findLeadDuplicates(workspace: CrmWorkspace, candidate: Pick<Lead,'companyName'|'city'|'contactName'>, excludeId?: string): Lead[] {
  return workspace.leads.filter((lead) => lead.id !== excludeId && ((normalize(lead.companyName) === normalize(candidate.companyName) && lead.city === candidate.city) || (normalize(lead.companyName) === normalize(candidate.companyName) && normalize(lead.contactName) === normalize(candidate.contactName))))
}

export function findAccountDuplicates(workspace: CrmWorkspace, candidate: Pick<Account,'legalName'|'city'>, excludeId?: string): Account[] {
  return workspace.accounts.filter((account) => account.id !== excludeId && normalize(account.legalName) === normalize(candidate.legalName) && account.city === candidate.city)
}

export function createLead(workspace: CrmWorkspace, input: LeadInput, options=defaultOptions): CrmWorkspace {
  const errors = validateLead(input); if (Object.keys(errors).length) throw new Error('Lead validation failed.')
  const now=options.now(),id=uniqueId('LEAD',new Set(workspace.leads.map(x=>x.id)),options); return { ...workspace, leads:[...workspace.leads,{...input,id,createdAt:now,updatedAt:now}], metadata:{...workspace.metadata,updatedAt:now} }
}
export function updateLead(workspace: CrmWorkspace, id:string, input:LeadInput, options=defaultOptions):CrmWorkspace {
  const current=workspace.leads.find(x=>x.id===id); if(!current) throw new Error('Lead not found.'); if(Object.keys(validateLead(input)).length) throw new Error('Lead validation failed.')
  const now=options.now(); return {...workspace,leads:workspace.leads.map(x=>x.id===id?{...current,...input,id,createdAt:current.createdAt,updatedAt:now}:x),metadata:{...workspace.metadata,updatedAt:now}}
}
export function deleteLead(workspace:CrmWorkspace,id:string):CrmWorkspace {
  const lead=workspace.leads.find(x=>x.id===id); if(!lead) throw new Error('Lead not found.')
  if(lead.convertedAccountId||lead.convertedOpportunityId||workspace.accounts.some(x=>x.sourceLeadId===id)||workspace.opportunities.some(x=>x.sourceLeadId===id)||workspace.activities.some(x=>x.leadId===id)) throw new Error('This lead has linked records and cannot be deleted. Update its status instead.')
  return {...workspace,leads:workspace.leads.filter(x=>x.id!==id)}
}
export function createAccount(workspace:CrmWorkspace,input:AccountInput,options=defaultOptions):CrmWorkspace {if(Object.keys(validateAccount(input)).length)throw new Error('Account validation failed.');const now=options.now(),id=uniqueId('ACC',new Set(workspace.accounts.map(x=>x.id)),options);return{...workspace,accounts:[...workspace.accounts,{...input,id,createdAt:now,updatedAt:now}],metadata:{...workspace.metadata,updatedAt:now}}}
export function updateAccount(workspace:CrmWorkspace,id:string,input:AccountInput,options=defaultOptions):CrmWorkspace {const current=workspace.accounts.find(x=>x.id===id);if(!current)throw new Error('Account not found.');if(Object.keys(validateAccount(input)).length)throw new Error('Account validation failed.');const now=options.now();return{...workspace,accounts:workspace.accounts.map(x=>x.id===id?{...current,...input,id,createdAt:current.createdAt,updatedAt:now}:x),metadata:{...workspace.metadata,updatedAt:now}}}

export function convertLead(workspace:CrmWorkspace,leadId:string,input:ConversionInput,options=defaultOptions):CrmWorkspace {
  const lead=workspace.leads.find(x=>x.id===leadId); if(!lead)throw new Error('Lead not found.'); if(lead.status!=='Qualified')throw new Error('Only a qualified lead can be converted.'); if(lead.convertedAccountId||lead.convertedOpportunityId)throw new Error('This lead has already been converted.'); if(!input.opportunityTitle.trim()||!Number.isFinite(input.opportunityValueSar)||input.opportunityValueSar<=0||!input.expectedCloseDate)throw new Error('Complete all conversion fields with a positive opportunity value.')
  const now=options.now(),accountId=uniqueId('ACC',new Set(workspace.accounts.map(x=>x.id)),options),opportunityId=uniqueId('OPP',new Set(workspace.opportunities.map(x=>x.id)),options)
  const account:Account={id:accountId,legalName:lead.companyName,industry:lead.industry,city:lead.city,region:lead.region,accountTier:'Standard',relationshipStatus:'Prospect',primaryContactName:lead.contactName,businessEmail:lead.businessEmail,businessPhone:lead.businessPhone,assignedSalesRepId:lead.assignedSalesRepId,sourceLeadId:lead.id,createdAt:now,updatedAt:now}
  const opportunity:Opportunity={id:opportunityId,accountId,sourceLeadId:lead.id,title:input.opportunityTitle,category:lead.interestCategory,stage:'Qualification',valueSar:input.opportunityValueSar,probability:STAGE_PROBABILITIES.Qualification,probabilitySource:'Stage default',expectedCloseDate:input.expectedCloseDate,assignedSalesRepId:lead.assignedSalesRepId,quotationIds:[],createdAt:now,updatedAt:now,stageHistory:[{id:`SH-${options.id()}`,toStage:'Qualification',changedAt:now,note:'Created by lead conversion'}]}
  return {...workspace,leads:workspace.leads.map(x=>x.id===leadId?{...x,status:'Converted',convertedAccountId:accountId,convertedOpportunityId:opportunityId,updatedAt:now}:x),accounts:[...workspace.accounts,account],opportunities:[...workspace.opportunities,opportunity],metadata:{...workspace.metadata,updatedAt:now}}
}

export const cityRegion:Record<SaudiCity,SaudiRegion>={Riyadh:'Central',Jeddah:'Western',Dammam:'Eastern',Madinah:'Western',Abha:'Southern',Khobar:'Eastern',Tabuk:'Northern'}
