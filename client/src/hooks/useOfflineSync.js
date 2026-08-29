import { useEffect } from "react";
import { syncPendingImages } from "../storage/syncImages";

function useOfflineSync() {
  useEffect(() => {
    const handleOnline = () => {
      console.log("Internet connection restored.");

      syncPendingImages();
    };

    window.addEventListener("online", handleOnline);

    if (navigator.onLine) {
      syncPendingImages();
    }

    return () => {
      window.removeEventListener("online", handleOnline);
    };
  }, []);
}

export default useOfflineSync;

