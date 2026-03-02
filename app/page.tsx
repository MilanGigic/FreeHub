import { useAuth } from "@/lib/useAuth";
import { redirect } from "next/navigation";

export default function Home() {
  const { user } = useAuth();
  if (user) {
    return redirect("/dashboard");
  }
  return redirect("/landing");
}
