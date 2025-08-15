// Indian Government-Approved Agreement Formats

export const generateRentalAgreement = (formData: any) => {
  const today = new Date().toLocaleDateString('en-IN');
  const startDate = new Date(formData.startDate || '').toLocaleDateString('en-IN');
  const endDate = new Date(formData.endDate || '').toLocaleDateString('en-IN');

  return `
# RENTAL AGREEMENT

**This Rental Agreement is made on ${today} between:**

**LANDLORD (First Party):**
Name: ${formData.ownerName || '[Owner Name]'}
Address: [Owner's Address]

**TENANT (Second Party):**
Name: ${formData.tenantName || '[Tenant Name]'}
Address: [Tenant's Address]

## PROPERTY DETAILS
**Property Address:** ${formData.propertyAddress || '[Property Address]'}

## TERMS AND CONDITIONS

### 1. LEASE PERIOD
This agreement shall be for a period of ${formData.leaseDuration || '11 months'} commencing from ${startDate} to ${endDate}.

### 2. RENT AND DEPOSIT
- **Monthly Rent:** ₹${formData.monthlyRent || '[Amount]'} per month
- **Security Deposit:** ₹${formData.securityDeposit || '[Amount]'}
- Rent shall be paid by the 5th of every month

### 3. USE OF PREMISES
The premises shall be used solely for residential purposes and no commercial activity shall be conducted.

### 4. MAINTENANCE
- Regular maintenance is the responsibility of the Tenant
- Major repairs shall be borne by the Landlord

### 5. TERMINATION
Either party may terminate this agreement by giving 30 days written notice.

### 6. GOVERNING LAW
This agreement shall be governed by the laws of India and jurisdiction of Indian courts.

## SIGNATURES

**Landlord:**                     **Tenant:**
_________________               _________________
${formData.ownerName || '[Name]'}            ${formData.tenantName || '[Name]'}

Date: ${today}                    Date: ${today}

**Witnesses:**
1. _________________ (Name & Signature)
2. _________________ (Name & Signature)
`;
};

export const generateServiceAgreement = (formData: any) => {
  const today = new Date().toLocaleDateString('en-IN');

  return `
# SERVICE AGREEMENT

**This Service Agreement is executed on ${today} between:**

**CLIENT (First Party):**
${formData.clientName || '[Client Name]'}

**SERVICE PROVIDER (Second Party):**
${formData.providerName || '[Provider Name]'}

## SCOPE OF SERVICES
${formData.serviceScope || '[Detailed description of services to be provided]'}

## TERMS AND CONDITIONS

### 1. SERVICE FEE
Total consideration: ₹${formData.serviceFee || '[Amount]'}
Payment Terms: ${formData.paymentTerms || '[Payment schedule]'}

### 2. TIMELINE
Services shall be completed within the agreed timeline as mutually decided.

### 3. INTELLECTUAL PROPERTY
All work products created during the service period shall belong to the Client.

### 4. CONFIDENTIALITY
Both parties agree to maintain confidentiality of all proprietary information.

### 5. TERMINATION
Either party may terminate with 15 days written notice.

### 6. DISPUTE RESOLUTION
Any disputes shall be resolved through arbitration in accordance with Indian Arbitration Act.

### 7. GOVERNING LAW
This agreement is governed by Indian laws and subject to Indian jurisdiction.

## SIGNATURES

**Client:**                       **Service Provider:**
_________________               _________________
${formData.clientName || '[Name]'}           ${formData.providerName || '[Name]'}

Date: ${today}                    Date: ${today}
`;
};

