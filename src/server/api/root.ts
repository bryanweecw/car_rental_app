import { createTRPCRouter } from "~/server/api/trpc";
import { exampleRouter } from "~/server/api/routers/example";
import { vehicleQueryRouter } from "~/server/api/routers/vehicleQueryRouter";
import { contactMutationRouter } from "./routers/ContactPageRouter";
import { vehicleInfoQueryRouter } from "./routers/vehicleInfoQueryRouter";
import { createHireAgreementRouter } from "./routers/CreateHireAgreementRouter";
import { retrieveAllHireAgreementsRouter } from "./routers/retrieveAllHireAgreementsRouter";
import { HireAgreementInfoQueryRouter } from "./routers/hireAgreementInfoQueryRouter";
import { retrieveUnavailableVehiclesRouter } from "./routers/retrieveUnavailableVehiclesRouter";
import { updateHireAgreementRouter } from "./routers/UpdateHireAgreementRouter";
import { retrieveAllOutletVehiclesRouter } from "./routers/retrieveAllOutletVehicles";
import { mutateCarRouter } from "./routers/mutateCarRouter";
import { retrieveAllClientsRouter } from "./routers/retrieveAllClientsRouter";
import { clientInfoQueryRouter } from "./routers/clientInfoQueryRouter";
import { retrieveAllTasks } from "./routers/retrieveAllTasks";
import { addTaskRouter } from "./routers/deleteaddTask";
import { retrieveClientHireAgreementsRouter } from "./routers/retrieveClientHireAgreementsRouter";
import { deleteHireAgreementRouter } from "./routers/DeleteHireAgreementRouter";
import { addCarRouter } from "./routers/addCarRouter";
import { deleteVehicleRouter } from "./routers/DeleteVehicleRouter";
import { retrieveSetUpStatusRouter } from "./routers/getRoleRouter";


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
  HireAgreementInfoQuery: HireAgreementInfoQueryRouter,
  RetrieveUnavailableVehicles: retrieveUnavailableVehiclesRouter,
  hireAgreementUpdateMutation: updateHireAgreementRouter,
  RetrieveAllOutletVehicles: retrieveAllOutletVehiclesRouter,
  mutateCarRouter: mutateCarRouter,
  addCarRouter: addCarRouter,
  retrieveAllClients: retrieveAllClientsRouter,
  clientInfoQuery: clientInfoQueryRouter,
  retrieveAllTasks: retrieveAllTasks,
  addTaskRouter: addTaskRouter,
  RetrieveClientHireAgreements: retrieveClientHireAgreementsRouter,
  DeleteHireAgreement: deleteHireAgreementRouter,
  DeleteVehicle: deleteVehicleRouter,
  retrieveSetUpStatus: retrieveSetUpStatusRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
