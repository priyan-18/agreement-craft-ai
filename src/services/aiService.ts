// AI Service for Agreement Generation

export interface AIGenerationRequest {
  type: string;
  formData: Record<string, any>;
  customInstructions?: string;
}

export interface AIGenerationResponse {
  content: string;
  title: string;
  suggestions?: string[];
  confidence: number;
}

// Mock AI service - in production, integrate with OpenAI API
export const generateAgreementWithAI = async (
  request: AIGenerationRequest
): Promise<AIGenerationResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 3000));

  const { type, formData } = request;

  // Enhanced agreement generation with AI-like improvements
  const aiEnhancedContent = enhanceAgreementWithAI(type, formData);

  return {
    content: aiEnhancedContent.content,
    title: aiEnhancedContent.title,
    suggestions: aiEnhancedContent.suggestions,
    confidence: 0.95
  };
};

const enhanceAgreementWithAI = (type: string, formData: Record<string, any>) => {
  const today = new Date().toLocaleDateString('en-IN');
  
  switch (type) {
    case 'rental':
      return generateEnhancedRental(formData, today);
    case 'service':
      return generateEnhancedService(formData, today);
    case 'nda':
      return generateEnhancedNDA(formData, today);
    case 'sale':
      return generateEnhancedSale(formData, today);
    default:
      return generateEnhancedCustom(formData, today);
  }
};

const generateEnhancedRental = (formData: any, today: string) => {
  const startDate = formData.startDate ? new Date(formData.startDate).toLocaleDateString('en-IN') : '[Start Date]';
  const endDate = formData.endDate ? new Date(formData.endDate).toLocaleDateString('en-IN') : '[End Date]';

  return {
    title: 'Residential Rental Agreement',
    content: `
# RESIDENTIAL RENTAL AGREEMENT

**Agreement Date:** ${today}  
**Agreement Reference:** RRA-${Date.now()}

---

## PARTIES TO THIS AGREEMENT

**LANDLORD (First Party):**
- **Name:** ${formData.ownerName || '[Landlord Name]'}
- **Address:** [Complete Address with PIN Code]
- **Contact:** [Phone Number / Email]

**TENANT (Second Party):**
- **Name:** ${formData.tenantName || '[Tenant Name]'}
- **Address:** [Complete Address with PIN Code]
- **Contact:** [Phone Number / Email]
- **ID Proof:** [Aadhaar/PAN Details]

---

## PROPERTY DETAILS

**Rental Property Address:**  
${formData.propertyAddress || '[Complete Property Address with PIN Code]'}

**Property Type:** Residential  
**Furnishing Status:** [Furnished/Semi-Furnished/Unfurnished]  
**Built-up Area:** [Area in Sq.Ft]

---

## FINANCIAL TERMS

| Particulars | Amount (₹) |
|-------------|------------|
| **Monthly Rent** | ${formData.monthlyRent || '[Amount]'} |
| **Security Deposit** | ${formData.securityDeposit || '[Amount]'} |
| **Maintenance Charges** | [As Applicable] |
| **Utility Charges** | [As Per Actual] |

**Payment Schedule:**
- Rent due date: 5th of every month
- Late payment penalty: 2% per month after 10 days
- Preferred payment method: Bank transfer/UPI

---

## LEASE TERMS

- **Lease Period:** ${formData.leaseDuration || '11 months'}
- **Commencement Date:** ${startDate}
- **Expiry Date:** ${endDate}
- **Lock-in Period:** [As applicable]
- **Notice Period:** 30 days for termination

---

## TERMS AND CONDITIONS

### 1. USE OF PREMISES
The premises shall be used **exclusively for residential purposes** by the tenant and immediate family members only.

### 2. RENT AND PAYMENTS
- Monthly rent shall be paid by the 5th of each month
- Security deposit is refundable upon termination, subject to property condition
- All utility bills (electricity, gas, water) to be paid by tenant

### 3. MAINTENANCE AND REPAIRS
- **Tenant Responsibility:** Day-to-day maintenance, minor repairs
- **Landlord Responsibility:** Structural repairs, major electrical/plumbing issues
- 48-hour notice required for landlord's property inspection

### 4. RESTRICTIONS
- No subletting without landlord's written consent
- No structural modifications without permission
- No illegal activities or nuisance to neighbors
- No pets without prior agreement

### 5. TERMINATION
- Either party may terminate with 30 days written notice
- Immediate termination possible for breach of terms
- Property to be vacated in original condition

### 6. DISPUTE RESOLUTION
Any disputes shall be resolved through:
1. Mutual discussion
2. Mediation
3. Arbitration as per Indian Arbitration Act
4. Local court jurisdiction

### 7. FORCE MAJEURE
Neither party liable for delays/failure due to natural disasters, government orders, or circumstances beyond control.

---

## LEGAL COMPLIANCE

This agreement complies with:
- Transfer of Property Act, 1882
- Registration Act, 1908  
- Rent Control Laws (as applicable)
- Local Municipal Regulations

**Governing Law:** Laws of India  
**Jurisdiction:** Local Courts

---

## SIGNATURES

**LANDLORD**  
_________________________  
${formData.ownerName || '[Landlord Name]'}  
Date: ${today}

**TENANT**  
_________________________  
${formData.tenantName || '[Tenant Name]'}  
Date: ${today}

**WITNESSES:**
1. ___________________ (Name & Signature)
2. ___________________ (Name & Signature)

---

*This document is generated for reference purposes. Please consult a legal expert for formal agreements.*
`,
    suggestions: [
      'Consider adding clauses for parking space allocation',
      'Include inventory list for furnished properties',
      'Add escalation clause for annual rent increases',
      'Consider adding society/building rules compliance clause'
    ]
  };
};

