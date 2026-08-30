import express from "express";
import requireAuth from "../middleware/authMiddleware.js";
import {
  createOrganization,
  getOrganizations,
  requestToJoin,
  respondToJoinRequest,
  getOrganizationMembers,
} from "../controllers/organizationController.js";

const router = express.Router();

router.get("/", getOrganizations);
router.post("/", requireAuth, createOrganization);
router.post("/:org_id/join", requireAuth, requestToJoin);
router.patch("/:org_id/members/:user_id", requireAuth, respondToJoinRequest);
router.get("/:org_id/members", requireAuth, getOrganizationMembers);

export default router;
