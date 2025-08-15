import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, CheckCircle, Clock, TrendingUp } from "lucide-react";

interface StatsData {
  total: number;
  completed: number;
  drafts: number;
  thisMonth: number;
}

interface DashboardStatsProps {
  stats: StatsData;
}

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

export const DashboardStats = ({ stats }: DashboardStatsProps) => {
  const statsData = [
    {
      title: "Total Agreements",
      value: stats.total.toString(),
      description: "All time created",
      icon: <FileText className="h-4 w-4 text-primary" />,
      trend: stats.total > 0 ? "+100%" : "0%"
    },
    {
      title: "Completed",
      value: stats.completed.toString(),
      description: "Ready for use",
      icon: <CheckCircle className="h-4 w-4 text-primary" />,
      trend: stats.total > 0 ? `${Math.round((stats.completed / stats.total) * 100)}%` : "0%"
    },
    {
      title: "Drafts",
      value: stats.drafts.toString(),
      description: "Work in progress",
      icon: <Clock className="h-4 w-4 text-primary" />,
      trend: stats.total > 0 ? `${Math.round((stats.drafts / stats.total) * 100)}%` : "0%"
    },
    {
      title: "This Month",
      value: stats.thisMonth.toString(),
      description: "Created recently",
      icon: <TrendingUp className="h-4 w-4 text-primary" />,
      trend: stats.thisMonth > 0 ? `+${stats.thisMonth}` : "0"
    }
  ];

  return (
    <div className="animate-fade-in-up">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat, index) => (
          <div key={stat.title} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
            <StatsCard
              title={stat.title}
              value={stat.value}
              description={stat.description}
              icon={stat.icon}
              trend={stat.trend}
            />
          </div>
        ))}
      </div>
    </div>
  );
};