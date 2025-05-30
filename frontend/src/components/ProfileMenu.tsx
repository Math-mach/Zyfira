import React, { useEffect, useState } from "react";
import {
    Avatar,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    ListItemButton,
    Box,
} from "@mui/material";
import Logout from "@mui/icons-material/Logout";

type User = {
    username: string;
    email: string;
};

export default function ProfileMenu() {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [user, setUser] = useState<User | null>(null);
    const open = Boolean(anchorEl);

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

    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase();
    };

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        try {
            await fetch("/api/users/logout", {
                method: "POST",
                credentials: "include",
            });
            localStorage.removeItem("token");
            window.location.reload();
        } catch (err) {
            console.error("Erro ao sair", err);
        }
    };

    return (
        <Box
            sx={{
                mt: "auto",
                p: 2,
                borderTop: "1px solid black",
            }}
        >
            <ListItemButton onClick={handleClick}>
                <ListItemIcon>
                    <Avatar sx={{ bgcolor: "purple" }} alt="Usuário">
                        {user ? getInitials(user.username) : "?"}
                    </Avatar>
                </ListItemIcon>
                <ListItemText primary="Meu Perfil" />
            </ListItemButton>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                transformOrigin={{ horizontal: "left", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
                <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                        <Logout fontSize="small" />
                    </ListItemIcon>
                    Sair
                </MenuItem>
            </Menu>
        </Box>
    );
}
