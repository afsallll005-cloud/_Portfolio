"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MoreProjectsRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/Admin/projects");
  }, [router]);

  return (
    <div style={{ padding: "2rem", color: "#8b92a5" }}>
      Redirecting to Projects...
    </div>
  );
}
