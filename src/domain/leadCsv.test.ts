import { describe,expect,it } from 'vitest'
import { cloneDemoWorkspace } from '../data/demoData'
import { exportLeadsCsv, importLeadsCsv, leadCsvTemplate, parseCsv } from './leadCsv'
const options={id:(()=>{let n=0;return()=>`CSV${++n}`})(),now:()=> '2026-11-17T00:00:00.000Z'}
describe('lead CSV',()=>{
 it('parses quoted commas and escaped quotes',()=>expect(parseCsv('company,contact\r\n"Acme, Ltd","A ""Test"""')).toEqual([['company','contact'],['Acme, Ltd','A "Test"']]))
 it('provides the required UTF-8 template headers',()=>expect(leadCsvTemplate()).toContain('companyName,contactName'))
 it('accepts valid rows and reports invalid rows independently',()=>{const csv=leadCsvTemplate()+'Valid Synthetic Co,Test Person,,,Riyadh,Services,Website,IT Products,90000,New,70,REP-001\r\nBroken Co,Person,,,Unknown,Services,Bad,IT Products,abc,New,200,REP-001';const ws=cloneDemoWorkspace();const result=importLeadsCsv(ws,csv,options);expect(result.accepted).toBe(1);expect(result.workspace.leads).toHaveLength(ws.leads.length+1);expect(result.errors.some(x=>x.row===3&&x.field==='city')).toBe(true);expect(ws.leads).toHaveLength(8)})
 it('reports duplicate candidates but does not merge',()=>{const csv=leadCsvTemplate()+'Najd Horizon Contracting Co.,Different Contact,,,Riyadh,Construction,Website,Office Equipment,1000,New,50,REP-001';const result=importLeadsCsv(cloneDemoWorkspace(),csv,options);expect(result.accepted).toBe(1);expect(result.duplicateWarnings).toHaveLength(1)})
 it('exports all lead rows with stable headers',()=>{const ws=cloneDemoWorkspace();const parsed=parseCsv(exportLeadsCsv(ws));expect(parsed).toHaveLength(ws.leads.length+1);expect(parsed[0]).toEqual(leadCsvTemplate().trim().split(','))})
 it('rejects a malformed row width without corrupting valid rows',()=>{const csv=leadCsvTemplate()+'Valid Synthetic Co,Test Person,,,Riyadh,Services,Website,IT Products,90000,New,70,REP-001\r\nToo,Few,Columns';const ws=cloneDemoWorkspace();const result=importLeadsCsv(ws,csv,options);expect(result.accepted).toBe(1);expect(result.errors).toContainEqual({row:3,field:'row',message:'Expected 12 columns but found 3.'})})
 it('neutralizes spreadsheet formula prefixes on export',()=>{const ws=cloneDemoWorkspace();ws.leads[0]={...ws.leads[0],companyName:'=HYPERLINK("https://invalid.example")'};const csv=exportLeadsCsv(ws);expect(csv).toContain("'=HYPERLINK");expect(parseCsv(csv)[1][0].startsWith("'=")).toBe(true)})
})
