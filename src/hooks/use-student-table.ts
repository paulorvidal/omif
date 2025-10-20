import { useQuery } from "@tanstack/react-query";
import { getEditionStatusByYear } from "../services/edition-service";

export const useStudentTable = (editionYear: string | undefined) => {
  return useQuery({
    queryKey: ["editionStatus", editionYear],

    queryFn: () => getEditionStatusByYear(editionYear!),

    enabled: !!editionYear,
  });
};
