import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  GraduationCap,
  Building,
  Plus,
  ArrowLeft,
  Trash2,
  Edit,
  Eye,
  Save,
  X,
  MapPin,
  Phone,
  Mail,
  Globe,
  Award,
  TrendingUp,
  Users,
  ArrowUp,
  MoreHorizontal,
  ExternalLink,
} from "lucide-react";

// University interface matching the provided data structure
interface University {
  id: string;
  key: number;
  title: string;
  city: string;
  province: string;
  degree: string;
  discipline: string;
  fee: number;
  merit: number;
  ranking: number;
  status: number;
  contact: string;
  info: string;
  web: string;
  url: string;
  logo: string;
  admissions: string;
  map: {
    address: string;
    lat: number;
    long: number;
    location: string;
  };
  deadline: string;
  admission: string;
  createdAt?: string; // from MongoDB timestamps
}

// Disciplines and provinces options
const disciplines = [
  "Medical",
  "Engineering",
  "Computer Science",
  "Business",
  "Law",
  "Arts",
  "Sciences",
  "Social Sciences",
  "Agriculture",
  "Pharmacy",
];

const degrees = [
  "MBBS",
  "BDS",
  "BS Computer Science",
  "BS Engineering",
  "BS Business Administration",
  "LLB",
  "BS Arts",
  "BS Sciences",
  "BS Agriculture",
  "Pharm-D",
];

const provinces = [
  "Punjab",
  "Sindh",
  "KPK",
  "Balochistan",
  "Gilgit-Baltistan",
  "AJK",
  "Islamabad",
];

