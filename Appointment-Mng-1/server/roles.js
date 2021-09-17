const AccessControl = require("accesscontrol");
const ac = new AccessControl();

exports.roles = (function() {
ac.grant("basic")
 .readOwn("profile")
 .updateOwn("profile")

ac.grant("admin")
 .extend("basic")
 .updateAny("service")
 .createAny("service")
 .deleteAny("profile")
 .readAny("booking")
 .updateAny("booking")


return ac;
})();