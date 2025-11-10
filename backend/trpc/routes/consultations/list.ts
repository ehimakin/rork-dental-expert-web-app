import { z } from "zod";
import { publicProcedure } from "../../create-context";
import { consultations } from "./create";

export default publicProcedure
  .input(
    z
      .object({
        clientId: z.string().optional(),
        status: z
          .enum(["pending", "scheduled", "completed", "cancelled"])
          .optional(),
      })
      .optional()
  )
  .query(({ input }) => {
    let filtered = [...consultations];

    if (input?.clientId) {
      filtered = filtered.filter((c) => c.clientId === input.clientId);
    }

    if (input?.status) {
      filtered = filtered.filter((c) => c.status === input.status);
    }

    filtered.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    console.log("Listing consultations:", filtered.length);

    return filtered;
  });
