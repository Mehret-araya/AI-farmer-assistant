import { useEffect, useState } from "react";
import { getPendingImageCount } from "../storage/offlineDb";

function OfflineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const updateStatus = () => {
      setIsOnline(navigator.onLine);
    };

    const updatePendingCount = async () => {
      try {
        setPendingCount(await getPendingImageCount());
      } catch {
        setPendingCount(0);
      }
    };

    updateStatus();
    updatePendingCount();
    window.addEventListener("online", updateStatus);
    window.addEventListener("offline", updateStatus);
    const interval = window.setInterval(updatePendingCount, 5000);

    return () => {
      window.removeEventListener("online", updateStatus);
      window.removeEventListener("offline", updateStatus);
      window.clearInterval(interval);
    };
  }, []);

  if (isOnline && pendingCount === 0) {
    return null;
  }

  return (
    <div
      role="status"
      className={`px-4 py-2 text-center text-sm font-medium ${
        isOnline
          ? "bg-amber-100 text-amber-900"
          : "bg-red-100 text-red-900"
      }`}
    >
      {isOnline
        ? `${pendingCount} queued image${pendingCount === 1 ? "" : "s"} waiting to sync.`
        : "You are offline. Queued images will sync when connection returns."}
    </div>
  );
}

export default OfflineStatus;
