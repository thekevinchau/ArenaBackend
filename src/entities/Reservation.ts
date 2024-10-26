import {Schema, model} from 'mongoose';


/*

Below is the MongoDB schema for the reservation. We first create an interface so that we introduce static typing into the schema, ensuring no errors.

Mongoose has a Schema object that outlines how the information will be stored in the database. Think of it as a table in a relational database.

Then we can generate a model that is reusable in other components that save to the database (in this case line 35, const Reservation).

Examples can be found in the documentation for mongoose here: https://mongoosejs.com/docs/typescript.html

*/


interface IReservation {
    team_name: string,
    team_tier: string,
    time_booked: Date;
    num_computers: number,
    approved: boolean
}


const ReservationSchema = new Schema<IReservation>({
    team_name: { type: String, required: true},
    team_tier: { type: String, required: true},
    time_booked: { type: Date, required: true},
    num_computers: { type: Number, required: true},
    approved: {type: Boolean}

})

const Reservation = model<IReservation>('Reservation', ReservationSchema);

export default Reservation;