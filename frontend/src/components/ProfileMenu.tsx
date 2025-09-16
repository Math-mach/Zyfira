import { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Logout from "@mui/icons-material/Logout";

type User = {
  username: string;
  email: string;
};

export default function ProfileMenu() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/users/me", {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          console.error("Erro ao buscar usuário");
        }
      } catch (err) {
        console.error("Erro de rede ao buscar usuário", err);
      }
    };

    fetchUser();
  }, []);

  const getInitials = (name: string) => name.charAt(0).toUpperCase();

  const handleLogout = async () => {
    try {
      await fetch("/api/users/logout", {
        method: "POST",
        credentials: "include",
      });
      localStorage.removeItem("isAuthenticated");
      window.location.reload();
    } catch (err) {
      console.error("Erro ao sair", err);
    }
  };

  return (
    <>
      <div className="flex flex-row items-center justify-center">
        <div className="flex flex-row flex-3 gap-2">
          <Avatar>
            <AvatarFallback className="flex items-center justify-center bg-black border-2 border-white text-white font-bold">
              {user ? getInitials(user.username) : "?"}
            </AvatarFallback>
          </Avatar>
          <h1 className="flex items-center justify-center font-bold">
            {user ? user.username.slice(1) : "?"}
          </h1>
        </div>
        <Logout className="flex-1" onClick={handleLogout} />
      </div>
    </>
  );
}
