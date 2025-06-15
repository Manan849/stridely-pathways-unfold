
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { BadgeCheck } from "lucide-react"; // Lucide icon for Google

const AuthModal = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const [tab, setTab] = useState<"signIn" | "signUp">("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    setError("");

    try {
      if (tab === "signIn") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) setError(error.message);
        else onOpenChange(false);
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
          },
        });
        if (error) setError(error.message);
        else {
          toast({
            title: "Check your email",
            description: "Please verify your address to finish signing up.",
          });
          onOpenChange(false);
        }
      }
    } finally {
      setPending(false);
    }
  };

  const signInWithGoogle = async () => {
    setPending(true);
    setError("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/` },
    });
    if (error) {
      setError(error.message);
      setPending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle className="mb-2">{tab === "signUp" ? "Create your account" : "Sign in"}</DialogTitle>
        <DialogDescription>
          {tab === "signUp"
            ? "Register to save your plans and sync across devices."
            : "Sign in to resume your Stridely journey."}
        </DialogDescription>
        <form className="flex flex-col gap-4" onSubmit={handleEmail}>
          <Input
            type="email"
            required
            placeholder="Email"
            value={email}
            disabled={pending}
            onChange={e => setEmail(e.target.value)}
          />
          <Input
            type="password"
            required
            placeholder="Password"
            value={password}
            disabled={pending}
            onChange={e => setPassword(e.target.value)}
          />
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? (tab === "signUp" ? "Signing up..." : "Signing in...") : (tab === "signUp" ? "Sign Up" : "Sign In")}
          </Button>
          <Button
            type="button"
            className="w-full flex gap-2 justify-center items-center bg-white border text-black shadow"
            variant="outline"
            disabled={pending}
            onClick={signInWithGoogle}
          >
            <BadgeCheck className="size-5 text-[#4285F4]" /> Continue with Google
          </Button>
        </form>
        <div className="mt-3 text-center text-sm">
          {tab === "signIn" ? (
            <>
              Don’t have an account?{" "}
              <button className="text-accent underline" onClick={() => setTab("signUp")} disabled={pending}>Sign Up</button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button className="text-accent underline" onClick={() => setTab("signIn")} disabled={pending}>Sign In</button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default AuthModal;
