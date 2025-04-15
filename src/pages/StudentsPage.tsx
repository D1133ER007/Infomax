import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StudentTable from "@/components/students/StudentTable";
import AddStudentModal from "@/components/students/AddStudentModal";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Student } from "@/lib/hooks/useStudents";

export default function StudentsPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const handleAddStudent = () => {
    setSelectedStudent(null);
    setShowAddModal(true);
  };

  const handleEditStudent = (student: Student) => {
    setSelectedStudent(student);
    setShowAddModal(true);
  };

  const handleStudentSaved = () => {
    // The table will refresh its data
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-[1200px] mx-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Students</h1>
          <Button onClick={handleAddStudent}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Student
          </Button>
        </div>

        <StudentTable onEdit={handleEditStudent} />

        {showAddModal && (
          <AddStudentModal
            open={showAddModal}
            onOpenChange={setShowAddModal}
            onSubmit={handleStudentSaved}
            studentId={selectedStudent?.id}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
