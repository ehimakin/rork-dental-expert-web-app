import { z } from "zod";
import { publicProcedure } from "../../create-context";
import { consultations } from "./create";

export default publicProcedure
  .input(
    z.object({
      id: z.string(),
      status: z.enum(["pending", "scheduled", "completed", "cancelled"]),
      scheduledDate: z.date().optional(),
    })
  )
  .mutation(({ input }) => {
    const consultation = consultations.find((c) => c.id === input.id);

    if (!consultation) {
      throw new Error("Consultation not found");
    }

    consultation.status = input.status;
    if (input.scheduledDate) {
      consultation.scheduledDate = input.scheduledDate;
    }

    console.log("Updated consultation:", consultation.id, "to", input.status);

    return consultation;
  });
