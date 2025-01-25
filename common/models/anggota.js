"use strict";

module.exports = function (Anggota) {
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

  Anggota.observe("before save", async function checkTimId(ctx, next) {
    const Tim = Anggota.app.models.Tim;
    const timId = ctx.instance ? ctx.instance.tim_id : ctx.data.tim_id;

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

  const isValidUUID = (uuid) => {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  };
};
