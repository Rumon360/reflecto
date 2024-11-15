"use client";
import { useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { signInWithGoogle } from "@/actions/login";

function LoginButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err) {
      console.log(err);
      setError("An error occurred while signing in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {error && <Alert variant="destructive">{error}</Alert>}
      <form className="w-full" onSubmit={handleSubmit}>
        <Button variant={"outline"} className="w-full">
          {loading ? (
            <p className="flex items-center">
              <Loader2 className="animate-spin mr-2" />
              <span>Loading...</span>
            </p>
          ) : (
            "Continue with Google"
          )}
        </Button>
      </form>
    </>
  );
}

export default LoginButton;
