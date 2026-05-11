import { useQuery } from "@tanstack/react-query";
import { getAllPayments } from "../services/api/payment-ep";

export const useFetchAllPayments = () => {
  return useQuery({
    queryKey: ["getAllPayments"],
    queryFn: getAllPayments,
  })
}