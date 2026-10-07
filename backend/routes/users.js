const express = require("express");
const router = express.Router();

const usersController = require("../controllers/usersController");
const authJwt = require("../middleware/authJwt");
const roleCheck = require("../middleware/roleCheck");

/* (current functions)
module.exports = {
    getNumUsers_get,
    getUserById_get,
    // createUser_post,
    getUserDataByUsername_get,
    updateUser_post,
    deleteUser_post
}
*/

router.get("/", (req, res) => {
    res.send("users route");
});

router.get("/getNum", usersController.getNumUsers_get);
router.get("/getById", usersController.getUserById_get);
router.get("/getAll", authJwt.verifyToken, roleCheck.needPrivilege, usersController.getAll_get);
router.get("/getDataByUsername", usersController.getUserDataByUsername_get);
router.get("/private/getDataById", authJwt.verifyToken, usersController.privateGetDataById_get);


//router.post("/create", usersController.createUser_post);
router.post("/update", authJwt.verifyToken, usersController.updateUser_post);
router.post("/private/resetPass", authJwt.verifyToken, usersController.privateResetPass_post);

router.post("/admins/setMod", authJwt.verifyToken, roleCheck.needAdmin, usersController.setUserMod_post);
router.post("/admins/removeMod", authJwt.verifyToken, roleCheck.needAdmin, usersController.removeUserMod_post)

router.post("/danger/delete", authJwt.verifyToken, roleCheck.isSameIdOrIsModAdmin, usersController.deleteUser_post);

module.exports = router;