export const generateNDAgreement = (formData: any) => {
  const today = new Date().toLocaleDateString('en-IN');

  return `
# NON-DISCLOSURE AGREEMENT (NDA)

**This Non-Disclosure Agreement is executed on ${today} between:**

**FIRST PARTY:**
${formData.party1 || '[Party 1 Name]'}

**SECOND PARTY:**
${formData.party2 || '[Party 2 Name]'}

## PURPOSE
${formData.purpose || '[Purpose of sharing confidential information]'}

## DEFINITION OF CONFIDENTIAL INFORMATION
For the purpose of this Agreement, "Confidential Information" includes:
${formData.confidentialInfo || '[Types of confidential information]'}

## TERMS AND CONDITIONS

### 1. OBLIGATIONS
Both parties agree to:
- Keep all Confidential Information strictly confidential
- Use information solely for the stated purpose
- Not disclose to any third party without written consent

### 2. DURATION
This agreement shall remain in effect for ${formData.ndaDuration || '2 years'} from the date of execution.

### 3. EXCEPTIONS
This agreement does not apply to information that:
- Is already in public domain
- Is independently developed
- Is required to be disclosed by law

### 4. RETURN OF INFORMATION
Upon termination, all confidential materials shall be returned or destroyed.

### 5. REMEDIES
Breach of this agreement may result in irreparable harm and equitable relief may be sought.

### 6. GOVERNING LAW
This agreement shall be governed by the laws of ${formData.governingLaw || 'India'}.

## SIGNATURES

**First Party:**                  **Second Party:**
_________________               _________________
${formData.party1 || '[Name]'}                ${formData.party2 || '[Name]'}

Date: ${today}                    Date: ${today}
`;
};

export const generateSaleAgreement = (formData: any) => {
  const today = new Date().toLocaleDateString('en-IN');

  return `
# SALE AGREEMENT

**This Sale Agreement is executed on ${today} between:**

**SELLER (First Party):**
${formData.sellerName || '[Seller Name]'}

**BUYER (Second Party):**
${formData.buyerName || '[Buyer Name]'}

## ITEM/ASSET DETAILS
${formData.itemDescription || '[Detailed description of item/asset being sold]'}

## TERMS AND CONDITIONS

### 1. SALE CONSIDERATION
Total sale price: ₹${formData.salePrice || '[Amount]'}
Payment method: ${formData.paymentMethod || '[Payment method]'}

### 2. DELIVERY
The Seller agrees to deliver the item/asset in good condition.

### 3. TITLE AND OWNERSHIP
Clear and marketable title shall pass to the Buyer upon full payment.

### 4. WARRANTIES
The Seller warrants that:
- They have clear title to the item/asset
- Item is free from encumbrances
- All representations are true and accurate

### 5. RISK AND LIABILITY
Risk of loss shall transfer to Buyer upon delivery.

### 6. DEFAULT
In case of default, the aggrieved party may seek legal remedies.

### 7. GOVERNING LAW
This agreement is governed by Indian laws and subject to Indian jurisdiction.

## SIGNATURES

**Seller:**                       **Buyer:**
_________________               _________________
${formData.sellerName || '[Name]'}            ${formData.buyerName || '[Name]'}

Date: ${today}                    Date: ${today}

**Witnesses:**
1. _________________ (Name & Signature)
2. _________________ (Name & Signature)
`;
};

export const generateCustomAgreement = (formData: any) => {
  const today = new Date().toLocaleDateString('en-IN');

  return `
# ${formData.agreementTitle?.toUpperCase() || 'CUSTOM AGREEMENT'}

**This Agreement is executed on ${today} between:**

**FIRST PARTY:**
${formData.firstParty || '[First Party Name]'}

**SECOND PARTY:**
${formData.secondParty || '[Second Party Name]'}

## TERMS AND CONDITIONS

### 1. AGREEMENT TERMS
${formData.customTerms || '[Detailed terms and conditions of the agreement]'}

### 2. ADDITIONAL CLAUSES
${formData.additionalClauses || '[Any additional clauses or special conditions]'}

### 3. DURATION
This agreement shall remain in effect as mutually agreed by both parties.

### 4. MODIFICATION
This agreement may only be modified in writing signed by both parties.

### 5. SEVERABILITY
If any provision is found unenforceable, the remainder shall remain in effect.

### 6. GOVERNING LAW
This agreement is governed by Indian laws and subject to Indian jurisdiction.

## SIGNATURES

**First Party:**                  **Second Party:**
_________________               _________________
${formData.firstParty || '[Name]'}             ${formData.secondParty || '[Name]'}

Date: ${today}                    Date: ${today}
`;
};

export const getAgreementGenerator = (type: string) => {
  const generators = {
    rental: generateRentalAgreement,
    service: generateServiceAgreement,
    nda: generateNDAgreement,
    sale: generateSaleAgreement,
    custom: generateCustomAgreement,
  };

  return generators[type as keyof typeof generators] || generateCustomAgreement;
};