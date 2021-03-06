import { Room } from "./Room-Manager";
import GameManager, { GAME_NAME } from "./Game-Manager";
import User from "../../schema/User";
import { ObjectID } from "bson";

class Meeting {
	meetingName: string;
	room1: Room;
	room2: Room;
	game: GameManager;
	users: ObjectID[];

	constructor(data: any) {
		Object.keys(data).forEach((key) => (this[key] = data[key]));
	}
	private async getMeetingMembers() {
		return await User.find({ _id: this.getMeetingMembersId() });
	}
	getMeetingMembersId(): ObjectID[] {
		return this.users;
	}
	startGame(gameName: GAME_NAME) {
		this.game.startGame(gameName, this.getMeetingMembersId());
	}
}
class MeetingManager {
	meetingList: Meeting[] = [];

	findByMeetingName(meetingName: string): Meeting {
		return this.meetingList.find((meeting) => meeting.meetingName == meetingName);
	}
	findByMeetingRooms(room: Room): Meeting {
		return this.meetingList.find((meeting) => meeting.room1.roomName == room.roomName || meeting.room2.roomName == room.roomName);
	}
	createMeeting(room1: Room, room2: Room) {
		function createRandomNumber(n: number = 6) {
			return (+new Date() * Math.floor((1 + Math.random()) * 10)).toString().slice(-n);
		}
		let meeting: Meeting = new Meeting({
			meetingName: createRandomNumber(8),
			room1,
			room2,
			game: new GameManager(),
			users: room1.users.concat(room2.users),
		});
		this.meetingList.push(meeting);
		return meeting;
	}
}

export default new MeetingManager();
