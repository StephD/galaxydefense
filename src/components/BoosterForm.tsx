import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";

// Define the form validation schema
const boosterSchema = z.object({
  discord_name: z.string().min(3, "Discord name must be at least 3 characters"),
  discord_nickname: z.string().optional(),
  ig_id: z.string().optional(),
  active: z.boolean().default(true),
});

type BoosterFormValues = z.infer<typeof boosterSchema>;

interface BoosterFormProps {
  onSubmit: (data: BoosterFormValues) => Promise<void>;
  onCancel: () => void;
  defaultValues?: Partial<BoosterFormValues>;
  isEditing?: boolean;
}

const BoosterForm = ({
  onSubmit,
  onCancel,
  defaultValues = {
    discord_name: "",
    discord_nickname: "",
    ig_id: "",
    active: true,
  },
  isEditing = false,
}: BoosterFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with react-hook-form
  const form = useForm<BoosterFormValues>({
    resolver: zodResolver(boosterSchema),
    defaultValues,
  });

  // Handle form submission
  const handleSubmit = async (data: BoosterFormValues) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="discord_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Discord Name</FormLabel>
              <FormControl>
                <Input placeholder="Your Discord Name.g." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="discord_nickname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Discord Nickname</FormLabel>
              <FormControl>
                <Input placeholder="Your Nickname" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="ig_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>In-Game ID</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter in-game ID" 
                  className="min-h-[80px]" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="active"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Active</FormLabel>
                <p className="text-sm text-muted-foreground">
                  Is this booster currently active?
                </p>
              </div>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEditing ? "Updating..." : "Creating..."}
              </>
            ) : (
              <>{isEditing ? "Update Booster" : "Add Booster"}</>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default BoosterForm;
