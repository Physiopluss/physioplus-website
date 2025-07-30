import axios from "axios";
import { instanceHomeCare,commonInstanceHomeCare } from "../axiosConfig";



export async function getAllSupportTickets(patientId) {
  const res = await instanceHomeCare.get("/web/support/getTickets", {
    params: { patientId },
  });
  return res?.data?.data;
}



export async function createSupportTicket({ patientId, email, summary }) {
  const res = await instanceHomeCare.post("/web/support/createTicket", {
    patientId,
    email,
    summary,
  });
  return res?.data?.data;
}


export async function getSupportTicketById(ticketId) {
  const res = await instanceHomeCare.get("/web/support/getTicketById", {
    params: { ticketId },
  });
  return res?.data?.data;
}


export async function reopenSupportTicket(ticketId) {
  const res = await instanceHomeCare.post("/web/support/reopenTicket", {
    ticketId,
  });
  return res?.data?.data;
}

export async function closeSupportTicket(ticketId) {
  const res = await instanceHomeCare.post("/web/support/closeTicket", {
    ticketId,
  });
  return res?.data?.data;
}
