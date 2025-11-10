import { z } from "zod";
import { publicProcedure } from "../../create-context";

const consultationDocumentSchema = z.object({
  id: z.string(),
  name: z.string(),
  uri: z.string(),
  type: z.string(),
  size: z.number(),
});

const createConsultationSchema = z.object({
  clientId: z.string(),
  clientName: z.string(),
  clientEmail: z.string().email(),
  clientPhone: z.string().optional(),
  caseDetails: z.string(),
  documents: z.array(consultationDocumentSchema),
});

const consultations: {
  id: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  caseDetails: string;
  documents: {
    id: string;
    name: string;
    uri: string;
    type: string;
    size: number;
  }[];
  status: "pending" | "scheduled" | "completed" | "cancelled";
  createdAt: Date;
  scheduledDate?: Date;
}[] = [];

export default publicProcedure
  .input(createConsultationSchema)
  .mutation(({ input }) => {
    const newConsultation = {
      ...input,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      status: "pending" as const,
      createdAt: new Date().toISOString(),
    };

    consultations.push({
      ...newConsultation,
      createdAt: new Date(),
    } as any);

    console.log("✅ Created consultation:", newConsultation.id);
    console.log("📊 Total consultations:", consultations.length);

    return newConsultation;
  });

export { consultations };
