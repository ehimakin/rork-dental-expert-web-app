import { createTRPCRouter } from "./create-context";
import { hiProcedure } from "./routes/example/hi/route";
import { createConsultationProcedure } from "./routes/consultations/create";
import { listConsultationsProcedure } from "./routes/consultations/list";
import { updateConsultationStatusProcedure } from "./routes/consultations/update-status";

export const appRouter = createTRPCRouter({
  example: createTRPCRouter({
    hi: hiProcedure,
  }),
  consultations: createTRPCRouter({
    create: createConsultationProcedure,
    list: listConsultationsProcedure,
    updateStatus: updateConsultationStatusProcedure,
  }),
});

export type AppRouter = typeof appRouter;
