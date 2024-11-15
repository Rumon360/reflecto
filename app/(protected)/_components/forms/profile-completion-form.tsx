"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Logo from "@/components/logo";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { profileCompletionSchema } from "@/actions/profile/schema";
import { useAction } from "@/hooks/use-action";
import { profileCompletion } from "@/actions/profile";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

function ProfileCompletionForm() {
  const { execute, loading } = useAction(
    profileCompletion,
    profileCompletionSchema,
    {
      onSuccess: () => {
        toast.success("Profile Completed Successfully");
      },
      onError: (error) => {
        toast.error(error);
      },
    }
  );

  const form = useForm<z.infer<typeof profileCompletionSchema>>({
    resolver: zodResolver(profileCompletionSchema),
    defaultValues: {
      username: "",
      bio: "",
    },
  });

  function onSubmit(values: z.infer<typeof profileCompletionSchema>) {
    execute(values);
  }

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader>
        <Logo className="text-2xl border-b pb-2" />
        <h2 className="text-2xl font-bold mt-4">Complete Your Profile</h2>
        <p className="text-muted-foreground mt-2">
          Please provide some additional information to complete your profile.
        </p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Tell us about yourself" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={loading}>
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="animate-spin" />
                  <span>Submitting...</span>
                </div>
              ) : (
                "Complete Profile"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default ProfileCompletionForm;
