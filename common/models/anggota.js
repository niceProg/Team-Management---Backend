"use strict";

module.exports = function (Anggota) {
  // Remote method untuk mendapatkan anggota berdasarkan tim
  Anggota.remoteMethod("getByTim", {
    http: { path: "/getByTim/:timId", verb: "get" },
    accepts: { arg: "timId", type: "string", required: true },
    returns: { arg: "data", type: "array" },
  });

  Anggota.getByTim = async function (timId) {
    if (!isValidUUID(timId)) {
      throw new Error("Invalid UUID format for timId");
    }

    console.log("Fetching anggota for timId:", timId);

    const anggota = await Anggota.find({
      where: { tim_id: timId },
    });

    console.log("Result anggota:", anggota);

    return anggota;
  };

  // Hook sebelum data disimpan
  Anggota.observe("before save", async function checkTimId(ctx, next) {
    const Tim = Anggota.app.models.Tim;

    // Ambil tim_id dari data yang akan disimpan
    const timId = ctx.instance ? ctx.instance.tim_id : ctx.data.tim_id;

    // Validasi tim_id, cek apakah tim dengan tim_id tersebut ada
    if (timId) {
      const timExists = await Tim.count({ id: timId });
      if (!timExists) {
        const error = new Error("Invalid tim_id: Tim does not exist.");
        error.statusCode = 400;
        return next(error);
      }
    }
    next();
  });

  // Remote method untuk menambahkan anggota baru
  Anggota.remoteMethod("createAnggota", {
    http: { path: "/create", verb: "post" },
    accepts: { arg: "anggotaData", type: "object", http: { source: "body" } },
    returns: { arg: "data", type: "object" },
  });

  Anggota.createAnggota = async function (anggotaData) {
    console.log("Data diterima backend:", anggotaData);

    if (!isValidUUID(anggotaData.tim_id)) {
      console.error("Validasi UUID gagal untuk tim_id:", anggotaData.tim_id);
      throw new Error("Invalid UUID format for timId");
    }

    return await Anggota.create(anggotaData);
  };

  // Remote method untuk memperbarui anggota
  Anggota.remoteMethod("updateAnggota", {
    http: { path: "/update/:id", verb: "put" },
    accepts: [
      { arg: "id", type: "string", required: true },
      {
        arg: "anggotaData",
        type: "object",
        required: true,
        http: { source: "body" },
      },
    ],
    returns: { arg: "data", type: "object" },
  });

  Anggota.updateAnggota = async function (id, anggotaData) {
    if (!isValidUUID(id)) {
      throw new Error("Invalid UUID format for id");
    }

    const anggota = await Anggota.findById(id);
    if (!anggota) {
      throw new Error("Anggota tidak ditemukan");
    }

    Object.assign(anggota, anggotaData);
    return await anggota.save();
  };

  // Remote method untuk menghapus anggota
  Anggota.remoteMethod("deleteAnggota", {
    http: { path: "/delete/:id", verb: "delete" },
    accepts: { arg: "id", type: "string", required: true },
    returns: { arg: "data", type: "object" },
  });

  Anggota.deleteAnggota = async function (id) {
    if (!isValidUUID(id)) {
      throw new Error("Invalid UUID format for id");
    }

    const anggota = await Anggota.findById(id);
    if (!anggota) {
      throw new Error("Anggota tidak ditemukan");
    }

    await anggota.destroy();
    return { message: "Anggota berhasil dihapus" };
  };

  // Helper function untuk validasi UUID
  const isValidUUID = (uuid) => {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  };
};
