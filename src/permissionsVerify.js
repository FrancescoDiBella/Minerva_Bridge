//Crea una classe per verificare i permessi di accesso, la classe espone un metodo che verifica se l'utente ha i permessi per accedere a una risorsa tramite un oggetto options che contiene i parametri necessari per la verifica.
const { NotAuthenticated } = require("@feathersjs/errors");
const lmsModel = require("./models/_lms.model");
const adminModel = require("./models/admin.model");
const userModel = require("./models/access.model");


class PermissionsVerify {
  constructor(app) {
    this.app = app;
  }

  async isSuperAdmin(idAdmin) {
    //query per controllare che abbia ruolo super admin
    const admins = await adminModel(this.app);
    const admin = await admins.findOne({
      where: {
        id: idAdmin,
      },
    });

    if (admin.role != "superAdmin") {
      throw new NotAuthenticated("Non hai i permessi per accedere a questa risorsa");
    }
  }

  async isLmsAdmin(idAdmin, idLms, routeId) {
    //restituisce true se l'admin è superadmin
    //restituisce true se l'admin è admin di un lms
    //restituisce false se l'admin non è admin di un lms

    const admins = await adminModel(this.app);
    const admin = await admins.findOne({
      where: {
        id: idAdmin,
      },
    });

    if (admin.role == "superadmin") { //se è superadmin può fare tutto
      return true;
    }

    if(idAdmin != routeId){ //se non è superadmin e idAdmin non è uguale a routeId allora non può fare nulla
      return false;
    }

    return true;
  }
}

module.exports = function (app) {
  return new PermissionsVerify(app);
};

module.exports.PermissionsVerify = PermissionsVerify;

