const Roles = require("../db/roles");

const needPrivilege = async (req, res, next) => {
    const response = await Roles.getRole(req.userId);
    const modState = response.is_mod;
    const adminState = response.is_admin;

    if (!modState && !adminState) return res.status(403).json({ message: "mate, you arent privileged to be allowed to do that lol" });

    next();
}

const needAdmin = async (req, res, next) => {
    const response = await Roles.getRole(req.userId);
    const adminState = response.is_admin;

    if (!adminState) return res.status(403).json({ message: "you arent admin buddy" });

    next();
}

const isSameId = async (req, res, next) => {
    const { id } = req.body
    const requestId = req.userId;
    console.log(id !== requestId);
    if (id !== requestId) return res.status(403).json({ message: "get out" });

    next();
}

const isSameIdOrIsModAdmin = async (req, res, next) => {
    const requestUserRole = await Roles.getRole(req.userId);
    const requestModState = requestUserRole.is_mod;
    const requestAdminState = requestUserRole.is_admin;
    
    const targetUserRole = await Roles.getRole(req.body.id);
    const adminStateTarget = targetUserRole.is_admin;

    req.is_admin = requestAdminState ? true : false;
    req.is_mod = requestModState ? true : false;
    
     const targetId = req.body.id;
    console.log(`targetId: ${targetId}, requestId: ${req.userId}`);

    if (requestAdminState || (requestModState && !adminStateTarget)) {
        console.log(`admin/mod (id=${req.userId}) gained access to delete user`);
        //if (await Roles.is_admin(targetId)) return res.status(403).json({ message: "you cant delete an admin" });
    } else {
        const { id } = req.body
        const requestId = req.userId;
        console.log(id !== requestId);
        if (id !== requestId) return res.status(403).json({ message: "oi re who are you?" });
    }

    next();
}

module.exports = { needPrivilege, needAdmin, isSameId, isSameIdOrIsModAdmin };