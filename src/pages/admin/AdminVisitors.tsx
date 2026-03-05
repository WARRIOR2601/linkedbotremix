import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Globe,
  Users,
  MousePointerClick,
  Eye,
  Loader2,
  Shield,
  Clock,
  MonitorSmartphone,
  ArrowUpRight,
  MapPin,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { format, subDays, subHours } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const AdminVisitors = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pageViews, setPageViews] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalPageViews: 0,
    uniqueVisitors: 0,
    todayPageViews: 0,
    last24hViews: 0,
    avgViewsPerVisitor: 0,
  });
  const [dailyTraffic, setDailyTraffic] = useState<any[]>([]);
  const [topPages, setTopPages] = useState<any[]>([]);
  const [topReferrers, setTopReferrers] = useState<any[]>([]);
  const [hourlyTraffic, setHourlyTraffic] = useState<any[]>([]);
  const [deviceBreakdown, setDeviceBreakdown] = useState<any[]>([]);
  const [recentVisitors, setRecentVisitors] = useState<any[]>([]);

  useEffect(() => {
    const checkAndFetch = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { navigate("/login"); return; }

        const { data } = await supabase.rpc("is_admin", { _user_id: user.id });
        setIsAdmin(data === true);

        if (data === true) await fetchVisitorData();
      } catch {
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };
    checkAndFetch();
  }, [navigate]);

  const fetchVisitorData = async () => {
    const { data: pvData } = await supabase
      .from("page_views" as any)
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5000);

    const views = (pvData || []) as any[];
    setPageViews(views);

    const today = format(new Date(), "yyyy-MM-dd");
    const last24h = subHours(new Date(), 24).toISOString();
    const uniqueIds = new Set(views.map((v: any) => v.visitor_id));
    const todayViews = views.filter((v: any) => v.created_at?.startsWith(today));
    const last24hViews = views.filter((v: any) => v.created_at >= last24h);

    setStats({
      totalPageViews: views.length,
      uniqueVisitors: uniqueIds.size,
      todayPageViews: todayViews.length,
      last24hViews: last24hViews.length,
      avgViewsPerVisitor: uniqueIds.size > 0 ? Math.round(views.length / uniqueIds.size * 10) / 10 : 0,
    });

    // Daily traffic (last 30 days)
    const dailyMap: Record<string, { views: number; visitors: Set<string> }> = {};
    for (let i = 29; i >= 0; i--) {
      const d = format(subDays(new Date(), i), "MMM d");
      dailyMap[d] = { views: 0, visitors: new Set() };
    }
    views.forEach((v: any) => {
      if (v.created_at) {
        const d = format(new Date(v.created_at), "MMM d");
        if (dailyMap[d]) {
          dailyMap[d].views++;
          if (v.visitor_id) dailyMap[d].visitors.add(v.visitor_id);
        }
      }
    });
    setDailyTraffic(
      Object.entries(dailyMap).map(([date, data]) => ({
        date,
        views: data.views,
        visitors: data.visitors.size,
      }))
    );

    // Top pages
    const pageCounts: Record<string, number> = {};
    views.forEach((v: any) => {
      pageCounts[v.page_path] = (pageCounts[v.page_path] || 0) + 1;
    });
    setTopPages(
      Object.entries(pageCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([page, count]) => ({ page, count, percentage: Math.round((count / views.length) * 100) }))
    );

    // Top referrers
    const refCounts: Record<string, number> = {};
    views.forEach((v: any) => {
      const ref = v.referrer ? new URL(v.referrer).hostname : "Direct";
      refCounts[ref] = (refCounts[ref] || 0) + 1;
    });
    setTopReferrers(
      Object.entries(refCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([source, count]) => ({ source, count }))
    );

    // Hourly traffic (today)
    const hourMap: Record<string, number> = {};
    for (let h = 0; h < 24; h++) {
      hourMap[`${h.toString().padStart(2, "0")}:00`] = 0;
    }
    todayViews.forEach((v: any) => {
      if (v.created_at) {
        const h = format(new Date(v.created_at), "HH");
        hourMap[`${h}:00`]++;
      }
    });
    setHourlyTraffic(
      Object.entries(hourMap).map(([hour, count]) => ({ hour, count }))
    );

    // Device breakdown from user agent
    const devices: Record<string, number> = { Mobile: 0, Desktop: 0, Tablet: 0 };
    views.forEach((v: any) => {
      const ua = (v.user_agent || "").toLowerCase();
      if (/mobile|android|iphone/.test(ua)) devices.Mobile++;
      else if (/tablet|ipad/.test(ua)) devices.Tablet++;
      else devices.Desktop++;
    });
    setDeviceBreakdown(
      Object.entries(devices).map(([device, count]) => ({ device, count, percentage: Math.round((count / views.length) * 100) }))
    );

    // Recent visitors
    const seen = new Set<string>();
    const recent: any[] = [];
    for (const v of views) {
      if (v.visitor_id && !seen.has(v.visitor_id)) {
        seen.add(v.visitor_id);
        const visitorViews = views.filter((pv: any) => pv.visitor_id === v.visitor_id);
        recent.push({
          visitor_id: v.visitor_id.slice(0, 8),
          last_page: v.page_path,
          last_seen: v.created_at,
          total_views: visitorViews.length,
          is_logged_in: !!v.user_id,
        });
        if (recent.length >= 20) break;
      }
    }
    setRecentVisitors(recent);
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  if (!isAdmin) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <Shield className="w-16 h-16 text-muted-foreground" />
          <h1 className="text-2xl font-bold">Access Denied</h1>
          <Button onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Globe className="w-8 h-8 text-primary" />
            Website Visitors
          </h1>
          <p className="text-muted-foreground mt-1">
            Track website traffic, visitor behavior, and page performance
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-5 gap-4"
        >
          {[
            { icon: Eye, label: "Total Page Views", value: stats.totalPageViews, color: "text-primary" },
            { icon: Users, label: "Unique Visitors", value: stats.uniqueVisitors, color: "text-primary" },
            { icon: MousePointerClick, label: "Today's Views", value: stats.todayPageViews, color: "text-primary" },
            { icon: Clock, label: "Last 24h", value: stats.last24hViews, color: "text-primary" },
            { icon: ArrowUpRight, label: "Avg Views/Visitor", value: stats.avgViewsPerVisitor, color: "text-primary" },
          ].map((stat, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Traffic Chart (30 days) */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Website Traffic (Last 30 Days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dailyTraffic}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis dataKey="date" className="text-xs" tick={{ fontSize: 11 }} interval={4} />
                    <YAxis className="text-xs" />
                    <Tooltip />
                    <Area type="monotone" dataKey="views" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} name="Page Views" />
                    <Area type="monotone" dataKey="visitors" stroke="hsl(var(--accent-foreground))" fill="hsl(var(--accent))" fillOpacity={0.15} name="Unique Visitors" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Pages */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Top Pages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Page</TableHead>
                      <TableHead className="text-right">Views</TableHead>
                      <TableHead className="text-right">%</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topPages.map((p, i) => (
                      <TableRow key={i}>
                        <TableCell className="font-mono text-sm truncate max-w-[200px]">{p.page}</TableCell>
                        <TableCell className="text-right font-medium">{p.count}</TableCell>
                        <TableCell className="text-right text-muted-foreground">{p.percentage}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>

          {/* Top Referrers */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowUpRight className="w-5 h-5" />
                  Traffic Sources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topReferrers} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis type="number" />
                      <YAxis dataKey="source" type="category" className="text-xs" width={120} tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} name="Visits" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Hourly Traffic */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Today's Hourly Traffic
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={hourlyTraffic}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis dataKey="hour" className="text-xs" interval={3} tick={{ fontSize: 10 }} />
                      <YAxis className="text-xs" />
                      <Tooltip />
                      <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Views" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Device Breakdown */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MonitorSmartphone className="w-5 h-5" />
                  Device Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 pt-2">
                  {deviceBreakdown.map((d, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{d.device}</span>
                        <span className="text-sm text-muted-foreground">{d.count.toLocaleString()} ({d.percentage}%)</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div
                          className="bg-primary h-2.5 rounded-full transition-all"
                          style={{ width: `${d.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recent Visitors Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Recent Visitors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Visitor ID</TableHead>
                    <TableHead>Last Page</TableHead>
                    <TableHead>Last Seen</TableHead>
                    <TableHead className="text-right">Total Views</TableHead>
                    <TableHead>Type</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentVisitors.map((v, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-mono text-sm">{v.visitor_id}…</TableCell>
                      <TableCell className="font-mono text-sm truncate max-w-[200px]">{v.last_page}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {v.last_seen ? format(new Date(v.last_seen), "MMM d, HH:mm") : "—"}
                      </TableCell>
                      <TableCell className="text-right font-medium">{v.total_views}</TableCell>
                      <TableCell>
                        <Badge variant={v.is_logged_in ? "default" : "secondary"}>
                          {v.is_logged_in ? "User" : "Guest"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AdminLayout>
  );
};

export default AdminVisitors;
