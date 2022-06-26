import { WarzoneAdminController } from "@Server/controllers/admin/warzone/index"
import { createRouter } from "@Server/createRouter"
import { optionsRouter } from './kitOptions'

export const warzoneKitBaseRouter = createRouter()
  .merge("options/", optionsRouter)
  .merge("list", WarzoneAdminController.listKitBases)
  .merge("create", WarzoneAdminController.createBase)
  .merge("update", WarzoneAdminController.updateBase)
  .merge("delete", WarzoneAdminController.deleteBase)
