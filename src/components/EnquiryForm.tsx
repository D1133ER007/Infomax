import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { useEnquiries } from "@/lib/hooks/useEnquiries";

const enquiryFormSchema = z.object({
  enquiry_id: z.string().min(1, "Enquiry ID is required"),
  registered_id: z.string().optional(),
  enquiry_date: z.string(),
  start_date: z.string().optional(),
  full_name: z.string().min(2, "Full name is required"),
  date_of_birth: z.string().optional(),
  contact_no: z.string().min(1, "Contact number is required"),
  email: z.string().email("Invalid email"),
  academic_qualification: z.string().optional(),
  technical_qualification: z.string().optional(),
  occupation: z.string().optional(),
  guardian_name: z.string().optional(),
  guardian_occupation: z.string().optional(),
  guardian_contact: z.string().optional(),
  temporary_address: z.string().optional(),
  permanent_address: z.string().optional(),
  enrolled_course: z.string().optional(),
  time_preferred: z.string().optional(),
  scheme_name: z.string().optional(),
  course_fee: z.string().transform((val) => Number(val) || 0),
  net_course_fee: z.string().transform((val) => Number(val) || 0),
  scheme_offered: z.boolean().default(false),
  discount_given: z.string().optional(),
});

type EnquiryFormValues = z.infer<typeof enquiryFormSchema>;

export default function EnquiryForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { createEnquiry } = useEnquiries();
  const { user } = useAuthContext();

  const form = useForm<EnquiryFormValues>({
    resolver: zodResolver(enquiryFormSchema),
    defaultValues: {
      enquiry_id: `ENQ${new Date().getTime()}`,
      registered_id: "",
      enquiry_date: new Date().toISOString().split("T")[0],
      start_date: "",
      full_name: "",
      date_of_birth: "",
      contact_no: "",
      email: "",
      academic_qualification: "",
      technical_qualification: "",
      occupation: "",
      guardian_name: "",
      guardian_occupation: "",
      guardian_contact: "",
      temporary_address: "",
      permanent_address: "",
      enrolled_course: "",
      time_preferred: "",
      scheme_name: "",
      course_fee: "",
      net_course_fee: "",
      scheme_offered: false,
      discount_given: "",
    },
  });

  const onSubmit = async (data: EnquiryFormValues) => {
    try {
      setIsSubmitting(true);
      const { error } = await createEnquiry({ ...data, user_id: user?.id });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Enquiry has been submitted successfully.",
      });

      // Reset form
      form.reset({
        ...form.getValues(),
        enquiry_id: `ENQ${new Date().getTime()}`,
        registered_id: "",
        full_name: "",
        date_of_birth: "",
        contact_no: "",
        email: "",
        academic_qualification: "",
        technical_qualification: "",
        occupation: "",
        guardian_name: "",
        guardian_occupation: "",
        guardian_contact: "",
        temporary_address: "",
        permanent_address: "",
        enrolled_course: "",
        time_preferred: "",
        scheme_name: "",
        course_fee: "",
        net_course_fee: "",
        scheme_offered: false,
        discount_given: "",
      });
    } catch (error) {
      console.error("Error submitting enquiry:", error);
      toast({
        title: "Error",
        description: "Failed to submit enquiry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto bg-white shadow-lg">
      <CardHeader className="text-center space-y-2 pb-2">
        <h1 className="text-3xl font-bold tracking-tight">INFOMAX</h1>
        <p className="text-sm text-muted-foreground italic">
          a key of innovation..
        </p>
        <p className="text-sm font-medium">Pokhara, 061-585428</p>
        <Separator className="my-2" />
        <h2 className="text-2xl font-semibold">Student Enquiry Form</h2>
      </CardHeader>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div className="grid grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
            <FormField
              control={form.control}
              name="enquiry_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enquiry ID</FormLabel>
                  <FormControl>
                    <Input {...field} className="bg-white" readOnly />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="registered_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Registered ID</FormLabel>
                  <FormControl>
                    <Input {...field} className="bg-white" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="enquiry_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enquiry Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} className="bg-white" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-6 border rounded-lg p-6">
            <div className="flex items-center gap-2">
              <div className="h-1 w-1 rounded-full bg-primary" />
              <h3 className="text-lg font-semibold">Student Information</h3>
            </div>

            <div className="grid gap-6">
              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="date_of_birth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="contact_no"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact No</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="academic_qualification"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Academic Qualification</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="technical_qualification"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Technical Qualification</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="occupation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Occupation</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="temporary_address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Temporary Address</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="permanent_address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Permanent Address</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          <div className="space-y-6 border rounded-lg p-6 bg-muted/10">
            <div className="flex items-center gap-2">
              <div className="h-1 w-1 rounded-full bg-primary" />
              <h3 className="text-lg font-semibold">Office Use Only</h3>
            </div>

            <div className="grid gap-6">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="enrolled_course"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Enrolled Course</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="course_fee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Course Fee</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="time_preferred"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time Preferred</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="net_course_fee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Net Course Fee</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
              disabled={isSubmitting}
            >
              Reset
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Submit Enquiry
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
}
