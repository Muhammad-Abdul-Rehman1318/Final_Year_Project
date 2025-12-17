import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  ArrowUpDown, 
  MoreHorizontal,
  Building,
  Mail,
  BarChart,
  UserCheck,
  MapPin,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

// University interface
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
}

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

const CompanyManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDiscipline, setFilterDiscipline] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    pages: 0
  });
  const [sortBy, setSortBy] = useState<{field: string, direction: 'asc' | 'desc'}>({
    field: 'title',
    direction: 'asc'
  });
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { toast } = useToast();
  
  // Fetch universities from MongoDB via backend API
  useEffect(() => {
    const loadUniversities = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        
        // Build query parameters
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: '50'
        });
        
        // Add search term if exists
        if (searchTerm.trim()) {
          params.append('search', searchTerm.trim());
        }
        
        // Add discipline filter if not 'all'
        if (filterDiscipline !== 'all') {
          params.append('discipline', filterDiscipline);
        }
        
        const url = `${apiUrl}/admin/companies?${params.toString()}`;
        console.log('Fetching from:', url);
        
        const response = await fetch(url, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('API Error:', response.status, errorData);
          throw new Error(errorData.message || 'Failed to fetch universities');
        }
        
        const data = await response.json();
        console.log('API Response:', data);
        
        if (data.success && data.universities) {
          const transformedData = data.universities.map((uni: any) => ({
            id: uni.id,
            key: uni.key || 0,
            title: uni.name || uni.title,
            city: uni.city,
            province: uni.province,
            degree: uni.degree,
            discipline: uni.discipline,
            fee: uni.fee || 0,
            merit: uni.merit || 0,
            ranking: uni.ranking || 0,
            status: uni.status || 1,
            contact: uni.contact || '',
            info: uni.info || '',
            web: uni.web || '',
            url: uni.url || '',
            logo: uni.logo || '',
            admissions: uni.admissions || '0.0',
            map: {
              address: uni.map?.address || '',
              lat: uni.map?.lat || 0,
              long: uni.map?.long || 0,
              location: uni.map?.location || uni.city,
            },
            deadline: uni.deadline || '<NA>',
            admission: uni.admission || '',
          }));
          
          setUniversities(transformedData);
          if (data.pagination) {
            setPagination(data.pagination);
          }
        }
      } catch (error) {
        console.error("Error loading universities:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load universities data from database",
        });
      } finally {
        setLoading(false);
      }
    };

    loadUniversities();
  }, [toast, currentPage, searchTerm, filterDiscipline]);

  // Display universities from server (no client-side filtering for pagination)
  const displayUniversities = universities;

  // Reset to page 1 when search or filter changes
  const handleSearchChange = (value: string) => {
    console.log('Search term changed:', value);
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleDisciplineChange = (value: string) => {
    setFilterDiscipline(value);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleOpenDetails = (university: University) => {
    setSelectedUniversity(university);
  };
  
  const handleSort = (field: string) => {
    if (sortBy.field === field) {
      setSortBy({
        field,
        direction: sortBy.direction === 'asc' ? 'desc' : 'asc'
      });
    } else {
      setSortBy({
        field,
        direction: 'asc'
      });
    }
  };
  
  const getStatusBadge = (status: number) => {
    if (status === 1) {
      return <Badge className="bg-emerald-500/20 text-emerald-600 border-emerald-500/30">Active</Badge>;
    }
    return <Badge className="bg-destructive/20 text-destructive border-destructive/30">Inactive</Badge>;
  };
  
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

  const handleDelete = async (id: string) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

      const response = await fetch(`${apiUrl}/admin/companies/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || 'Failed to delete university');
      }

      setUniversities((prev) => prev.filter((u) => u.id !== id));
      toast({
        title: 'University Deleted',
        description: 'University has been removed successfully.',
      });
    } catch (error: any) {
      console.error('Error deleting university:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to delete university',
      });
    }
  };

  if (loading) {
    return (
      <div className="relative h-64">
        <div className="absolute inset-0 flex justify-center items-center">
          <div className="text-gray-600">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">All Universities</h1>
          <p className="text-muted-foreground mt-1">Complete list of registered universities</p>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Universities</CardTitle>
          <CardDescription>Manage all registered universities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search universities..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </div>
            <div className="w-full md:w-48">
              <Select value={filterDiscipline} onValueChange={handleDisciplineChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by discipline" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Disciplines</SelectItem>
                  {disciplines.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">
                    <div className="flex items-center cursor-pointer" onClick={() => handleSort('title')}>
                      University
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>Discipline</TableHead>
                  <TableHead className="hidden md:table-cell">
                    <div className="flex items-center cursor-pointer" onClick={() => handleSort('merit')}>
                      Merit
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    <div className="flex items-center cursor-pointer" onClick={() => handleSort('fee')}>
                      Fee (PKR)
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="hidden lg:table-cell">Ranking</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayUniversities.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No universities found.
                    </TableCell>
                  </TableRow>
                ) : (
                  displayUniversities.map((university) => (
                    <TableRow
                      key={university.id}
                      className="hover:bg-muted/30 cursor-pointer"
                      onClick={() => handleOpenDetails(university)}
                    >
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
                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {university.city}, {university.province}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getDisciplineBadge(university.discipline)}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <span className="font-medium text-primary">{university.merit}%</span>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <span className="text-muted-foreground">
                          {university.fee.toLocaleString()}
                        </span>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <span className="text-muted-foreground">#{university.ranking}</span>
                      </TableCell>
                      <TableCell>{getStatusBadge(university.status)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenDetails(university);
                              }}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={(e) => {
                                e.stopPropagation();
                              }}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(university.id);
                              }}
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
          
          <div className="flex justify-between items-center mt-4 text-sm text-muted-foreground">
            <div>Showing {universities.length} of {pagination.total} universities (Page {pagination.page} of {pagination.pages})</div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                disabled={pagination.page <= 1}
                onClick={() => setCurrentPage(pagination.page - 1)}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <span className="px-3 py-1 text-sm">
                Page {pagination.page} of {pagination.pages}
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                disabled={pagination.page >= pagination.pages}
                onClick={() => setCurrentPage(pagination.page + 1)}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* University Details Dialog */}
      {selectedUniversity && (
        <Dialog open={!!selectedUniversity} onOpenChange={() => setSelectedUniversity(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={selectedUniversity.logo} alt={selectedUniversity.title} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {selectedUniversity.title.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="line-clamp-1">{selectedUniversity.title}</div>
                  <div className="text-sm font-normal text-muted-foreground">
                    {selectedUniversity.degree}
                  </div>
                </div>
              </DialogTitle>
              <DialogDescription>
                University details and information
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Location</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <Building className="h-4 w-4 text-gray-500 mt-0.5" />
                        <div>
                          <div className="font-medium">{selectedUniversity.city}, {selectedUniversity.province}</div>
                          <div className="text-sm text-gray-500">
                            {selectedUniversity.map?.address || "Address not available"}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <BarChart className="h-4 w-4 text-gray-500 mt-0.5" />
                        <div>
                          <div className="font-medium">Statistics</div>
                          <div className="text-sm text-gray-500">
                            Merit: {selectedUniversity.merit}% • Ranking: #{selectedUniversity.ranking}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Discipline</h3>
                    <div className="bg-gray-50 p-3 rounded-md border">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="font-semibold">{selectedUniversity.discipline}</span>
                          <div className="text-sm text-gray-500">
                            {selectedUniversity.degree}
                          </div>
                        </div>
                        {getDisciplineBadge(selectedUniversity.discipline)}
                      </div>
                      <div className="mt-2 pt-2 border-t border-gray-200">
                        <div className="text-sm">
                          <span className="text-gray-500">Fee:</span>
                          <span className="font-medium ml-2">PKR {selectedUniversity.fee.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Contact Information</h3>
                    <div className="flex items-start gap-2">
                      <UserCheck className="h-4 w-4 text-gray-500 mt-0.5" />
                      <div>
                        <div className="font-medium">{selectedUniversity.contact || "N/A"}</div>
                        <div className="text-sm text-gray-500">
                          Phone
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 mt-2">
                      <Mail className="h-4 w-4 text-gray-500 mt-0.5" />
                      <div className="font-medium">
                        {selectedUniversity.info || "N/A"}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Admission Details</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Deadline</span>
                        <span className="font-medium">
                          {selectedUniversity.deadline === "<NA>" ? "N/A" : selectedUniversity.deadline}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Status</span>
                        {getStatusBadge(selectedUniversity.status)}
                      </div>
                      {selectedUniversity.web && (
                        <div className="pt-2">
                          <a
                            href={selectedUniversity.web}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline text-sm"
                          >
                            Visit Website →
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedUniversity(null)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default CompanyManagementPage;