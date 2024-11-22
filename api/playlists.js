const express = require("express");
const router = express.Router();
module.exports = router;

const prisma = require("../prisma");
const { authenticate } = require("./auth");

router.get("/", authenticate, async (req, res, next) => {
  try {
    const playlists = await prisma.reservation.findMany({
      where: { userd: req.user.id },
      include: { playlist: true },
    });
    res.json(playlists);
  } catch (e) {
    next(e);
  }
});

router.post("/", authenticate, async (req, res, next) => {
  const { name, description, trackIds } = req.body;
  try {
    const tracks = trackIds.map((id) => ({ id }));
    const playlist = await prisma.playlist.create({
      data: {
        name,
        description,
        userId : req.user.id,
        tracks: { connect : tracks }
      },
    });
    res.status(201).json(playlist);
  } catch (e) {
    next(e);
  }
});

router.get("/:id", authenticate, async (req, res, next) => {
  const { id } = req.params
  try {
   const playlist = await prisma.playlist.findUniqueOrThrow({
     where: { id: +id },
     include: { tracks: true },
   });
   if (playlist.ownerId !== req.user.id) {
     next({ status: 403, message: "This is not your playlist" });
   }
   res.json(playlist)
  }
  catch (e) {
   next(e)
  }
 })