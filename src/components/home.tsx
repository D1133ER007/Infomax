import React from "react";
import DashboardLayout from "./layout/DashboardLayout";
import EnquiryForm from "./EnquiryForm";

export default function Home() {
  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-[1200px] mx-auto">
        <EnquiryForm />
      </div>
    </DashboardLayout>
  );
}
