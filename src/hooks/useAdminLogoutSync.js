
import { useEffect } from "react";

export default function useAdminLogoutSync() {
    useEffect(() => {
        const handleStorage = (event) => {
            if (event.key === "admin_logged_out") {
                window.location.replace("/admin/login");
            }
        };

        window.addEventListener("storage", handleStorage);

        return () => {
            window.removeEventListener("storage", handleStorage);
        };
    }, []);
}
