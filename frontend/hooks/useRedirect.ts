import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const useRedirect = (status: string, username: string) => {
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated' && username !== 'Guest') {
      router.push('/games');
    }
  }, [username, status]);
}