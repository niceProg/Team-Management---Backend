"use strict";

module.exports = function (Tim) {
  Tim.remoteMethod("getAll", {
    http: { path: "/getAll", verb: "get" },
    returns: { arg: "data", type: "array" },
  });

  Tim.getAll = function (cb) {
    Tim.find({}, { fields: { id: true, nama: true, deskripsi: true } }, cb);
  };

  Tim.remoteMethod("createTim", {
    http: { path: "/create", verb: "post" },
    accepts: { arg: "timData", type: "object", http: { source: "body" } },
    returns: { arg: "data", type: "object" },
  });

  Tim.createTim = function (timData, cb) {
    if (!timData.nama) {
      return cb({ error: "Nama tim tidak boleh kosong" });
    }
    Tim.create(timData, function (err, createdTim) {
      if (err) {
        return cb(err);
      }
      cb(null, createdTim);
    });
  };

  Tim.remoteMethod("updateTim", {
    http: { path: "/update/:id", verb: "put" },
    accepts: [
      { arg: "id", type: "string", http: { source: "path" } },
      { arg: "timData", type: "object", http: { source: "body" } },
    ],
    returns: { arg: "data", type: "object" },
  });

  Tim.updateTim = function (id, timData, cb) {
    Tim.findById(id, function (err, tim) {
      if (err) {
        return cb(err);
      }
      if (!tim) {
        return cb({ error: "Tim tidak ditemukan" });
      }
      if (!timData.nama) {
        return cb({ error: "Nama tim tidak boleh kosong" });
      }
      Object.assign(tim, timData);
      tim.save(function (err, updatedTim) {
        if (err) {
          return cb(err);
        }
        cb(null, updatedTim);
      });
    });
  };

  Tim.remoteMethod("deleteTim", {
    http: { path: "/delete/:id", verb: "delete" },
    accepts: { arg: "id", type: "string", required: true },
    returns: { arg: "data", type: "object" },
  });

  Tim.deleteTim = function (id, cb) {
    console.log("Received ID:", id);

    if (!isValidUUID(id)) {
      return cb({ error: "Invalid UUID format" });
    }

    Tim.destroyById(id, cb);
  };

  const isValidUUID = (uuid) => {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  };
};
