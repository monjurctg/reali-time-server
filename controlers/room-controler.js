const RoomDto = require("../dtos/room-dto");
const {getAllRooms} = require("../services/room-service");
const roomService = require("../services/room-service");

class RoomsControler {
  async create(req, res) {
    const {topic, roomType} = req.body;
    if (!topic || !roomType) {
      return res.status(400).json({message: "Topic and room Type required"});
    }
    const room = await roomService.create({
      topic,
      roomType,
      ownerId: req.user._id,
    });
    return res.json(new RoomDto(room));
  }

  // get all rooms
  async index(req, res) {
    const rooms = await getAllRooms(["open"]);
    const allRooms = rooms.map((room) => new RoomDto(room));
    return res.json({allRooms});
  }
}
module.exports = new RoomsControler();