const generateEnhancedService = (formData: any, today: string) => {
  return {
    title: 'Professional Service Agreement',
    content: `
# PROFESSIONAL SERVICE AGREEMENT

**Agreement Date:** ${today}  
**Agreement Reference:** PSA-${Date.now()}

---

## CONTRACTING PARTIES

**CLIENT (First Party):**
- **Name/Company:** ${formData.clientName || '[Client Name/Company]'}
- **Address:** [Complete Business Address]
- **Contact:** [Phone / Email]
- **GST Number:** [If Applicable]

**SERVICE PROVIDER (Second Party):**
- **Name/Company:** ${formData.providerName || '[Service Provider Name/Company]'}
- **Address:** [Complete Business Address]  
- **Contact:** [Phone / Email]
- **GST Number:** [If Applicable]
- **Professional License:** [If Applicable]

---

## SERVICE DETAILS

**Service Category:** Professional Services  
**Project Name:** [Project/Service Name]

**Scope of Services:**  
${formData.serviceScope || '[Detailed description of services to be provided including deliverables, timelines, and quality standards]'}

**Service Methodology:** [Brief description of approach/methodology]

---

## FINANCIAL TERMS

| Particulars | Details |
|-------------|---------|
| **Total Service Fee** | ₹${formData.serviceFee || '[Amount]'} |
| **Payment Terms** | ${formData.paymentTerms || '[Payment Schedule]'} |
| **GST** | [As Applicable @ Current Rates] |
| **TDS** | [As Per Income Tax Act] |

**Payment Schedule:**
- Advance: [Amount and percentage]
- Milestone payments: [If applicable]
- Final payment: Upon completion and acceptance

---

## TIMELINE AND DELIVERABLES

**Project Duration:** [Estimated timeline]  
**Commencement Date:** [Start date]  
**Expected Completion:** [Target completion date]

**Key Milestones:**
1. [Milestone 1] - [Date]
2. [Milestone 2] - [Date]
3. [Final Delivery] - [Date]

**Deliverables Format:** [Specify format - digital, physical, reports, etc.]

---

## TERMS AND CONDITIONS

### 1. PERFORMANCE STANDARDS
- All services shall be performed with professional competence
- Industry best practices to be followed
- Quality standards as mutually agreed

### 2. INTELLECTUAL PROPERTY
- All work products created shall belong to the Client
- Service Provider retains rights to general methodologies
- Confidential information to remain protected

### 3. CONFIDENTIALITY
Both parties agree to:
- Maintain strict confidentiality of proprietary information
- Use information solely for project purposes
- Return/destroy confidential materials upon completion

### 4. LIABILITY AND INDEMNITY
- Service Provider liable for professional negligence
- Client responsible for providing accurate information
- Both parties indemnify against third-party claims

### 5. TERMINATION
- Either party may terminate with 15 days written notice
- Immediate termination for material breach
- Final payment for completed work upon termination

### 6. DISPUTE RESOLUTION
Disputes shall be resolved through:
1. Direct negotiation
2. Mediation through neutral mediator
3. Arbitration as per Indian Arbitration Act
4. Courts in [Jurisdiction]

### 7. FORCE MAJEURE
Neither party liable for delays due to circumstances beyond reasonable control.

---

## COMPLIANCE AND REGULATIONS

This agreement ensures compliance with:
- Indian Contract Act, 1872
- Goods and Services Tax Act
- Professional Standards (as applicable)
- Data Protection Laws

---

## SIGNATURES

**CLIENT**  
_________________________  
${formData.clientName || '[Client Name]'}  
Designation: [Title]  
Date: ${today}

**SERVICE PROVIDER**  
_________________________  
${formData.providerName || '[Service Provider Name]'}  
Designation: [Title]  
Date: ${today}

---

*Professional legal advice recommended for complex service agreements.*
`,
    suggestions: [
      'Add specific quality metrics and KPIs',
      'Include penalty clauses for delays',
      'Consider adding change request procedures',
      'Add data security and privacy clauses'
    ]
  };
};

