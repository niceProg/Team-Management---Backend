"use strict";

module.exports = function (Tim) {
  // Remote method untuk mendapatkan semua tim
  Tim.remoteMethod("getAll", {
    http: { path: "/getAll", verb: "get" },
    returns: { arg: "data", type: "array" },
  });

  Tim.getAll = function (cb) {
    Tim.find({}, { fields: { id: true, nama: true, deskripsi: true } }, cb);
  };

  // Remote method untuk menambahkan tim baru
  Tim.remoteMethod("createTim", {
    http: { path: "/create", verb: "post" },
    accepts: { arg: "timData", type: "object", http: { source: "body" } },
    returns: { arg: "data", type: "object" },
  });

  Tim.createTim = function (timData, cb) {
    // Validasi data tim
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

  // Remote method untuk mengupdate tim yang ada
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
      // Validasi data sebelum update
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

  // Remote method untuk menghapus tim
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
