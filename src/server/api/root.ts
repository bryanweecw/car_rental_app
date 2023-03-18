import { createTRPCRouter } from "~/server/api/trpc";
import { exampleRouter } from "~/server/api/routers/example";
import { vehicleQueryRouter } from "~/server/api/routers/vehicleQueryRouter";
import { contactMutationRouter } from "./routers/ContactPageRouter";
import { vehicleInfoQueryRouter } from "./routers/vehicleInfoQueryRouter";
import { createHireAgreementRouter } from "./routers/CreateHireAgreementRouter";
import { retrieveAllHireAgreementsRouter } from "./routers/retrieveAllHireAgreementsRouter";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  vehicleQuery: vehicleQueryRouter,
  vehicleInfoQuery: vehicleInfoQueryRouter,
  contactMutation: contactMutationRouter,
  hireAgreementCreationMutation: createHireAgreementRouter,
  RetrieveAllHireAgreements: retrieveAllHireAgreementsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
