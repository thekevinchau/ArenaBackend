import { Request, Response } from "express";
import Reservation from "../entities/Reservation";
import { ObjectId } from "mongoose";
/*
{
    "reservations": {
            "Monday": { "num_pcs": 5, date: "10/28" "start": "2024-10-28T17:30:00", "end": "2024-10-28T19:30:00"},
            "Tuesday": { "num_pcs": 5, "start": "2024-10-28T17:30:00", "end": "2024-10-28T19:30:00"},
            "Thursday": { "num_pcs": 5, "start": "2024-10-28T17:30:00", "end": "2024-10-28T19:30:00"},
            "Friday": { "num_pcs": 5, "start": "2024-10-28T17:30:00", "end": "2024-10-28T19:30:00"}
        }
}


*/

//A key value pair with the day as the key and a reservation object as the value.
//ex: "Monday": { num_pcs: 5, start: 5:30pm, end: 7:30pm},
interface TeamReservations {
  reservations: {
    [day: string]: { num_pcs: string; start: string; end: string };
  };
}
export const createReservation = async (req: Request,res: Response): Promise<any> => {
  if (!req.user) {
    return res.status(403).json({ message: "You are not logged in!" });
  }

  const {userID, teamName} = req.user;
  const reservations: TeamReservations = req.body.reservations;
  let reservationMessages: string[] = [];

  try {
    for (const [key, value] of Object.entries(reservations)) {
      const newReservation = new Reservation({
        owner: userID,
        team_name: teamName,
        day: key,
        start_time: value.start,
        end_time: value.end,
        approved: false,
      });

      await newReservation.save();
      reservationMessages.push(`Reservation for ${teamName} on ${key} starting at ${value.start} and ending at ${value.end} successfully booked!`)
    }
    res.status(201).json({ message: reservationMessages});
  } catch (err) {
    console.error("Error creating reservation", err);
  }
};

