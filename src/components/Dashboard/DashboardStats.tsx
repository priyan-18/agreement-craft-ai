import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Clock, Download, TrendingUp } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  trend?: string;
}

const StatsCard = ({ title, value, description, icon, trend }: StatsCardProps) => (
  <Card className="glass-card border-0 shadow-lg card-hover">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">
        {title}
      </CardTitle>
      <div className="p-2 bg-primary/10 rounded-lg">
        {icon}
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-gradient">{value}</div>
      <p className="text-xs text-muted-foreground">
        {description}
      </p>
      {trend && (
        <div className="flex items-center mt-2">
          <TrendingUp className="h-3 w-3 text-secondary mr-1" />
          <span className="text-xs text-secondary font-medium">{trend}</span>
        </div>
      )}
    </CardContent>
  </Card>
);

export const DashboardStats = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <div className="animate-fade-in-up">
        <StatsCard
          title="Total Agreements"
          value="12"
          description="Agreements created this month"
          icon={<FileText className="h-4 w-4 text-primary" />}
          trend="+20% from last month"
        />
      </div>
      
      <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <StatsCard
          title="Recent Activity"
          value="3"
          description="Agreements created this week"
          icon={<Clock className="h-4 w-4 text-primary" />}
          trend="2 pending review"
        />
      </div>
      
      <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <StatsCard
          title="Downloads"
          value="8"
          description="PDFs downloaded this month"
          icon={<Download className="h-4 w-4 text-primary" />}
          trend="5 this week"
        />
      </div>
      
      <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
        <StatsCard
          title="Success Rate"
          value="100%"
          description="Successful generations"
          icon={<TrendingUp className="h-4 w-4 text-primary" />}
          trend="Perfect score!"
        />
      </div>
    </div>
  );
};