const generateEnhancedNDA = (formData: any, today: string) => {
  return {
    title: 'Mutual Non-Disclosure Agreement',
    content: `
# MUTUAL NON-DISCLOSURE AGREEMENT

**Agreement Date:** ${today}  
**Agreement Reference:** NDA-${Date.now()}

---

## PARTIES

**FIRST PARTY:**
- **Name/Company:** ${formData.party1 || '[First Party Name/Company]'}
- **Address:** [Complete Address]
- **Contact:** [Phone / Email]

**SECOND PARTY:**
- **Name/Company:** ${formData.party2 || '[Second Party Name/Company]'}
- **Address:** [Complete Address]
- **Contact:** [Phone / Email]

---

## PURPOSE AND BACKGROUND

**Purpose of Disclosure:**  
${formData.purpose || '[Purpose of sharing confidential information - business discussions, potential partnership, evaluation, etc.]'}

**Business Context:** [Brief description of the business relationship or potential collaboration]

---

## DEFINITIONS

### Confidential Information Includes:
${formData.confidentialInfo || `
- Technical data, designs, specifications, processes
- Financial information, business plans, strategies  
- Customer lists, supplier information, pricing
- Marketing plans, product roadmaps
- Any information marked as "Confidential"
- Information disclosed orally and later confirmed in writing
`}

### Exclusions from Confidentiality:
Information that is:
- Already in public domain through no breach of this agreement
- Known to receiving party prior to disclosure
- Independently developed without use of confidential information
- Required to be disclosed by law or court order
- Approved for release in writing by disclosing party

---

## CONFIDENTIALITY OBLIGATIONS

Both parties mutually agree to:

### 1. NON-DISCLOSURE
- Keep all Confidential Information strictly confidential
- Not disclose to any third party without written consent
- Use same degree of care as used for own confidential information (minimum reasonable care)

### 2. NON-USE
- Use Confidential Information solely for the stated purpose
- Not use for any competitive advantage
- Not reverse engineer or analyze disclosed information

### 3. ACCESS CONTROL
- Limit access to employees/agents with legitimate need to know
- Ensure all personnel are bound by similar confidentiality obligations
- Maintain proper security measures for information protection

---

## DURATION AND TERMINATION

**Agreement Duration:** ${formData.ndaDuration || '3 years'} from the date of execution  
**Survival Period:** Confidentiality obligations survive termination for additional 2 years

**Termination Events:**
- Mutual written agreement
- Completion of stated purpose
- Material breach by either party

---

## RETURN OF INFORMATION

Upon termination or request:
- All confidential materials to be returned or destroyed
- Digital copies to be permanently deleted
- Written certification of destruction/return to be provided
- Exception: Materials required by law/regulation to be retained

---

## REMEDIES AND ENFORCEMENT

### Legal Remedies
- Breach may cause irreparable harm warranting injunctive relief
- Monetary damages may be inadequate remedy
- Equitable relief available without posting bond

### Consequences of Breach
- Immediate cessation of disclosure
- Legal action for damages and injunction
- Reasonable attorney fees and costs

---

## GENERAL PROVISIONS

### 1. GOVERNING LAW
This agreement shall be governed by the laws of ${formData.governingLaw || 'India'} and subject to exclusive jurisdiction of courts in [City].

### 2. ENTIRE AGREEMENT
This constitutes the complete agreement superseding all prior discussions and understandings.

### 3. MODIFICATION
Modifications must be in writing signed by both parties.

### 4. SEVERABILITY
Invalid provisions do not affect validity of remaining agreement.

### 5. ASSIGNMENT
Rights and obligations not assignable without written consent.

---

## SIGNATURES

**FIRST PARTY**  
_________________________  
${formData.party1 || '[First Party Name]'}  
Title: [Designation]  
Date: ${today}

**SECOND PARTY**  
_________________________  
${formData.party2 || '[Second Party Name]'}  
Title: [Designation]  
Date: ${today}

---

*Legal consultation recommended for industry-specific or complex NDAs.*
`,
    suggestions: [
      'Consider adding specific penalties for breach',
      'Include geographic scope limitations',
      'Add data localization requirements if applicable',
      'Consider mutual vs unilateral disclosure structure'
    ]
  };
};

