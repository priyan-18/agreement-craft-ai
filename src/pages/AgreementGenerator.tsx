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
import { useSupabaseAgreements } from "@/hooks/useSupabaseAgreements";
import { getAgreementGenerator } from "@/services/agreementFormats";
import { generateAgreementWithAI } from "@/services/aiService";
import { translateText } from "@/services/translationService";

interface AgreementGeneratorProps {
  onBack?: () => void;
  onAgreementCreated?: () => void;
}

interface FormData {
  [key: string]: any;
}

export const AgreementGenerator = ({ onBack, onAgreementCreated }: AgreementGeneratorProps) => {
  const [currentStep, setCurrentStep] = useState<"select" | "form" | "preview">("select");
  const [selectedType, setSelectedType] = useState<string>("");
  const [formData, setFormData] = useState<FormData>({});
  const [generatedContent, setGeneratedContent] = useState<string>("");
  const [translatedContent, setTranslatedContent] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const { createAgreement } = useSupabaseAgreements();

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
      // Use AI service for enhanced generation
      const aiResponse = await generateAgreementWithAI({
        type: selectedType,
        formData,
        customInstructions: `Generate a professional, legally compliant ${selectedType} agreement in Indian government-approved format.`
      });

      setGeneratedContent(aiResponse.content);
      setCurrentStep("preview");
      
      toast({
        title: "Agreement generated!",
        description: "Your professional AI-powered agreement is ready for review.",
      });
    } catch (error) {
      console.error('AI generation failed, falling back to template:', error);
      
      // Fallback to template-based generation
      const generator = getAgreementGenerator(selectedType);
      const content = generator(formData);
      setGeneratedContent(content);
      setCurrentStep("preview");
      
      toast({
        title: "Agreement generated!",
        description: "Your professional agreement is ready for review.",
      });
    } finally {
      setLoading(false);
    }
  };

  const translateAgreement = async (direction: "en_to_ta" | "ta_to_en") => {
    setTranslating(true);
    try {
      const textToTranslate = direction === "en_to_ta" ? generatedContent : translatedContent;
      const targetLang = direction === "en_to_ta" ? "ta" : "en";
      
      const translationResponse = await translateText(textToTranslate, targetLang);
      setTranslatedContent(translationResponse.translatedText);
      
      toast({
        title: "Translation completed!",
        description: `Agreement translated to ${direction === "en_to_ta" ? "Tamil" : "English"}.`,
      });
    } catch (error) {
      console.error('Translation failed:', error);
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
        form_data: formData,
      };

      await createAgreement(agreement);
      
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

  const translateToTamil = async () => {
    setTranslating(true);
    try {
      const translationResponse = await translateText(generatedContent, 'ta');
      setTranslatedContent(translationResponse.translatedText);
      
      toast({
        title: "Translation completed!",
        description: "Your agreement has been translated to Tamil.",
      });
    } catch (error) {
      console.error('Translation failed:', error);
      toast({
        title: "Translation failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setTranslating(false);
    }
  };

  const downloadPDF = async () => {
    toast({
      title: "PDF Download",
      description: "Your agreement PDF is being generated and will download shortly.",
    });
    
    try {
      // Create a temporary agreement object for PDF generation
      const tempAgreement = {
        id: '',
        title: getAgreementTitle(),
        type: selectedType,
        content: generatedContent,
        form_data: formData,
        status: 'draft' as const,
        creator_id: '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Import PDF service dynamically
      const { downloadPDF: downloadPDFService } = await import('@/services/pdfService');
      await downloadPDFService(tempAgreement);
      
      toast({
        title: "PDF Downloaded",
        description: "Your agreement has been downloaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
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
                onClick={translateToTamil}
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
                onClick={translateToTamil}
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