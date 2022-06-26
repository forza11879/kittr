import { WarzoneAdminController } from "@Server/controllers/admin/warzone/index"
import { createRouter } from "@Server/createRouter"

export const optionsRouter = createRouter()
  .merge("update", WarzoneAdminController.updateOptionsForBase)
