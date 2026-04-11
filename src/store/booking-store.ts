import { create } from "zustand";

type Booking = any;
interface BookingState {
  booking: Booking | null;
  setBooking: (booking: Booking) => void;
  clearBooking: () => void;
}


const useBookingStore=create<BookingState>((set)=>({
    booking:null,
    setBooking:(booking:Booking)=>set({booking}),
    clearBooking:()=>set({booking:null})
}));

export default useBookingStore;