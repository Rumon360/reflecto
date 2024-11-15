"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { ReviewForm } from "@prisma/client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { reviewSchema } from "@/actions/review/schema";
import { useAction } from "@/hooks/use-action";
import { updateReviewSetting } from "@/actions/review/update/form";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

type ReviewsProps = {
  reviewCardSettings: ReviewForm;
  projectId: string;
  setReviewCardSettings: (review: ReviewForm) => void;
};

function ReviewSettingsCard({
  reviewCardSettings,
  setReviewCardSettings,
  projectId,
}: ReviewsProps) {
  const form = useForm<z.infer<typeof reviewSchema>>({
    resolver: zodResolver(reviewSchema),
    defaultValues: reviewCardSettings,
  });

  const { execute, loading } = useAction(updateReviewSetting, reviewSchema, {
    onSuccess: () => {
      toast.success("Review form updated successfully");
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const handleFieldChange = (field: keyof ReviewForm, value: unknown) => {
    setReviewCardSettings({ ...reviewCardSettings, [field]: value });
  };

  function onSubmit(values: z.infer<typeof reviewSchema>) {
    execute({ ...values, projectId });
  }

  return (
    <Card className="w-full border-none">
      <CardHeader>
        <CardTitle>Settings</CardTitle>
        <CardDescription>
          Update the settings for your review form.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="">
          <ScrollArea className="h-[300px] w-full border-t pt-4">
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter review form title"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          handleFieldChange("title", e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter review form description"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          handleFieldChange("description", e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Email</FormLabel>
                        <FormDescription>
                          Include email field in the review form
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            field.onChange(checked);
                            handleFieldChange("email", checked);
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Name</FormLabel>
                        <FormDescription>
                          Include name field in the review form
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            field.onChange(checked);
                            handleFieldChange("name", checked);
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex gap-2">
                <FormField
                  control={form.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Rating</FormLabel>
                        <FormDescription>
                          Include rating field in the review form
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            field.onChange(checked);
                            handleFieldChange("rating", checked);
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Content</FormLabel>
                        <FormDescription>
                          Include content field in the review form
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            field.onChange(checked);
                            handleFieldChange("content", checked);
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex gap-2">
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Image</FormLabel>
                        <FormDescription>
                          Allow image uploads in the review form
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            field.onChange(checked);
                            handleFieldChange("image", checked);
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Active</FormLabel>
                        <FormDescription>
                          Set the review form as active or inactive
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            field.onChange(checked);
                            handleFieldChange("active", checked);
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="onSuccess"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Success Message</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter success message"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => {
                          field.onChange(e);
                          handleFieldChange("onSuccess", e.target.value);
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Message to display after successful submission
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </ScrollArea>
          <CardFooter className="border-t pt-4">
            <Button disabled={loading} type="submit">
              {loading ? (
                <span className="flex items-center gap-1">
                  <Loader2 className="w-4 h-4 animate-spin" /> Updating...
                </span>
              ) : (
                "Update"
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

export default ReviewSettingsCard;
