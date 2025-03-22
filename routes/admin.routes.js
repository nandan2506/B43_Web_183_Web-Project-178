const express =  require("express")
const { adminLogin, getBorrowRequests, approveBorrowRequest, rejectBorrowRequest } = require("../controllers/admin.controller")
const authentication = require("../middlewares/authentication");

const router = express.Router()




router.post("/login" ,adminLogin)
router.get("/borrow-requests", authentication, getBorrowRequests);
router.post("/approve/:requestId", authentication, approveBorrowRequest);
router.post("/reject/:requestId", authentication, rejectBorrowRequest);

module.exports = router;