const generateEnhancedSale = (formData: any, today: string) => {
  return {
    title: 'Sale Purchase Agreement',
    content: `
# SALE PURCHASE AGREEMENT

**Agreement Date:** ${today}  
**Agreement Reference:** SPA-${Date.now()}

---

## PARTIES TO THE SALE

**SELLER (First Party):**
- **Name:** ${formData.sellerName || '[Seller Name]'}
- **Address:** [Complete Address with PIN Code]
- **Contact:** [Phone / Email]
- **ID Proof:** [PAN/Aadhaar Details]

**BUYER (Second Party):**
- **Name:** ${formData.buyerName || '[Buyer Name]'}
- **Address:** [Complete Address with PIN Code]
- **Contact:** [Phone / Email]
- **ID Proof:** [PAN/Aadhaar Details]

---

## ITEM/ASSET DESCRIPTION

**Item/Asset Details:**  
${formData.itemDescription || '[Detailed description of item/asset being sold including make, model, specifications, condition, etc.]'}

**Asset Category:** [Personal Property/Vehicle/Equipment/Other]  
**Current Condition:** [New/Used/Refurbished - detailed condition report]  
**Location:** [Current location of the asset]

---

## FINANCIAL TERMS

| Particulars | Amount (₹) |
|-------------|------------|
| **Total Sale Price** | ${formData.salePrice || '[Amount]'} |
| **Advance Payment** | [Amount paid in advance] |
| **Balance Payment** | [Amount pending] |
| **Payment Method** | ${formData.paymentMethod || '[Cash/Bank Transfer/Cheque/Other]'} |

**Payment Schedule:**
- Advance: [Amount and date]
- Balance: [Amount and due date]
- Mode: ${formData.paymentMethod || 'Bank Transfer/UPI/Cash'}

---

## SALE CONDITIONS

### 1. TITLE AND OWNERSHIP
- Seller warrants clear and marketable title to the asset
- Asset is free from all liens, encumbrances, and claims
- Complete ownership transfer upon full payment
- Original documents to be handed over to buyer

### 2. CONDITION AND WARRANTIES
**Seller Warranties:**
- Asset is in condition as represented
- All descriptions and specifications are accurate  
- No hidden defects or material issues
- All necessary permits/licenses included (if applicable)

**Warranty Period:** [Specify if any warranty provided]  
**As-Is Sale:** [If applicable - buyer accepts current condition]

### 3. DELIVERY TERMS
- **Delivery Date:** [Agreed delivery date]
- **Delivery Location:** [Where asset will be delivered/collected]
- **Delivery Method:** [Seller delivery/Buyer collection/Third party]
- **Risk Transfer:** Risk passes to buyer upon delivery and acceptance

### 4. INSPECTION RIGHTS
- Buyer has [X days] for final inspection
- Acceptance implied if no objections raised within inspection period
- Major defects must be notified immediately

---

## LEGAL COMPLIANCE

### Documentation Required:
- Original purchase invoice/receipt
- Registration documents (if applicable)
- NOC from financial institutions (if under loan)
- Insurance transfer (if applicable)
- [Other relevant documents]

### Regulatory Compliance:
- GST implications (if applicable)
- TDS deduction as per Income Tax Act
- Registration requirements under applicable laws
- Local authority permissions (if required)

---

## TERMS AND CONDITIONS

### 1. DEFAULT AND REMEDIES
**Seller Default:**
- Failure to deliver as agreed
- Title defects discovered
- Material misrepresentation
- Remedies: Refund with interest, legal action

**Buyer Default:**
- Non-payment as scheduled
- Breach of agreement terms
- Remedies: Retain advance, resell asset, legal action

### 2. TERMINATION
- Either party may terminate for material breach
- 7 days written notice for remedy of breach
- Mutual agreement to terminate

### 3. DISPUTE RESOLUTION
1. Direct negotiation between parties
2. Mediation through neutral third party
3. Arbitration as per Indian Arbitration Act
4. Jurisdiction: Courts in [City/State]

---

## GENERAL PROVISIONS

### 1. ENTIRE AGREEMENT
This constitutes the complete agreement superseding all prior negotiations.

### 2. MODIFICATION
Changes must be in writing signed by both parties.

### 3. GOVERNING LAW
Governed by laws of India and subject to jurisdiction of [State] courts.

### 4. FORCE MAJEURE
Neither party liable for delays due to circumstances beyond control.

---

## SIGNATURES

**SELLER**  
_________________________  
${formData.sellerName || '[Seller Name]'}  
Date: ${today}

**BUYER**  
_________________________  
${formData.buyerName || '[Buyer Name]'}  
Date: ${today}

**WITNESSES:**
1. ___________________ (Name & Signature)
2. ___________________ (Name & Signature)

---

*Recommended to verify legal requirements and consult expert for high-value transactions.*
`,
    suggestions: [
      'Add specific inspection checklist for the asset',
      'Include insurance requirements during transit',
      'Consider adding indemnity clauses',
      'Add specific performance guarantees if applicable'
    ]
  };
};

