import { createTRPCRouter } from "./create-context";
import hiRoute from "./routes/example/hi/route";
import createConsultation from "./routes/consultations/create";
import listConsultations from "./routes/consultations/list";
import updateConsultationStatus from "./routes/consultations/update-status";

export const appRouter = createTRPCRouter({
  example: createTRPCRouter({
    hi: hiRoute,
  }),
  consultations: createTRPCRouter({
    create: createConsultation,
    list: listConsultations,
    updateStatus: updateConsultationStatus,
  }),
});

export type AppRouter = typeof appRouter;
