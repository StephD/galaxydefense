import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReportType, Report, ModName } from "@/hooks/useReports";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

// Form schema validation with sanitization
const formSchema = z.object({
  title: z.string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters")
    .transform(val => val.trim()), // Sanitize by trimming whitespace
  description: z.string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must be less than 1000 characters")
    .transform(val => val.trim()), // Sanitize by trimming whitespace
  user_id: z.string(),
    // .min(1, "User ID is required")
    // .regex(/^[a-zA-Z0-9-_]+$/, "User ID must contain only alphanumeric characters, hyphens, and underscores"), // Validate format
  mod_id: z.enum(["Steph", "Goat", "Reaper", "Kj", "SnowMiku", "Other"] as const),
  type: z.enum(["suggestions", "translation", "optimisation", "other"] as const),
});

// Define the form values type based on the schema
type FormValues = z.infer<typeof formSchema>;

// Explicitly define the type to ensure it matches the schema
interface FormData {
  title: string;
  description: string;
  user_id: string;
  mod_id: ModName;
  type: ReportType;
}

interface ReportFormProps {
  onSubmit: (data: FormValues) => Promise<void>;
  onCancel?: () => void;
  defaultValues?: {
    title?: string;
    description?: string;
    user_id?: string;
    mod_id?: ModName;
    type?: ReportType;
  };
  isEditing?: boolean;
}

const ReportForm = ({ onSubmit, onCancel, defaultValues, isEditing = false }: ReportFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || {
      title: "",
      description: "",
      user_id: "",
      mod_id: "Other",
      type: "suggestions",
    },
    mode: "onBlur", // Validate on blur for better UX
  });

  const handleSubmit = async (values: FormValues) => {
    try {
      setFormError(null);
      setIsSubmitting(true);
      
      // Additional client-side validation
      if (values.title.includes("<script>") || values.description.includes("<script>")) {
        throw new Error("Invalid input detected");
      }
      
      await onSubmit(values);
      form.reset();
      toast({
        title: "Success",
        description: "Report created successfully",
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      setFormError(error instanceof Error ? error.message : "An unexpected error occurred");
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create report. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-0 border-b shadow-none">
      <hr className="mb-2" />
      <CardContent className="p-0">
        {formError && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{formError}</AlertDescription>
          </Alert>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center gap-2">
                    <FormLabel className="min-w-20">Title</FormLabel>
                    <div className="flex w-full" style={{ marginTop: "0px" }}>
                      <FormControl>
                        <Input placeholder="Report title" {...field} />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center gap-2">
                    <FormLabel className="min-w-20">Report Type</FormLabel>
                    <div className="flex-1" style={{ marginTop: "0px" }}>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select report type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="suggestions">Suggestions</SelectItem>
                          <SelectItem value="translation">Translation</SelectItem>
                          <SelectItem value="optimisation">Optimisation</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="mb-1">Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Detailed description of the report"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <FormField
                control={form.control}
                name="user_id"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center gap-2">
                    <FormLabel className="min-w-20">User ID</FormLabel>
                    <div className="flex-1" style={{ marginTop: "0px" }}>
                      <FormControl>
                        <Input placeholder="User ID who reported this issue" {...field} />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="mod_id"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center gap-2">
                    <FormLabel className="min-w-20">Mod Name</FormLabel>
                    <div className="flex-1" style={{ marginTop: "0px" }}>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select mod name" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Steph">Steph</SelectItem>
                          <SelectItem value="Goat">Goat</SelectItem>
                          <SelectItem value="Reaper">Reaper</SelectItem>
                          <SelectItem value="Kj">Kj</SelectItem>
                          <SelectItem value="SnowMiku">SnowMiku</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-4 w-full pt-2 pb-0">
              {onCancel && (
                <Button 
                  size="sm"
                  type="button" 
                  variant="secondary" 
                  className="flex-1" 
                  onClick={onCancel}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              )}
              <Button 
                size="sm"
                type="submit" 
                className="flex-1" 
                disabled={isSubmitting}
              >
                {isSubmitting 
                  ? (isEditing ? "Updating..." : "Creating...") 
                  : (isEditing ? "Update Report" : "Create Report")
                }
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ReportForm;
