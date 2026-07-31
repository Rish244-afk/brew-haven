import { z } from "zod";

// Anti-Spam Honeypot helper
export function checkHoneypot(honeypotValue?: string | null): boolean {
  return typeof honeypotValue === "string" && honeypotValue.trim().length > 0;
}

// 1. Reservation Form Schema
export const ReservationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please provide a valid email address."),
  phone: z.string().min(7, "Please provide a valid phone number."),
  partySize: z.coerce.number().int().min(1, "Party size must be at least 1.").max(8, "Max party size for online reservation is 8."),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), { message: "Invalid date format." }),
  time: z.string().min(1, "Please select a time."),
  notes: z.string().optional().nullable(),
  hp_field: z.string().optional().nullable(), // honeypot
});

// 2. Contact Message Schema
export const ContactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please provide a valid email address."),
  type: z.enum(["reservation", "private-event", "general"], {
    errorMap: () => ({ message: "Please select a valid enquiry category." }),
  }),
  message: z.string().min(10, "Message must be at least 10 characters long."),
  hp_field: z.string().optional().nullable(), // honeypot
});

// 3. Checkout Request Schema
export const CheckoutSchema = z.object({
  customerName: z.string().min(2, "Customer name is required."),
  customerEmail: z.string().email("Valid email is required."),
  items: z
    .array(
      z.object({
        menuItemId: z.string(),
        name: z.string(),
        price: z.number().int().positive(),
        quantity: z.number().int().positive(),
      })
    )
    .min(1, "Cart cannot be empty."),
});

// 4. Menu Item Admin Schema
export const MenuItemSchema = z.object({
  name: z.string().min(2, "Name is required."),
  description: z.string().min(5, "Description is required."),
  price: z.coerce.number().int().positive("Price must be a positive integer in cents."),
  category: z.enum(["drinks", "food", "desserts"]),
  imageUrl: z.string().url("Must be a valid image URL").or(z.literal("")).optional().nullable(),
  available: z.boolean().default(true),
});
