import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AgreementTypeSelector } from "@/components/Agreement/AgreementTypeSelector";
import { ArrowLeft, Sparkles, Globe, Download, FileText, Eye, Loader2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAgreements } from "@/hooks/useAgreements";
import { getAgreementGenerator } from "@/services/agreementFormats";

interface AgreementGeneratorProps {
  onBack: () => void;
}

interface FormData {
  [key: string]: any;
}

export const AgreementGenerator = ({ onBack }: AgreementGeneratorProps) => {
  const [currentStep, setCurrentStep] = useState<"select" | "form" | "preview">("select");
  const [selectedType, setSelectedType] = useState<string>("");
  const [formData, setFormData] = useState<FormData>({});
  const [generatedContent, setGeneratedContent] = useState<string>("");
  const [translatedContent, setTranslatedContent] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const { saveAgreement } = useAgreements();

  const handleTypeSelect = (type: string) => {
    setSelectedType(type);
    setCurrentStep("form");
  };

  const renderForm = () => {
    const forms = {
      rental: (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="ownerName">Owner/Landlord Name</Label>
              <Input 
                id="ownerName"
                placeholder="Enter owner's full name"
                value={formData.ownerName || ""}
                onChange={(e) => setFormData({...formData, ownerName: e.target.value})}
                className="input-focus"
              />
            </div>
            <div>
              <Label htmlFor="tenantName">Tenant Name</Label>
              <Input 
                id="tenantName"
                placeholder="Enter tenant's full name"
                value={formData.tenantName || ""}
                onChange={(e) => setFormData({...formData, tenantName: e.target.value})}
                className="input-focus"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="propertyAddress">Property Address</Label>
            <Textarea 
              id="propertyAddress"
              placeholder="Enter complete property address"
              value={formData.propertyAddress || ""}
              onChange={(e) => setFormData({...formData, propertyAddress: e.target.value})}
              className="input-focus"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Label htmlFor="monthlyRent">Monthly Rent (₹)</Label>
              <Input 
                id="monthlyRent"
                type="number"
                placeholder="25,000"
                value={formData.monthlyRent || ""}
                onChange={(e) => setFormData({...formData, monthlyRent: e.target.value})}
                className="input-focus"
              />
            </div>
            <div>
              <Label htmlFor="securityDeposit">Security Deposit (₹)</Label>
              <Input 
                id="securityDeposit"
                type="number"
                placeholder="50,000"
                value={formData.securityDeposit || ""}
                onChange={(e) => setFormData({...formData, securityDeposit: e.target.value})}
                className="input-focus"
              />
            </div>
            <div>
              <Label htmlFor="leaseDuration">Lease Duration</Label>
              <Select value={formData.leaseDuration || ""} onValueChange={(value) => setFormData({...formData, leaseDuration: value})}>
                <SelectTrigger className="input-focus">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="11-months">11 Months</SelectItem>
                  <SelectItem value="1-year">1 Year</SelectItem>
                  <SelectItem value="2-years">2 Years</SelectItem>
                  <SelectItem value="3-years">3 Years</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="startDate">Lease Start Date</Label>
              <Input 
                id="startDate"
                type="date"
                value={formData.startDate || ""}
                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                className="input-focus"
              />
            </div>
            <div>
              <Label htmlFor="endDate">Lease End Date</Label>
              <Input 
                id="endDate"
                type="date"
                value={formData.endDate || ""}
                onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                className="input-focus"
              />
            </div>
          </div>
        </div>
      ),
      service: (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="clientName">Client Name</Label>
              <Input 
                id="clientName"
                placeholder="Enter client's name/company"
                value={formData.clientName || ""}
                onChange={(e) => setFormData({...formData, clientName: e.target.value})}
                className="input-focus"
              />
            </div>
            <div>
              <Label htmlFor="providerName">Service Provider</Label>
              <Input 
                id="providerName"
                placeholder="Enter provider's name/company"
                value={formData.providerName || ""}
                onChange={(e) => setFormData({...formData, providerName: e.target.value})}
                className="input-focus"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="serviceScope">Service Scope</Label>
            <Textarea 
              id="serviceScope"
              placeholder="Describe the services to be provided"
              value={formData.serviceScope || ""}
              onChange={(e) => setFormData({...formData, serviceScope: e.target.value})}
              className="input-focus"
              rows={4}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="serviceFee">Service Fee (₹)</Label>
              <Input 
                id="serviceFee"
                type="number"
                placeholder="1,00,000"
                value={formData.serviceFee || ""}
                onChange={(e) => setFormData({...formData, serviceFee: e.target.value})}
                className="input-focus"
              />
            </div>
            <div>
              <Label htmlFor="paymentTerms">Payment Terms</Label>
              <Select value={formData.paymentTerms || ""} onValueChange={(value) => setFormData({...formData, paymentTerms: value})}>
                <SelectTrigger className="input-focus">
                  <SelectValue placeholder="Select terms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="upfront">100% Upfront</SelectItem>
                  <SelectItem value="50-50">50% Upfront, 50% on Completion</SelectItem>
                  <SelectItem value="monthly">Monthly Payments</SelectItem>
                  <SelectItem value="milestone">Milestone Based</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      ),
      nda: (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="party1">First Party</Label>
              <Input 
                id="party1"
                placeholder="Enter first party name"
                value={formData.party1 || ""}
                onChange={(e) => setFormData({...formData, party1: e.target.value})}
                className="input-focus"
              />
            </div>
            <div>
              <Label htmlFor="party2">Second Party</Label>
              <Input 
                id="party2"
                placeholder="Enter second party name"
                value={formData.party2 || ""}
                onChange={(e) => setFormData({...formData, party2: e.target.value})}
                className="input-focus"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="purpose">Purpose of NDA</Label>
            <Textarea 
              id="purpose"
              placeholder="Describe the purpose for sharing confidential information"
              value={formData.purpose || ""}
              onChange={(e) => setFormData({...formData, purpose: e.target.value})}
              className="input-focus"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="confidentialInfo">Types of Confidential Information</Label>
            <Textarea 
              id="confidentialInfo"
              placeholder="Describe what information is considered confidential"
              value={formData.confidentialInfo || ""}
              onChange={(e) => setFormData({...formData, confidentialInfo: e.target.value})}
              className="input-focus"
              rows={4}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="ndaDuration">NDA Duration</Label>
              <Select value={formData.ndaDuration || ""} onValueChange={(value) => setFormData({...formData, ndaDuration: value})}>
                <SelectTrigger className="input-focus">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-year">1 Year</SelectItem>
                  <SelectItem value="2-years">2 Years</SelectItem>
                  <SelectItem value="3-years">3 Years</SelectItem>
                  <SelectItem value="5-years">5 Years</SelectItem>
                  <SelectItem value="indefinite">Indefinite</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="governingLaw">Governing Law</Label>
              <Select value={formData.governingLaw || ""} onValueChange={(value) => setFormData({...formData, governingLaw: value})}>
                <SelectTrigger className="input-focus">
                  <SelectValue placeholder="Select jurisdiction" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="india">India</SelectItem>
                  <SelectItem value="mumbai">Mumbai, India</SelectItem>
                  <SelectItem value="delhi">Delhi, India</SelectItem>
                  <SelectItem value="bangalore">Bangalore, India</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      ),
      sale: (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="buyerName">Buyer Name</Label>
              <Input 
                id="buyerName"
                placeholder="Enter buyer's name"
                value={formData.buyerName || ""}
                onChange={(e) => setFormData({...formData, buyerName: e.target.value})}
                className="input-focus"
              />
            </div>
            <div>
              <Label htmlFor="sellerName">Seller Name</Label>
              <Input 
                id="sellerName"
                placeholder="Enter seller's name"
                value={formData.sellerName || ""}
                onChange={(e) => setFormData({...formData, sellerName: e.target.value})}
                className="input-focus"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="itemDescription">Item/Asset Description</Label>
            <Textarea 
              id="itemDescription"
              placeholder="Describe the item or asset being sold"
              value={formData.itemDescription || ""}
              onChange={(e) => setFormData({...formData, itemDescription: e.target.value})}
              className="input-focus"
              rows={3}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="salePrice">Sale Price (₹)</Label>
              <Input 
                id="salePrice"
                type="number"
                placeholder="5,00,000"
                value={formData.salePrice || ""}
                onChange={(e) => setFormData({...formData, salePrice: e.target.value})}
                className="input-focus"
              />
            </div>
            <div>
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select value={formData.paymentMethod || ""} onValueChange={(value) => setFormData({...formData, paymentMethod: value})}>
                <SelectTrigger className="input-focus">
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                  <SelectItem value="cheque">Cheque</SelectItem>
                  <SelectItem value="installment">Installments</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      ),
      custom: (
        <div className="space-y-6">
          <div>
            <Label htmlFor="agreementTitle">Agreement Title</Label>
            <Input 
              id="agreementTitle"
              placeholder="Enter a title for your agreement"
              value={formData.agreementTitle || ""}
              onChange={(e) => setFormData({...formData, agreementTitle: e.target.value})}
              className="input-focus"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="firstParty">First Party</Label>
              <Input 
                id="firstParty"
                placeholder="Enter first party name"
                value={formData.firstParty || ""}
                onChange={(e) => setFormData({...formData, firstParty: e.target.value})}
                className="input-focus"
              />
            </div>
            <div>
              <Label htmlFor="secondParty">Second Party</Label>
              <Input 
                id="secondParty"
                placeholder="Enter second party name"
                value={formData.secondParty || ""}
                onChange={(e) => setFormData({...formData, secondParty: e.target.value})}
                className="input-focus"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="customTerms">Agreement Terms & Conditions</Label>
            <Textarea 
              id="customTerms"
              placeholder="Describe the terms, conditions, and obligations of each party"
              value={formData.customTerms || ""}
              onChange={(e) => setFormData({...formData, customTerms: e.target.value})}
              className="input-focus"
              rows={6}
            />
          </div>

          <div>
            <Label htmlFor="additionalClauses">Additional Clauses</Label>
            <Textarea 
              id="additionalClauses"
              placeholder="Any additional clauses or special conditions"
              value={formData.additionalClauses || ""}
              onChange={(e) => setFormData({...formData, additionalClauses: e.target.value})}
              className="input-focus"
              rows={4}
            />
          </div>
        </div>
      )
    };

    return forms[selectedType as keyof typeof forms] || null;
  };

  const generateAgreement = async () => {
    setLoading(true);
    try {
      // Simulate AI generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Use Indian government-approved format
      const generator = getAgreementGenerator(selectedType);
      const content = generator(formData);

      setGeneratedContent(content);
      setCurrentStep("preview");
      
      toast({
        title: "Agreement generated!",
        description: "Your professional agreement is ready for review.",
      });
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const translateAgreement = async (direction: "en_to_ta" | "ta_to_en") => {
    setTranslating(true);
    try {
      // Simulate translation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockTranslation = direction === "en_to_ta" 
        ? "இந்த ஒப்பந்தம் கீழ்க்கண்ட தரப்பினர்களுக்கிடையே செய்யப்படுகிறது..."
        : generatedContent;
        
      setTranslatedContent(mockTranslation);
      
      toast({
        title: "Translation completed!",
        description: `Agreement translated to ${direction === "en_to_ta" ? "Tamil" : "English"}.`,
      });
    } catch (error) {
      toast({
        title: "Translation failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setTranslating(false);
    }
  };

  const saveAgreementToStorage = async () => {
    setSaving(true);
    try {
      const title = getAgreementTitle();
      
      const agreement = {
        title,
        type: selectedType,
        content: generatedContent,
        formData,
        status: "completed" as const,
      };

      saveAgreement(agreement);
      
      toast({
        title: "Agreement saved!",
        description: "Your agreement has been saved to your dashboard.",
      });
    } catch (error) {
      toast({
        title: "Save failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const getAgreementTitle = () => {
    switch (selectedType) {
      case 'rental':
        return `${formData.propertyAddress ? 'Rental Agreement - ' + formData.propertyAddress.split(',')[0] : 'Rental Agreement'}`;
      case 'service':
        return `Service Agreement - ${formData.clientName || 'Client'}`;
      case 'nda':
        return `NDA - ${formData.party1 || 'Party'} & ${formData.party2 || 'Party'}`;
      case 'sale':
        return `Sale Agreement - ${formData.itemDescription?.split(' ').slice(0, 3).join(' ') || 'Item'}`;
      case 'custom':
        return formData.agreementTitle || 'Custom Agreement';
      default:
        return 'Agreement';
    }
  };

  const translateContent = async () => {
    setTranslating(true);
    try {
      // Simulate translation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockTamilContent = `**${selectedType.toUpperCase()} ஒப்பந்தம்**

இந்த ஒப்பந்தம் ${new Date().toLocaleDateString()} தேதியில் கீழே விவரிக்கப்பட்ட தரப்பினர்களுக்கு இடையே செய்யப்பட்டது.

**தரப்பினர்:**
${selectedType === 'rental' ? 
  `- வீட்டு உரிமையாளர்: ${formData.ownerName || '[உரிமையாளர் பெயர்]'}
- வாடகைதாரர்: ${formData.tenantName || '[வாடகைதாரர் பெயர்]'}

**சொத்து விவரங்கள்:**
முகவரி: ${formData.propertyAddress || '[சொத்து முகவரி]'}
மாதாந்திர வாடகை: ₹${formData.monthlyRent || '[தொகை]'}
பாதுகாப்பு வைப்பு: ₹${formData.securityDeposit || '[தொகை]'}` : 'தரப்பினர் விவரங்கள்...'}

**விதிமுறைகள் மற்றும் நிபந்தனைகள்:**

1. **கடமைகள்:** ஒவ்வொரு தரப்பினரும் இந்த ஒப்பந்தத்தில் குறிப்பிடப்பட்ட அந்தந்த கடமைகளை நிறைவேற்ற ஒப்புக்கொள்கின்றனர்.

2. **கால அளவு:** இந்த ஒப்பந்தம் குறிப்பிட்ட கால அளவிற்கு அல்லது இதன் விதிமுறைகளின்படி முடிவு செய்யப்படும் வரை நடைமுறையில் இருக்கும்.

**கையொப்பங்கள்:**

தரப்பு 1: _________________________    தேதி: ______________

தரப்பு 2: _________________________    தேதி: ______________

**குறிப்பு:** இது AI-உறுதிப்படுத்தப்பட்ட சட்ட ஆவண டெம்ப்ளேட் ஆகும். எந்தவொரு அதிகாரப்பூர்வ நோக்கங்களுக்காகவும் இந்த ஒப்பந்தத்தைப் பயன்படுத்துவதற்கு முன்பு தகுதிவாய்ந்த சட்ட வல்லுநரிடம் ஆலோசித்துக் கொள்ளவும்.`;

      setTranslatedContent(mockTamilContent);
      
      toast({
        title: "Translation completed!",
        description: "Your agreement has been translated to Tamil.",
      });
    } catch (error) {
      toast({
        title: "Translation failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setTranslating(false);
    }
  };

  const downloadPDF = () => {
    toast({
      title: "PDF Download",
      description: "Your agreement PDF is being generated and will download shortly.",
    });
    // Simulate PDF generation
    setTimeout(() => {
      const element = document.createElement('a');
      const file = new Blob([generatedContent], {type: 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = `${selectedType}-agreement.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }, 1500);
  };

  if (currentStep === "select") {
    return (
      <div className="min-h-screen bg-gradient-app">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <Button variant="outline" onClick={onBack} className="btn-hover">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
          <AgreementTypeSelector onSelectType={handleTypeSelect} />
        </div>
      </div>
    );
  }

  if (currentStep === "form") {
    return (
      <div className="min-h-screen bg-gradient-app">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <Button variant="outline" onClick={() => setCurrentStep("select")} className="btn-hover">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Types
            </Button>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="glass-card border-0 shadow-xl animate-fade-in-up">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl text-gradient capitalize">
                  {selectedType} Agreement Details
                </CardTitle>
                <CardDescription className="text-lg">
                  Fill in the details to generate your professional agreement
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {renderForm()}
                
                <div className="flex justify-end pt-6">
                  <Button 
                    onClick={generateAgreement}
                    disabled={loading}
                    className="primary-gradient text-white btn-hover px-8"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating with AI...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Generate Agreement
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-app">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button variant="outline" onClick={() => setCurrentStep("form")} className="btn-hover">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Form
          </Button>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 animate-fade-in-down">
            <h2 className="text-3xl font-bold text-gradient mb-4">
              Your Agreement is Ready! 🎉
            </h2>
            <p className="text-muted-foreground text-lg">
              Review, translate, and download your professional agreement
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* English Content */}
            <Card className="glass-card border-0 shadow-xl animate-fade-in-left">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">English Version</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="btn-hover">
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                    <Button onClick={downloadPDF} size="sm" className="btn-hover">
                      <Download className="h-4 w-4 mr-2" />
                      PDF
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-white/50 rounded-lg p-6 max-h-96 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm leading-relaxed">
                    {generatedContent}
                  </pre>
                </div>
              </CardContent>
            </Card>

            {/* Tamil Translation */}
            <Card className="glass-card border-0 shadow-xl animate-fade-in-right">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">Tamil Translation</CardTitle>
                  <Button 
                    onClick={() => translateAgreement("en_to_ta")}
                    disabled={translating}
                    variant={translatedContent ? "outline" : "default"}
                    size="sm" 
                    className="btn-hover"
                  >
                    {translating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Translating...
                      </>
                    ) : (
                      <>
                        <Globe className="h-4 w-4 mr-2" />
                        {translatedContent ? "Re-translate" : "Translate"}
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-white/50 rounded-lg p-6 max-h-96 overflow-y-auto">
                  {translatedContent ? (
                    <pre className="whitespace-pre-wrap text-sm leading-relaxed">
                      {translatedContent}
                    </pre>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <Globe className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Click "Translate" to convert this agreement to Tamil</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8 animate-fade-in-up">
            <div className="flex flex-wrap gap-4 justify-center mb-6">
              <Button
                onClick={saveAgreementToStorage}
                disabled={saving}
                className="primary-gradient text-white btn-hover"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save Agreement
              </Button>
              
              <Button
                onClick={() => translateAgreement("en_to_ta")}
                disabled={translating}
                className="bg-emerald-600 hover:bg-emerald-700 text-white btn-hover"
              >
                {translating ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Globe className="h-4 w-4 mr-2" />
                )}
                Translate to Tamil
              </Button>
              
              <Button
                onClick={downloadPDF}
                variant="outline"
                className="btn-hover"
              >
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
            
            <Card className="glass-card border-0 shadow-lg inline-block">
              <CardContent className="p-6">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-secondary" />
                    <span className="text-sm font-medium">Government Format</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium">AI Generated</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Globe className="h-5 w-5 text-purple-600" />
                    <span className="text-sm font-medium">Multi-language</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};