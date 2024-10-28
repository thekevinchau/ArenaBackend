import { Request, Response } from "express";
import Reservation from "../entities/Reservation";
import { ObjectId } from "mongoose";
interface Reservation {
  num_pcs: number;
  start: Date;
  reason: Date;
  end: string;
}

//A key value pair with the day as the key and a reservation object as the value.
interface TeamReservations {
  reservations: {
    [day: string]: Reservation;
  };
}
export const createReservation = async (
  req: Request,
  res: Response
): Promise<any> => {
  if (!req.user) {
    return res.status(403).json({ message: "You are not logged in!" });
  }

  const { userID, teamName } = req.user;
  const reservations: TeamReservations = req.body.reservations;
  let reservationMessages: string[] = [];

  try {
    for (const [key, value] of Object.entries(reservations)) {
      const newReservation = new Reservation({
        owner: userID,
        team_name: teamName,
        day: key,
        reason: value.reason,
        start_time: value.start,
        end_time: value.end,
        approved: false,
      });

      await newReservation.save();
      reservationMessages.push(
        `Reservation for ${teamName} on ${key} starting at ${value.start} and ending at ${value.end} successfully booked!`
      );
    }
    return res.status(201).json({ message: reservationMessages });
  } catch (err) {
    console.error("Error creating reservation", err);
    return res
      .status(500)
      .json({ message: "Server error occurred when making reservation" });
  }
};

/*

- Editing a reservation...
    - Search for the reservation by its ID from the request body
    - Grab the day, start_time, end_time, and num_pcs from the request body and make the edit.
    - validate that the user is editing their own reservation
*/

export const editReservation = async (
  req: Request,
  res: Response
): Promise<any> => {
  if (!req.user) {
    return res.status(403).json({ message: "You are not logged in!" });
  }

  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({ message: "No changes were made!" });
  }
  const { reservationID } = req.body || null;
  const day: string = req.body.day || null;
  const start_time: Date = req.body.start_time || null;
  const end_time: Date = req.body.end_time || null;

  //If the user is an admin, then the only field they need is the reservationID (since they can edit any reservation they want)
  //If the user is a user, then they'll have to provide their userID AND the reservationID.
  console.log(req.user.isAdmin);

  const query = req.user.isAdmin
    ? { _id: reservationID }
    : { owner: req.user.userID, _id: reservationID };

  try {
    const reservation = await Reservation.findOne(query);
    if (!reservation) {
      return res.status(404).json({ message: "Reservation does not exist!" });
    }

    if (day) reservation.day = day;
    if (start_time) reservation.start_time = new Date(start_time);
    if (end_time) reservation.end_time = new Date(end_time);

    await reservation.save();
    return res.json(reservation);
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ message: "Server error when editing reservation!" });
  }
};

//pass a reservationID into this to figure out which one to delete
export const deleteReservation = async (
  req: Request,
  res: Response
): Promise<any> => {
  if (!req.user) {
    return res.status(403).json({ message: "You are not logged in!" });
  }

  const reservationID: ObjectId = req.body.reservationID;

  try{
    if (req.user.isAdmin){
      await Reservation.findOneAndDelete({_id: reservationID})
      return res.status(200).json({message: `Successfully deleted reservation!`})
    }
    else{
      await Reservation.findOneAndDelete({_id: reservationID, owner: req.user.userID})
      return res.status(200).json({message: "Successfully deleted reservation!"});
    }
  }catch(err){
    console.error('Error deleting reservation', err);
    return res.status(500).json({message: "Internal server error when atempting to delete reservation!"});
  }
}
