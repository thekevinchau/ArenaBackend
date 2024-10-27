import { Schema, model, ObjectId } from "mongoose";

/*

Below is the MongoDB schema for the reservation. We first create an interface so that we introduce static typing into the schema, ensuring no errors.

Mongoose has a Schema object that outlines how the information will be stored in the database. Think of it as a table in a relational database.

Then we can generate a model that is reusable in other components that save to the database (in this case line 35, const Reservation).

Examples can be found in the documentation for mongoose here: https://mongoosejs.com/docs/typescript.html

*/

export interface IReservation {
  owner: Schema.Types.ObjectId;
  team_name: string;
  day: string,
  start_time: Date;
  end_time: Date;
  approved: boolean;
}

export const ReservationSchema = new Schema<IReservation>({
  owner: { type: Schema.Types.ObjectId, required: true },
  team_name: { type: String, required: true },
  day: { type: String, required: true},
  start_time: { type: Date, required: true },
  end_time: { type: Date, required: true },
  approved: { type: Boolean, default: false },
});

const Reservation = model<IReservation>("Reservation", ReservationSchema);

export default Reservation;
