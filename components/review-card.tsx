"use client";

import React, { useState, useMemo, useCallback, useRef } from "react";
import { z } from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "./ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "./ui/card";
import { Loader2, Star } from "lucide-react";
import { Alert } from "./ui/alert";
import { reviewFormSchema } from "@/actions/review/create/schema";
import Logo from "./logo";
import { UploadButton } from "@/utils/uploadthing";
import confetti from "canvas-confetti";

type Props = {
  title?: string;
  description?: string;
  email?: boolean;
  name?: boolean;
  rating?: boolean;
  content?: boolean;
  image?: boolean;
  onSuccess?: string;
  isTest?: boolean;
  token?: string;
};

function ReviewCard({
  title,
  description,
  email,
  name,
  rating,
  content,
  image,
  onSuccess,
  isTest,
  token,
}: Props) {
  const [loading, setLoading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const [alert, setAlert] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const form = useForm<z.infer<typeof reviewFormSchema>>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      email: "",
      name: "",
      rating: "",
      content: "",
      image: "",
      token: token,
    },
  });

  const triggerConfetti = useCallback(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      zIndex: -1,
    });
  }, []);

  const onSubmit = async (values: z.infer<typeof reviewFormSchema>) => {
    const requiredFields = {
      email,
      name,
      rating,
      content,
      image,
    };

    const errors = Object.entries(requiredFields).reduce(
      (acc, [key, isRequired]) => {
        if (isRequired && !values[key as keyof typeof values]) {
          form.setError(key as keyof typeof values, {
            type: "manual",
            message: `${
              key.charAt(0).toUpperCase() + key.slice(1)
            } is required`,
          });
          return true;
        }
        return acc;
      },
      false
    );

    if (!errors) {
      if (isTest) {
        setAlert({
          success: true,
          message: onSuccess || "Review submitted successfully",
        });
        triggerConfetti();
      } else {
        setLoading(true);
        try {
          const res = await fetch("/api/review", {
            method: "POST",
            body: JSON.stringify(values),
          }).then((res) => res.json());
          if (res.error) {
            setAlert({
              success: false,
              message: res.error,
            });
          } else {
            setAlert({
              success: true,
              message: onSuccess || "Review submitted successfully",
            });
            form.reset();
            triggerConfetti();
          }
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      }
    }
  };

  const formFields = useMemo(
    () => [
      {
        name: "email",
        label: "Email",
        type: "email",
        placeholder: "Enter your email",
        condition: email,
      },
      {
        name: "name",
        label: "Name",
        type: "text",
        placeholder: "Enter your name",
        condition: name,
      },
      { name: "rating", label: "Rating", type: "rating", condition: rating },
      {
        name: "content",
        label: "Content",
        type: "textarea",
        placeholder: "Write your review here",
        condition: content,
      },
      {
        name: "image",
        label: "Image",
        type: "file",
        condition: image,
      },
    ],
    [email, name, rating, content, image]
  );

  return (
    <>
      <Card ref={cardRef}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="max-w-lg shrink-0 flex-1">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {formFields.map(
                ({ name, label, type, placeholder, condition }) =>
                  condition && (
                    <FormField
                      key={name}
                      control={form.control}
                      name={name as keyof z.infer<typeof reviewFormSchema>}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{label}</FormLabel>
                          <FormControl>
                            {type === "rating" ? (
                              <div className="flex items-center space-x-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <button
                                    type="button"
                                    key={star}
                                    onClick={() =>
                                      field.onChange(star.toString())
                                    }
                                  >
                                    <Star
                                      className={`size-5 hover:text-yellow-400 transition-colors ease-in-out ${
                                        Number(field.value) >= star
                                          ? "text-yellow-400 fill-yellow-400"
                                          : "text-gray-300"
                                      }`}
                                    />
                                  </button>
                                ))}
                              </div>
                            ) : type === "textarea" ? (
                              <Textarea placeholder={placeholder} {...field} />
                            ) : type === "file" ? (
                              <UploadButton
                                endpoint="imageUploader"
                                disabled={loading || isTest}
                                onClientUploadComplete={(res) => {
                                  if (res && res.length > 0) {
                                    field.onChange(res[0].url);
                                  }
                                }}
                                onUploadError={(error: Error) => {
                                  console.error(error);
                                  setAlert({
                                    success: false,
                                    message: "Image upload failed",
                                  });
                                }}
                                appearance={{
                                  button:
                                    "bg-primary text-primary-foreground hover:bg-primary/90 py-0 h-8 rounded-md px-3 text-xs",
                                  allowedContent:
                                    "text-sm text-muted-foreground mt-2",
                                }}
                              />
                            ) : (
                              <Input
                                type={type}
                                placeholder={placeholder}
                                {...field}
                              />
                            )}
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )
              )}
              {alert && (
                <Alert variant={alert.success ? "success" : "destructive"}>
                  {alert.message}
                </Alert>
              )}
              <Button disabled={loading} type="submit">
                {loading ? (
                  <span className="flex items-center gap-1">
                    <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
                  </span>
                ) : (
                  "Submit"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex border-t p-4 justify-center text-sm text-muted-foreground">
          <span className="mr-1">Powered by</span> <Logo />
        </CardFooter>
      </Card>
    </>
  );
}

export default ReviewCard;
