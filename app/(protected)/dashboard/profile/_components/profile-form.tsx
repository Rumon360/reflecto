"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { profileUpdateSchema } from "@/actions/profile/update/schema";
import { User } from "@prisma/client";
import { useAction } from "@/hooks/use-action";
import { updateProfile } from "@/actions/profile";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

type ProfileFormProps = {
  user: User;
};

function ProfileForm({ user }: ProfileFormProps) {
  const { execute, loading } = useAction(updateProfile, profileUpdateSchema, {
    onSuccess: () => {
      toast.success("Profile updated successfully");
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const form = useForm<z.infer<typeof profileUpdateSchema>>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      name: user.name ? user.name : "",
      username: user.username ? user.username : "",
      bio: user.bio ? user.bio : "",
    },
  });

  function onSubmit(values: z.infer<typeof profileUpdateSchema>) {
    execute(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <div>
              <h2 className="text-2xl font-bold">Profile</h2>
              <p className="text-sm text-muted-foreground">
                Update your user profile information.
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormItem>
                <FormLabel>Email</FormLabel>
                <Input
                  placeholder="Your email"
                  readOnly
                  value={user.email ? user.email : ""}
                />
                <FormDescription>Email cannot be changed.</FormDescription>
              </FormItem>
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Your username" {...field} />
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
                      <Textarea
                        placeholder="Tell us a little bit about yourself"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button disabled={loading} type="submit">
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="animate-spin" />
                  <span>Loading...</span>
                </div>
              ) : (
                "Update profile"
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}

export default ProfileForm;
