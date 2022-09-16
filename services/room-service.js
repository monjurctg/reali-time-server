const RoomModel = require("../models/room-model");

class RoomServie {
  async create(payload) {
    const {topic, roomType, ownerId} = payload;
    const room = await RoomModel.create({
      topic,
      roomType,
      ownerId,
      speakers: [ownerId],
    });
    return room;
  }

  // get   room
  async getAllRooms(types) {
    const rooms = await RoomModel.find({roomType: {$in: types}})
      .populate("speakers")
      .populate("ownerId");
    return rooms;
  }
}

module.exports = new RoomServie();
