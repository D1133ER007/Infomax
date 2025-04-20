import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAppointments, Appointment } from "@/lib/hooks/useAppointments";
import AppointmentForm, { AppointmentFormValues } from "./AppointmentForm";

interface AppointmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment: Appointment | null;
  students: Array<{ id: string; first_name: string; last_name: string }>;
  onSuccess?: (appointment: Appointment) => void;
}

export default function AppointmentModal({
  open,
  onOpenChange,
  appointment,
  students,
  onSuccess = () => {},
}: AppointmentModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createAppointment, updateAppointment } = useAppointments();
  const { toast } = useToast();

  const handleSubmit = async (data: AppointmentFormValues) => {
    setIsSubmitting(true);
    try {
      if (appointment) {
        // Update existing appointment
        const { data: updatedAppointment, error } = await updateAppointment(
          appointment.id,
          data,
        );
        if (error) throw error;
        toast({
          title: "Success",
          description: "Appointment updated successfully.",
        });
        onSuccess(updatedAppointment);
      } else {
        // Create new appointment
        const { data: newAppointment, error } = await createAppointment({
          ...data,
          status: data.status || "scheduled",
        });
        if (error) throw error;
        toast({
          title: "Success",
          description: "Appointment added successfully.",
        });
        onSuccess(newAppointment);
      }
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving appointment:", error);
      toast({
        title: "Error",
        description: "Failed to save appointment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const defaultValues = appointment
    ? {
        student_id: appointment.student_id,
        title: appointment.title,
        description: appointment.description || "",
        appointment_date: appointment.appointment_date,
        appointment_time: appointment.appointment_time,
        status: appointment.status,
      }
    : {
        student_id: "",
        title: "",
        description: "",
        appointment_date: new Date().toISOString().split("T")[0],
        appointment_time: "09:00",
        status: "scheduled" as const,
      };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-background">
        <DialogHeader>
          <DialogTitle>
            {appointment ? "Edit Appointment" : "Add New Appointment"}
          </DialogTitle>
          <DialogDescription>
            Fill in the appointment details below. All fields marked with * are
            required.
          </DialogDescription>
        </DialogHeader>

        <AppointmentForm
          defaultValues={defaultValues}
          students={students}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          appointment={appointment}
        />

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
