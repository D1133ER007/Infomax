import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function UnauthorizedPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-4">Unauthorized Access</h1>
      <p className="text-muted-foreground mb-8">
        You don't have permission to access this page.
      </p>
      <Button onClick={() => navigate("/")} variant="outline">
        Go Back Home
      </Button>
    </div>
  );
}
