"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "@/components/ui/use-toast";
import { useParams } from "next/navigation";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { set } from "mongoose";

const page = () => {
  const [isLoading, setIsLoading] = useState(false);
  const FormSchema = z.object({
    content: z
      .string()
      .min(10, {
        message: "content must be at least 10 characters.",
      })
      .max(160, {
        message: "content must not be longer than 30 characters.",
      }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const params = useParams<{ username: string }>();
  const username = params.username;

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      setIsLoading(true);
      const response = await axios.post<ApiResponse>("/api/send-message", {
        username,
        content: data.content,
      });

      toast({
        title: "Success",
        description: response.data.message || "Message sent successfully",
      });

      form.reset({...form.getValues() , content: ""});
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ?? "Failed to sent message",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
      <h1 className="font-bold text-4xl text-center mb-6">
        Public Profile Link
      </h1>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-6"
        >
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Send Anonymous message to {username}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="write your message here..."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>


      
    </div>
  );
};

export default page;
