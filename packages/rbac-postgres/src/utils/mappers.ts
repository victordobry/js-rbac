import { RbacItem } from "@brainstaff/rbac";
import RbacItemModel from "../models/RbacItem";

export const toRbacItem = (model: RbacItemModel) => new RbacItem(({ 
    ...model,
    rule: model.rule ?? undefined,
}))
