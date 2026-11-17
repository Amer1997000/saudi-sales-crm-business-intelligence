export type SaudiRegion='Central'|'Western'|'Eastern'|'Northern'|'Southern'
export type SaudiCity='Riyadh'|'Jeddah'|'Dammam'|'Madinah'|'Abha'|'Khobar'|'Tabuk'
export type ProductCategory='Office Equipment'|'IT Products'|'Business Services'
export type LeadStatus='New'|'Contacted'|'Qualified'|'Unqualified'|'Converted'|'Lost'
export type LeadSource='Referral'|'Website'|'Trade Event'|'Outbound'|'Partner'
export type OpportunityStage='Qualification'|'Discovery'|'Solution Design'|'Quotation Submitted'|'Negotiation'|'Closed Won'|'Closed Lost'
export type QuotationStatus='Draft'|'Issued'|'Accepted'|'Rejected'|'Expired'|'Superseded'
export type ActivityType='Call'|'Email'|'Meeting'|'Proposal follow-up'|'Site visit'|'General task'
export interface SalesRepresentative{id:string;displayName:string;territory:SaudiRegion|'National';active:boolean}
export interface Lead{id:string;companyName:string;contactName:string;jobTitle?:string;businessEmail?:string;businessPhone?:string;city:SaudiCity;region:SaudiRegion;industry:string;source:LeadSource;interestCategory:ProductCategory;estimatedValueSar?:number;status:LeadStatus;score?:number;assignedSalesRepId:string;nextFollowUpDate?:string;notes?:string;createdAt:string;updatedAt:string;convertedAccountId?:string;convertedOpportunityId?:string;disqualificationReason?:string}
export interface Account{id:string;legalName:string;tradingName?:string;industry:string;city:SaudiCity;region:SaudiRegion;accountTier:'Strategic'|'Key'|'Standard';relationshipStatus:'Prospect'|'Active'|'Inactive';primaryContactName:string;businessEmail?:string;businessPhone?:string;assignedSalesRepId:string;sourceLeadId?:string;notes?:string;createdAt:string;updatedAt:string}
export interface StageHistoryEntry{id:string;fromStage?:OpportunityStage;toStage:OpportunityStage;changedAt:string;note?:string}
export interface Opportunity{id:string;accountId:string;sourceLeadId?:string;title:string;category:ProductCategory;stage:OpportunityStage;valueSar:number;probability:number;probabilitySource:'Stage default'|'Manual override';expectedCloseDate:string;assignedSalesRepId:string;quotationIds:string[];lossReason?:string;wonDate?:string;lostDate?:string;createdAt:string;updatedAt:string;stageHistory:StageHistoryEntry[]}
export interface QuotationLine{id:string;description:string;category:ProductCategory;quantity:number;unitPriceSar:number;discountSar:number;lineNetSar:number}
export interface Quotation{id:string;quotationNumber:string;opportunityId:string;accountId:string;issueDate:string;validUntil:string;status:QuotationStatus;lineItems:QuotationLine[];subtotalSar:number;discountSar:number;taxableAmountSar:number;vatRate:number;vatAmountSar:number;totalSar:number;notes?:string;createdAt:string;updatedAt:string}
export interface Activity{id:string;type:ActivityType;subject:string;dueAt:string;completedAt?:string;status:'Planned'|'Completed'|'Cancelled';priority:'Low'|'Normal'|'High';assignedSalesRepId:string;leadId?:string;accountId?:string;opportunityId?:string;outcome?:string;notes?:string;createdAt:string;updatedAt:string}
export interface WorkspaceMetadata{dataClassification:'Synthetic demonstration data';companyScenario:'Fictional';asOfDate:string;createdAt:string;updatedAt:string}
export interface CrmWorkspace{schemaVersion:number;leads:Lead[];accounts:Account[];opportunities:Opportunity[];quotations:Quotation[];activities:Activity[];representatives:SalesRepresentative[];metadata:WorkspaceMetadata}
