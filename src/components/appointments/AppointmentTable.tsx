import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Search,
  MoreVertical,
  ArrowUpDown,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAppointments, Appointment } from "@/lib/hooks/useAppointments";
import { useToast } from "@/components/ui/use-toast";

interface AppointmentTableProps {
  appointments?: Appointment[];
  onEdit?: (appointment: Appointment) => void;
  onDelete?: (appointmentId: string) => void;
  isLoading?: boolean;
  students?: Array<{ id: string; first_name: string; last_name: string }>;
}

export default function AppointmentTable({
  appointments: initialAppointments,
  onEdit = () => {},
  onDelete = () => {},
  isLoading: initialLoading = false,
  students = [],
}: AppointmentTableProps) {
  const [appointments, setAppointments] = useState<Appointment[]>(
    initialAppointments || [],
  );
  const [isLoading, setIsLoading] = useState(
    initialLoading || !initialAppointments,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<keyof Appointment | null>(
    "appointment_date",
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { getAppointments, deleteAppointment } = useAppointments();
  const { toast } = useToast();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    if (!initialAppointments) {
      fetchAppointments();
    } else {
      setAppointments(initialAppointments);
      setIsLoading(false);
    }
  }, [initialAppointments]);

  const fetchAppointments = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await getAppointments();
      setIsLoading(false);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to load appointments. Please try again.",
          variant: "destructive",
        });
        return;
      }

      if (data) {
        setAppointments(data);
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error in fetchAppointments:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSort = (field: keyof Appointment) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await deleteAppointment(id);
      if (error) {
        toast({
          title: "Error",
          description: "Failed to delete appointment. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Appointment deleted successfully.",
      });

      // Remove from local state
      setAppointments(
        appointments.filter((appointment) => appointment.id !== id),
      );
      onDelete(id);
    } catch (error) {
      console.error("Error in handleDelete:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredAppointments = appointments.filter((appointment) =>
    Object.values(appointment).some((value) =>
      value?.toString().toLowerCase().includes(searchQuery.toLowerCase()),
    ),
  );

  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    if (!sortField) return 0;
    const aValue = a[sortField];
    const bValue = b[sortField];
    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1;
    }
    return aValue < bValue ? 1 : -1;
  });

  // Calculate pagination
  const totalPages = Math.ceil(sortedAppointments.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedAppointments.slice(
    indexOfFirstItem,
    indexOfLastItem,
  );

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStudentName = (studentId: string) => {
    const student = students.find((s) => s.id === studentId);
    return student
      ? `${student.first_name} ${student.last_name}`
      : "Unknown Student";
  };

  return (
    <div className="w-full bg-background space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search appointments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1); // Reset to first page when changing items per page
            }}
          >
            <option value="5">5 per page</option>
            <option value="10">10 per page</option>
            <option value="25">25 per page</option>
            <option value="50">50 per page</option>
          </select>
          <Button onClick={fetchAppointments} variant="outline" size="sm">
            Refresh
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("title")}
              >
                <div className="flex items-center gap-1">
                  Title
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("student_id")}
              >
                <div className="flex items-center gap-1">
                  Student
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("appointment_date")}
              >
                <div className="flex items-center gap-1">
                  Date
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("appointment_time")}
              >
                <div className="flex items-center gap-1">
                  Time
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("status")}
              >
                <div className="flex items-center gap-1">
                  Status
                  <ArrowUpDown className="h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="w-[50px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <div className="flex justify-center items-center">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    <span className="ml-2">Loading appointments...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : sortedAppointments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No appointments found.
                </TableCell>
              </TableRow>
            ) : (
              currentItems.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell>{appointment.title}</TableCell>
                  <TableCell>
                    {appointment.students
                      ? `${appointment.students.first_name} ${appointment.students.last_name}`
                      : getStudentName(appointment.student_id)}
                  </TableCell>
                  <TableCell>
                    {new Date(
                      appointment.appointment_date,
                    ).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{appointment.appointment_time}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        appointment.status,
                      )}`}
                    >
                      {appointment.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(appointment)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedAppointment(appointment);
                            setShowDeleteDialog(true);
                          }}
                          className="text-red-600"
                        >
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

      {/* Pagination Controls */}
      {!isLoading && sortedAppointments.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {indexOfFirstItem + 1} to{" "}
            {Math.min(indexOfLastItem, sortedAppointments.length)} of{" "}
            {sortedAppointments.length} appointments
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Show at most 5 page buttons
              let pageNum;
              if (totalPages <= 5) {
                // If 5 or fewer pages, show all
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                // If near the start, show first 5 pages
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                // If near the end, show last 5 pages
                pageNum = totalPages - 4 + i;
              } else {
                // Otherwise show 2 before and 2 after current page
                pageNum = currentPage - 2 + i;
              }

              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => paginate(pageNum)}
                >
                  {pageNum}
                </Button>
              );
            })}
            <Button
              variant="outline"
              size="sm"
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Appointment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this appointment? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (selectedAppointment) {
                  handleDelete(selectedAppointment.id);
                  setShowDeleteDialog(false);
                }
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
