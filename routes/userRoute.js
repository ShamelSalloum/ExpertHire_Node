import { Router } from "express";
import {
  registerUser,
  loginUser,
  logout,
  forgotPassword,
  resetPassword,
  getUserDetails,
  updatePassword,
  updateProfile,
  getAllUser,
  getSingleUser,
  updateUserRole,
  deleteUser,
  getOtherUsersDetails,
  banUser,
  getUsers,
  getUser,
  getBannedUsers,
  searchUser,
} from "../controllers/userController";

import { getAllQuestions, addQuestion, addQuestions } from "../controllers/QuestionController";

import {
  GetAllRequest,
  getUserRequest,
  getRejectedRequests,
  addRequest,
  getPendingRequests,
  getAcceptedRequests,
  acceptRequest,
  rejectRequest,
  getRequest,
} from "../controllers/RequestController";

import { GetAllCategory } from "../controllers/CategoryController";

import { isAuthenticatedUser, authorizeRoles } from "../middleware/auth";
import { checkRequestLimit } from "../middleware/requestLimit";

const router = Router();

router.route("/signup").post(registerUser);

router.route("/login").post(loginUser);

router.route("/password/forgot").post(forgotPassword);

router.route("/password/reset").put(resetPassword);

router.route("/logout").post(isAuthenticatedUser, logout);


router.route("/me").get(isAuthenticatedUser, getUserDetails);

router.route("/password/update").put(isAuthenticatedUser, updatePassword);

router.route("/me/update").put(isAuthenticatedUser, updateProfile);

router
  .route("/view_other_user_details/:id")
  .get(isAuthenticatedUser, getOtherUsersDetails);

router.route("/getUsers").get(getUsers);

router.route("/getUser/:id").get(getUser);

router.route("/getQuestions").get(getAllQuestions);

router.route("/getRequests").get(GetAllRequest);

router.route("/createQuestions").post(addQuestions);



router.route("/getUserRequest").post(isAuthenticatedUser, getUserRequest);

router.route("/addRequest").post(isAuthenticatedUser, checkRequestLimit, addRequest);

router.route("/addQuestion").post(addQuestion);

router.route("/search").post(isAuthenticatedUser, authorizeRoles("admin"), searchUser);

router.route("/request").post(isAuthenticatedUser, authorizeRoles("admin"), getRequest);

router.route("/banUser/:id").post(isAuthenticatedUser, authorizeRoles("admin"), banUser);

router.route("/admin/acceptRequest").post(isAuthenticatedUser, authorizeRoles("admin"), acceptRequest);

router.route("/admin/rejectRequest").post(isAuthenticatedUser, authorizeRoles("admin"), rejectRequest);

router.route("/admin/RejectedRequests").post(isAuthenticatedUser, authorizeRoles("admin"), getRejectedRequests);

router.route("/admin/AcceptedRequests").post(isAuthenticatedUser, authorizeRoles("admin"), getAcceptedRequests);

router.route("/admin/PendingRequests").post(isAuthenticatedUser, authorizeRoles("admin"), getPendingRequests);

router.route("/admin/AllBanedUsers").post(isAuthenticatedUser, authorizeRoles("admin"), getBannedUsers);

router
  .route("/admin/users/allRequests")
  .post(isAuthenticatedUser, authorizeRoles("admin"), GetAllRequest);

router
  .route("/admin/allUsers")
  .post(isAuthenticatedUser, authorizeRoles("admin"), getAllUser);

router
  .route("/admin/user/:id")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getSingleUser)
  .post(isAuthenticatedUser, authorizeRoles("admin"), updateUserRole)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteUser);

export default router;
