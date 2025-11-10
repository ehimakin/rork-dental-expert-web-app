import { z } from "zod";
import { publicProcedure } from "../../create-context";
import { consultations } from "./create";

export default publicProcedure
  .input(
    z.object({
      id: z.string(),
      status: z.enum(["pending", "scheduled", "completed", "cancelled"]),
      scheduledDate: z.string().optional(),
    })
  )
  .mutation(({ input }) => {
    const consultation = consultations.find((c) => c.id === input.id);

    if (!consultation) {
      throw new Error("Consultation not found");
    }

    consultation.status = input.status;
    if (input.scheduledDate) {
      consultation.scheduledDate = new Date(input.scheduledDate);
    }

    console.log("✅ Updated consultation:", consultation.id, "to", input.status);

    return {
      ...consultation,
      createdAt: consultation.createdAt.toISOString(),
      scheduledDate: consultation.scheduledDate ? consultation.scheduledDate.toISOString() : undefined,
    };
  });
