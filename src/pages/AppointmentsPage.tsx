import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAppointments, Appointment } from "@/lib/hooks/useAppointments";
import { useStudents } from "@/lib/hooks/useStudents";
import AppointmentTable from "@/components/appointments/AppointmentTable";
import AppointmentModal from "@/components/appointments/AppointmentModal";

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [showFormDialog, setShowFormDialog] = useState(false);
  const { toast } = useToast();
  const { getAppointments } = useAppointments();
  const { getStudents } = useStudents();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch appointments and students in parallel
      const [appointmentsResult, studentsResult] = await Promise.all([
        getAppointments(),
        getStudents(),
      ]);

      if (appointmentsResult.error) {
        throw new Error("Failed to load appointments");
      }

      if (studentsResult.error) {
        throw new Error("Failed to load students");
      }

      setAppointments(appointmentsResult.data || []);
      setStudents(studentsResult.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to load data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAppointment = () => {
    setSelectedAppointment(null);
    setShowFormDialog(true);
  };

  const handleEditAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowFormDialog(true);
  };

  const handleAppointmentSuccess = (appointment: Appointment) => {
    if (selectedAppointment) {
      // Update existing appointment in the list
      setAppointments(
        appointments.map((a) => (a.id === appointment.id ? appointment : a)),
      );
    } else {
      // Add new appointment to the list
      setAppointments([appointment, ...appointments]);
    }
  };

  const handleDeleteAppointment = (id: string) => {
    setAppointments(appointments.filter((a) => a.id !== id));
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-[1200px] mx-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
          <Button onClick={handleAddAppointment}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Appointment
          </Button>
        </div>

        <AppointmentTable
          appointments={appointments}
          students={students}
          isLoading={isLoading}
          onEdit={handleEditAppointment}
          onDelete={handleDeleteAppointment}
        />

        <AppointmentModal
          open={showFormDialog}
          onOpenChange={setShowFormDialog}
          appointment={selectedAppointment}
          students={students}
          onSuccess={handleAppointmentSuccess}
        />
      </div>
    </DashboardLayout>
  );
}