const cities = [
  "Islamabad",
  "Lahore",
  "Karachi",
  "Peshawar",
  "Quetta",
  "Faisalabad",
  "Rawalpindi",
  "Multan",
  "Hyderabad",
  "Gujranwala",
];

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // State
  const [universities, setUniversities] = useState<University[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUniversity, setEditingUniversity] = useState<University | null>(null);
  const [viewingUniversity, setViewingUniversity] = useState<University | null>(null);

  // Load universities from MongoDB via backend API on mount
  useEffect(() => {
    const loadUniversities = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

        const response = await fetch(`${apiUrl}/admin/companies`, {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || 'Failed to fetch universities');
        }

        const data = await response.json();

        if (data.success && data.universities) {
          const transformedData = data.universities.map((uni: any) => ({
            id: uni.id,
            key: uni.key ?? 0,
            title: uni.title,
            city: uni.city,
            province: uni.province,
            degree: uni.degree,
            discipline: uni.discipline,
            fee: uni.fee ?? 0,
            merit: uni.merit ?? 0,
            ranking: uni.ranking ?? 0,
            status: uni.status ?? 1,
            contact: uni.contact ?? '',
            info: uni.info ?? '',
            web: uni.web ?? '',
            url: uni.url ?? '',
            logo: uni.logo ?? '',
            admissions: uni.admissions ?? '0.0',
            map: {
              address: uni.map?.address || '',
              lat: uni.map?.lat || 0,
              long: uni.map?.long || 0,
              location: uni.map?.location || uni.city,
            },
            deadline: uni.deadline || '<NA>',
            admission: uni.admission || '',
            createdAt: uni.createdAt,
          }));

          setUniversities(transformedData);
        }
      } catch (error) {
        console.error('Error loading universities (dashboard):', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load universities data from database',
        });
      }
    };

    loadUniversities();
  }, [toast]);
  
  // Form state matching exact data structure
  const [formData, setFormData] = useState<Partial<University>>({
    title: "",
    city: "",
    province: "",
    degree: "",
    discipline: "",
    fee: 0,
    merit: 0,
    ranking: 0,
    status: 1,
    contact: "",
    info: "",
    web: "",
    url: "",
    logo: "",
    admissions: "1.0",
    map: {
      address: "",
      lat: 0,
      long: 0,
      location: "",
    },
    deadline: "<NA>",
    admission: "nan",
  });

  // Stats data
  const stats = [
    {
      title: "Total Universities",
      value: universities.length,
      change: 12,
      trend: "up",
      period: "from last month",
      icon: Building,
    },
    {
      title: "Active Admissions",
      value: universities.filter((u) => u.status === 1).length,
      change: 8,
      trend: "up",
      period: "from last month",
      icon: Users,
    },
    {
      title: "Avg Merit Score",
      value: universities.length > 0
        ? Math.round(universities.reduce((sum, u) => sum + u.merit, 0) / universities.length)
        : 0,
      change: 3,
      trend: "up",
      period: "from last year",
      icon: TrendingUp,
    },
    {
      title: "Total Disciplines",
      value: new Set(universities.map((u) => u.discipline)).size,
      change: 2,
      trend: "up",
      period: "new this month",
      icon: Award,
    },
  ];

  // Get recent 5 universities based on creation time
  const recentUniversities = [...universities]
    .sort((a, b) => {
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bTime - aTime;
    })
    .slice(0, 5);

  // Reset form
  const resetForm = () => {
    setFormData({
      title: "",
      city: "",
      province: "",
      degree: "",
      discipline: "",
      fee: 0,
      merit: 0,
      ranking: 0,
      status: 1,
      contact: "",
      info: "",
      web: "",
      url: "",
      logo: "",
      admissions: "1.0",
      map: {
        address: "",
        lat: 0,
        long: 0,
        location: "",
      },
      deadline: "<NA>",
      admission: "nan",
    });
    setEditingUniversity(null);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.city || !formData.discipline) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields (Title, City, Discipline)",
        variant: "destructive",
      });
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

      if (!editingUniversity) {
        // ---- CREATE ----
        const response = await fetch(`${apiUrl}/admin/companies`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          const err = await response.json().catch(() => ({}));
          throw new Error(err.message || "Failed to add university");
        }

        const data = await response.json();
        const uni = data.university;

        const transformed: University = {
          id: uni.id,
          key: uni.key ?? 0,
          title: uni.title,
          city: uni.city,
          province: uni.province,
          degree: uni.degree,
          discipline: uni.discipline,
          fee: uni.fee ?? 0,
          merit: uni.merit ?? 0,
          ranking: uni.ranking ?? 0,
          status: uni.status ?? 1,
          contact: uni.contact ?? "",
          info: uni.info ?? "",
          web: uni.web ?? "",
          url: uni.url ?? "",
          logo: uni.logo ?? "",
          admissions: uni.admissions ?? "0.0",
          map: {
            address: uni.map?.address ?? "",
            lat: uni.map?.lat ?? 0,
            long: uni.map?.long ?? 0,
            location: uni.map?.location ?? uni.city,
          },
          deadline: uni.deadline ?? "<NA>",
          admission: uni.admission ?? "",
          createdAt: uni.createdAt,
        };

        setUniversities((prev) => [...prev, transformed]);
        toast({
          title: "University Added",
          description: `${transformed.title} has been added successfully.`,
        });
      } else {
        // ---- UPDATE ----
        const response = await fetch(`${apiUrl}/admin/companies/${editingUniversity.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          const err = await response.json().catch(() => ({}));
          throw new Error(err.message || "Failed to update university");
        }

        const data = await response.json();
        const uni = data.university;

        const transformed: University = {
          id: uni.id,
          key: uni.key ?? editingUniversity.key,
          title: uni.title,
          city: uni.city,
          province: uni.province,
          degree: uni.degree,
          discipline: uni.discipline,
          fee: uni.fee ?? 0,
          merit: uni.merit ?? 0,
          ranking: uni.ranking ?? 0,
          status: uni.status ?? 1,
          contact: uni.contact ?? "",
          info: uni.info ?? "",
          web: uni.web ?? "",
          url: uni.url ?? "",
          logo: uni.logo ?? "",
          admissions: uni.admissions ?? "0.0",
          map: {
            address: uni.map?.address ?? "",
            lat: uni.map?.lat ?? 0,
            long: uni.map?.long ?? 0,
            location: uni.map?.location ?? uni.city,
          },
          deadline: uni.deadline ?? "<NA>",
          admission: uni.admission ?? "",
          createdAt: uni.createdAt ?? editingUniversity.createdAt,
        };

        setUniversities((prev) =>
          prev.map((u) => (u.id === editingUniversity.id ? transformed : u))
        );
        toast({
          title: "University Updated",
          description: `${transformed.title} has been updated successfully.`,
        });
      }

      resetForm();
      setShowAddForm(false);
    } catch (error: any) {
      console.error("Error saving university:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to save university",
      });
    }
  };

  // Handle edit
  const handleEdit = (university: University) => {
    setFormData(university);
    setEditingUniversity(university);
    setShowAddForm(true);
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem("adminToken");
      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

      const response = await fetch(`${apiUrl}/admin/companies/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || "Failed to delete university");
      }

      setUniversities((prev) => prev.filter((u) => u.id !== id));
      toast({
        title: "University Deleted",
        description: "University has been removed successfully.",
      });
    } catch (error: any) {
      console.error("Error deleting university:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to delete university",
      });
    }
  };

  // Get status badge
  const getStatusBadge = (status: number) => {
    if (status === 1) {
      return <Badge className="bg-emerald-500/20 text-emerald-600 border-emerald-500/30">Active</Badge>;
    }
    return <Badge className="bg-destructive/20 text-destructive border-destructive/30">Inactive</Badge>;
  };

  // Get discipline badge
  const getDisciplineBadge = (discipline: string) => {
    const colors: Record<string, string> = {
      Medical: "bg-red-500/20 text-red-600",
      Engineering: "bg-blue-500/20 text-blue-600",
      "Computer Science": "bg-purple-500/20 text-purple-600",
      Business: "bg-green-500/20 text-green-600",
      Law: "bg-amber-500/20 text-amber-600",
    };
    return (
      <Badge className={colors[discipline] || "bg-gray-500/20 text-gray-600"}>
        {discipline}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/")}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <GraduationCap className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-foreground">UniversityFinder</h1>
                  <p className="text-xs text-muted-foreground">Admin Dashboard</p>
                </div>
              </div>
            </div>
            <Button
              onClick={() => {
                resetForm();
                setShowAddForm(true);
              }}
              className="gradient-hero text-primary-foreground"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add University
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Page Title */}
        <div>
          <h2 className="text-2xl font-bold text-foreground">Admin Dashboard</h2>
          <p className="text-muted-foreground mt-1">Manage universities and admission data</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <Card key={i} className="border-border/50 bg-card/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <stat.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex items-center gap-1 text-emerald-600 text-sm font-medium">
                    {stat.change}%
                    <ArrowUp className="h-3 w-3" />
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-2xl font-bold text-foreground">{stat.value}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{stat.title}</p>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  {stat.change}% {stat.trend} {stat.period}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Universities */}
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-foreground">Recent Universities</CardTitle>
              <CardDescription>Latest universities added to the system</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/admin/companies")}
            >
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50 hover:bg-muted/50">
                    <TableHead className="text-foreground font-semibold">University</TableHead>
                    <TableHead className="text-foreground font-semibold hidden md:table-cell">City</TableHead>
                    <TableHead className="text-foreground font-semibold hidden lg:table-cell">Discipline</TableHead>
                    <TableHead className="text-foreground font-semibold hidden lg:table-cell">Merit</TableHead>
                    <TableHead className="text-foreground font-semibold hidden md:table-cell">Fee</TableHead>
                    <TableHead className="text-foreground font-semibold">Status</TableHead>
                    <TableHead className="text-foreground font-semibold w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentUniversities.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-32 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <Building className="h-8 w-8 text-muted-foreground/50" />
                          <p className="text-muted-foreground">No universities added yet</p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              resetForm();
                              setShowAddForm(true);
                            }}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add First University
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    recentUniversities.map((university) => (
                      <TableRow key={university.id} className="hover:bg-muted/30">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={university.logo} alt={university.title} />
                              <AvatarFallback className="bg-primary/10 text-primary">
                                {university.title.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-foreground line-clamp-1">
                                {university.title}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {university.degree}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            {university.city}
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {getDisciplineBadge(university.discipline)}
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <span className="font-medium text-primary">{university.merit}%</span>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <span className="text-muted-foreground">
                            PKR {university.fee.toLocaleString()}
                          </span>
                        </TableCell>
                        <TableCell>{getStatusBadge(university.status)}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setViewingUniversity(university)}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEdit(university)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => handleDelete(university.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Add/Edit University Dialog */}
      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <GraduationCap className="h-5 w-5 text-primary" />
              </div>
              {editingUniversity ? "Edit University" : "Add New University"}
            </DialogTitle>
            <DialogDescription>
              {editingUniversity
                ? "Update university information"
                : "Fill in the details to add a new university to the database"}
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[calc(90vh-180px)] pr-4">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Building className="h-4 w-4 text-primary" />
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="title" className="text-foreground">
                      University Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g., Federal Urdu University of Arts, Sciences & Technology"
                      className="bg-background border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="degree" className="text-foreground">Degree Program</Label>
                    <Select
                      value={formData.degree}
                      onValueChange={(value) => setFormData({ ...formData, degree: value })}
                    >
                      <SelectTrigger className="bg-background border-border">
                        <SelectValue placeholder="Select degree" />
                      </SelectTrigger>
                      <SelectContent>
                        {degrees.map((d) => (
                          <SelectItem key={d} value={d}>
                            {d}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="discipline" className="text-foreground">
                      Discipline <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={formData.discipline}
                      onValueChange={(value) => setFormData({ ...formData, discipline: value })}
                    >
                      <SelectTrigger className="bg-background border-border">
                        <SelectValue placeholder="Select discipline" />
                      </SelectTrigger>
                      <SelectContent>
                        {disciplines.map((d) => (
                          <SelectItem key={d} value={d}>
                            {d}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  Location
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-foreground">
                      City <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={formData.city}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          city: value,
                          map: { ...formData.map!, location: value },
                        })
                      }
                    >
                      <SelectTrigger className="bg-background border-border">
                        <SelectValue placeholder="Select city" />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="province" className="text-foreground">Province</Label>
                    <Select
                      value={formData.province}
                      onValueChange={(value) => setFormData({ ...formData, province: value })}
                    >
                      <SelectTrigger className="bg-background border-border">
                        <SelectValue placeholder="Select province" />
                      </SelectTrigger>
                      <SelectContent>
                        {provinces.map((p) => (
                          <SelectItem key={p} value={p}>
                            {p}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ranking" className="text-foreground">Ranking</Label>
                    <Input
                      id="ranking"
                      type="number"
                      value={formData.ranking}
                      onChange={(e) => setFormData({ ...formData, ranking: parseInt(e.target.value) || 0 })}
                      placeholder="e.g., 47"
                      className="bg-background border-border"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-foreground">Full Address</Label>
                  <Textarea
                    id="address"
                    value={formData.map?.address}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        map: { ...formData.map!, address: e.target.value },
                      })
                    }
                    placeholder="e.g., M3XC+79J, Kuri Model Village, G-7, Islamabad"
                    className="bg-background border-border resize-none"
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="lat" className="text-foreground">Latitude</Label>
                    <Input
                      id="lat"
                      type="number"
                      step="0.000001"
                      value={formData.map?.lat}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          map: { ...formData.map!, lat: parseFloat(e.target.value) || 0 },
                        })
                      }
                      placeholder="e.g., 33.6844"
                      className="bg-background border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="long" className="text-foreground">Longitude</Label>
                    <Input
                      id="long"
                      type="number"
                      step="0.000001"
                      value={formData.map?.long}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          map: { ...formData.map!, long: parseFloat(e.target.value) || 0 },
                        })
                      }
                      placeholder="e.g., 73.0479"
                      className="bg-background border-border"
                    />
                  </div>
                </div>
              </div>

              {/* Admission Details */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Award className="h-4 w-4 text-primary" />
                  Admission Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="merit" className="text-foreground">Merit Score (%)</Label>
                    <Input
                      id="merit"
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      value={formData.merit}
                      onChange={(e) => setFormData({ ...formData, merit: parseFloat(e.target.value) || 0 })}
                      placeholder="e.g., 92.0"
                      className="bg-background border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fee" className="text-foreground">Fee (PKR)</Label>
                    <Input
                      id="fee"
                      type="number"
                      value={formData.fee}
                      onChange={(e) => setFormData({ ...formData, fee: parseInt(e.target.value) || 0 })}
                      placeholder="e.g., 42620"
                      className="bg-background border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admissions" className="text-foreground">Admissions</Label>
                    <Input
                      id="admissions"
                      value={formData.admissions}
                      onChange={(e) => setFormData({ ...formData, admissions: e.target.value })}
                      placeholder="e.g., 1.0"
                      className="bg-background border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status" className="text-foreground">Status</Label>
                    <Select
                      value={String(formData.status)}
                      onValueChange={(value) => setFormData({ ...formData, status: parseInt(value) })}
                    >
                      <SelectTrigger className="bg-background border-border">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Active</SelectItem>
                        <SelectItem value="0">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="deadline" className="text-foreground">Deadline</Label>
                    <Input
                      id="deadline"
                      value={formData.deadline}
                      onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                      placeholder="e.g., January 2025 or <NA>"
                      className="bg-background border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admission" className="text-foreground">Admission Info</Label>
                    <Input
                      id="admission"
                      value={formData.admission}
                      onChange={(e) => setFormData({ ...formData, admission: e.target.value })}
                      placeholder="e.g., Open, Closed, nan"
                      className="bg-background border-border"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" />
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact" className="text-foreground">Phone</Label>
                    <Input
                      id="contact"
                      value={formData.contact}
                      onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                      placeholder="e.g., (051) 9252860"
                      className="bg-background border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="info" className="text-foreground">Email</Label>
                    <Input
                      id="info"
                      type="email"
                      value={formData.info}
                      onChange={(e) => setFormData({ ...formData, info: e.target.value })}
                      placeholder="e.g., info@mite.edu.pk"
                      className="bg-background border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="web" className="text-foreground">Website</Label>
                    <Input
                      id="web"
                      value={formData.web}
                      onChange={(e) => setFormData({ ...formData, web: e.target.value })}
                      placeholder="e.g., http://www.uom.edu.pk/"
                      className="bg-background border-border"
                    />
                  </div>
                </div>
              </div>

              {/* Media */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Globe className="h-4 w-4 text-primary" />
                  Media
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="logo" className="text-foreground">Logo URL</Label>
                    <Input
                      id="logo"
                      value={formData.logo}
                      onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                      placeholder="https://www.university.edu.pk/logo.png"
                      className="bg-background border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="url" className="text-foreground">Campus Image URL</Label>
                    <Input
                      id="url"
                      value={formData.url}
                      onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      placeholder="https://firebasestorage.googleapis.com/..."
                      className="bg-background border-border"
                    />
                  </div>
                </div>
              </div>
            </form>
          </ScrollArea>

          <DialogFooter className="gap-2 border-t border-border pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm();
                setShowAddForm(false);
              }}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="gradient-hero text-primary-foreground">
              <Save className="h-4 w-4 mr-2" />
              {editingUniversity ? "Update University" : "Save University"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View University Dialog */}
      <Dialog open={!!viewingUniversity} onOpenChange={() => setViewingUniversity(null)}>
        <DialogContent className="max-w-2xl bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-foreground flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={viewingUniversity?.logo} alt={viewingUniversity?.title} />
                <AvatarFallback className="bg-primary/10 text-primary">
                  {viewingUniversity?.title?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="line-clamp-1">{viewingUniversity?.title}</div>
                <div className="text-sm font-normal text-muted-foreground">
                  {viewingUniversity?.degree}
                </div>
              </div>
            </DialogTitle>
          </DialogHeader>

          {viewingUniversity && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Location</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-foreground">
                      <MapPin className="h-4 w-4 text-primary" />
                      {viewingUniversity.city}, {viewingUniversity.province}
                    </div>
                    <p className="text-sm text-muted-foreground pl-6">
                      {viewingUniversity.map?.address || "Address not available"}
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Admission Details</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Merit Score</span>
                      <span className="font-medium text-primary">{viewingUniversity.merit}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fee</span>
                      <span className="font-medium text-foreground">
                        PKR {viewingUniversity.fee.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Ranking</span>
                      <span className="text-foreground">#{viewingUniversity.ranking}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Deadline</span>
                      <span className="text-foreground">
                        {viewingUniversity.deadline === "<NA>" ? "N/A" : viewingUniversity.deadline}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Status</span>
                      {getStatusBadge(viewingUniversity.status)}
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Contact</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-foreground">
                      <Phone className="h-4 w-4 text-primary" />
                      {viewingUniversity.contact || "N/A"}
                    </div>
                    <div className="flex items-center gap-2 text-foreground">
                      <Mail className="h-4 w-4 text-primary" />
                      {viewingUniversity.info || "N/A"}
                    </div>
                    <div className="flex items-center gap-2 text-foreground">
                      <Globe className="h-4 w-4 text-primary" />
                      {viewingUniversity.web ? (
                        <a
                          href={viewingUniversity.web}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline flex items-center gap-1"
                        >
                          Visit Website
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        "N/A"
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Quick Actions</h3>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        setViewingUniversity(null);
                        handleEdit(viewingUniversity);
                      }}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit University
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full text-destructive hover:text-destructive"
                      onClick={() => {
                        handleDelete(viewingUniversity.id);
                        setViewingUniversity(null);
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete University
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setViewingUniversity(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;