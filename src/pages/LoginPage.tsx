import React from "react";
import LoginForm from "@/components/auth/LoginForm";
import AuthProvider from "@/components/auth/AuthProvider";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
      <LoginForm />
    </div>
  );
}