const generateEnhancedCustom = (formData: any, today: string) => {
  return {
    title: formData.agreementTitle || 'Custom Agreement',
    content: `
# ${formData.agreementTitle?.toUpperCase() || 'CUSTOM AGREEMENT'}

**Agreement Date:** ${today}  
**Agreement Reference:** CA-${Date.now()}

---

## CONTRACTING PARTIES

**FIRST PARTY:**
- **Name/Company:** ${formData.firstParty || '[First Party Name/Company]'}
- **Address:** [Complete Address]
- **Contact:** [Phone / Email]

**SECOND PARTY:**
- **Name/Company:** ${formData.secondParty || '[Second Party Name/Company]'}
- **Address:** [Complete Address]
- **Contact:** [Phone / Email]

---

## AGREEMENT PURPOSE

**Objective:** [Brief statement of the agreement's main purpose and intended outcomes]

---

## TERMS AND CONDITIONS

### 1. PRIMARY OBLIGATIONS
${formData.customTerms || '[Detailed terms and conditions of the agreement including rights, responsibilities, and obligations of each party]'}

### 2. ADDITIONAL PROVISIONS
${formData.additionalClauses || '[Any additional clauses, special conditions, or specific requirements relevant to this agreement]'}

### 3. PERFORMANCE STANDARDS
- All obligations shall be performed with due diligence
- Industry best practices to be followed where applicable
- Mutual cooperation required for successful execution

### 4. DURATION AND TERMINATION
- **Duration:** As mutually agreed or until completion of obligations
- **Termination:** Either party may terminate with reasonable notice
- **Effect of Termination:** [Specify consequences and obligations upon termination]

---

## GENERAL TERMS

### 1. MODIFICATION
This agreement may only be modified through written consent of both parties.

### 2. ASSIGNMENT
Rights and obligations under this agreement are not assignable without prior written consent.

### 3. SEVERABILITY
If any provision is found unenforceable, the remainder of the agreement shall remain in full effect.

### 4. ENTIRE AGREEMENT
This document constitutes the entire agreement between the parties superseding all prior understandings.

### 5. DISPUTE RESOLUTION
Any disputes arising shall be resolved through:
1. Good faith negotiation
2. Mediation through neutral mediator
3. Arbitration as per Indian Arbitration Act
4. Jurisdiction of competent courts

### 6. GOVERNING LAW
This agreement is governed by the laws of India and subject to the exclusive jurisdiction of Indian courts.

---

## SIGNATURES

**FIRST PARTY**  
_________________________  
${formData.firstParty || '[First Party Name]'}  
Title: [Designation if applicable]  
Date: ${today}

**SECOND PARTY**  
_________________________  
${formData.secondParty || '[Second Party Name]'}  
Title: [Designation if applicable]  
Date: ${today}

**WITNESSES:** (If Required)
1. ___________________ (Name & Signature)
2. ___________________ (Name & Signature)

---

*This custom agreement template should be reviewed by legal counsel to ensure compliance with applicable laws and specific requirements.*
`,
    suggestions: [
      'Add specific performance metrics or KPIs',
      'Include liability and indemnification clauses',
      'Consider adding force majeure provisions',
      'Add specific notice and communication procedures'
    ]
  };
};