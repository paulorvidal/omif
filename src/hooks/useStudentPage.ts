import { useQuery } from "@tanstack/react-query";
import { getEditionStatusByYear } from "../services/editionService"; 

export const useStudentPage = (editionYear: string | undefined) => {
  return useQuery({
    queryKey: ["editionStatus", editionYear],

    queryFn: () => getEditionStatusByYear(editionYear!),

    enabled: !!editionYear,
  });
};