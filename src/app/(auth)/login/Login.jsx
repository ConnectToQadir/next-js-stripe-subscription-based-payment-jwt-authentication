"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button, buttonVariants } from "@/components/ui/button";
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
import { toast } from "@/components/ui/use-toast";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "@/context/Context";
import { useRouter } from "next/navigation";

const FormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Please Enter Password!"),
});

export default function Login() {


  var {refetchUser} = useContext(AuthContext)
  var router = useRouter()

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {},
  });

  async function onSubmit(data) {
    try {
      const res = await axios.post("/api/auth/login", data);

      if (res.data.success) {
        toast({
          title: res?.data?.message,
          description: "",
        });
        refetchUser()
        router.push("/")
      }
    } catch (error) {
      console.log(error)
      toast({
        variant: "destructive",
        title: error.response?.data?.message,
        description: "Please Try Again!",
      });
    } finally {
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-3xl p-4 mx-auto space-y-4"
      >
        <h2 className="text-xl font-bold">Login to your Account</h2>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter Email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter Password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* <Link href="/register" className={buttonVariants({ variant: "outline" })}>
          Register
        </Link> */}
        <Button className="ml-0" type="submit">
          Login
        </Button>
      </form>
    </Form>
  );
}
