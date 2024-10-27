import {Schema, model, ObjectId, Mongoose} from 'mongoose';
import {IReservation, ReservationSchema} from './Reservation';


interface IComputer{
    identifier: string, //ie. "Stage PC 1, Stage PC 2, Read Room 1, Read Room 2, Side Stage 1, Side Stage 2
    current_booked_team: ObjectId, //the ID of the team who currently owns the reservation for the PC
    queue: IReservation[], //The list of teams that are trying to reserve the PCs
    available: boolean //Is the PC available?
}

const computerSchema = new Schema<IComputer>({
    identifier: { type: String, required: true},
    current_booked_team: { type: Schema.Types.ObjectId},
    queue: { type: [ReservationSchema]},
    available: { type: Boolean, required: true}
})

const Computer = model('Computer', computerSchema);

export default Computer;