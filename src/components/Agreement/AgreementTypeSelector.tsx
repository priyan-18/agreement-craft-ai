import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Home, 
  Handshake, 
  Shield, 
  ShoppingCart, 
  Settings,
  ArrowRight 
} from "lucide-react";

interface AgreementType {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  features: string[];
}

interface AgreementTypeSelectorProps {
  onSelectType: (type: string) => void;
}

const agreementTypes: AgreementType[] = [
  {
    id: "rental",
    title: "Rental Agreement",
    description: "Property rental contracts with all legal provisions",
    icon: <Home className="h-6 w-6" />,
    color: "text-blue-600",
    features: ["Rent & deposit terms", "Property details", "Tenant obligations"]
  },
  {
    id: "service",
    title: "Service Agreement",
    description: "Professional service contracts and SOWs",
    icon: <Handshake className="h-6 w-6" />,
    color: "text-emerald-600",
    features: ["Service scope", "Payment terms", "Deliverables"]
  },
  {
    id: "nda",
    title: "Non-Disclosure Agreement",
    description: "Confidentiality agreements for sensitive information",
    icon: <Shield className="h-6 w-6" />,
    color: "text-purple-600",
    features: ["Confidentiality terms", "Duration", "Penalties"]
  },
  {
    id: "sale",
    title: "Sale Agreement",
    description: "Purchase agreements for goods and assets",
    icon: <ShoppingCart className="h-6 w-6" />,
    color: "text-orange-600",
    features: ["Asset details", "Payment terms", "Warranties"]
  },
  {
    id: "custom",
    title: "Custom Agreement",
    description: "Create your own agreement from scratch",
    icon: <Settings className="h-6 w-6" />,
    color: "text-gray-600",
    features: ["Flexible terms", "Custom clauses", "AI assistance"]
  }
];

export const AgreementTypeSelector = ({ onSelectType }: AgreementTypeSelectorProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center animate-fade-in-down">
        <h2 className="text-3xl font-bold text-gradient mb-4">
          Choose Agreement Type
        </h2>
        <p className="text-muted-foreground text-lg">
          Select the type of agreement you'd like to create
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {agreementTypes.map((type, index) => (
          <Card 
            key={type.id} 
            className="glass-card border-0 shadow-lg card-hover cursor-pointer group animate-fade-in-up"
            style={{ animationDelay: `${index * 0.1}s` }}
            onClick={() => onSelectType(type.id)}
          >
            <CardHeader className="text-center">
              <div className={`inline-flex p-3 rounded-full bg-gradient-to-br from-white to-gray-50 shadow-md ${type.color} mb-4`}>
                {type.icon}
              </div>
              <CardTitle className="text-xl font-semibold group-hover:text-primary transition-colors">
                {type.title}
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                {type.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6">
                {type.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-sm text-muted-foreground">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3" />
                    {feature}
                  </li>
                ))}
              </ul>
              
              <Button 
                className="w-full group-hover:bg-primary group-hover:text-white transition-all duration-300"
                variant="outline"
              >
                Select Type
                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
        <Card className="glass-card border-0 shadow-lg inline-block">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <FileText className="h-5 w-5 text-primary" />
              <span className="text-sm text-muted-foreground">
                All agreements include AI-powered content generation and Tamil translation
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};