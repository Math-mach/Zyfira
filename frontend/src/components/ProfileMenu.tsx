import React from "react";
import {
    Avatar,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    ListItemButton,
    Divider,
    Box,
} from "@mui/material";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import Person from "@mui/icons-material/Person";
import { useNavigate } from "react-router-dom";

export default function ProfileMenu() {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const navigate = useNavigate();

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleNavigate = (path: string) => {
        navigate(path);
        handleClose();
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
                        MM
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
                <MenuItem onClick={() => handleNavigate("/profile")}>
                    <ListItemIcon>
                        <Person fontSize="small" />
                    </ListItemIcon>
                    Perfil
                </MenuItem>
                <MenuItem onClick={() => handleNavigate("/settings")}>
                    <ListItemIcon>
                        <Settings fontSize="small" />
                    </ListItemIcon>
                    Configurações
                </MenuItem>
                <Divider />
                <MenuItem onClick={() => console.log("logout")}>
                    <ListItemIcon>
                        <Logout fontSize="small" />
                    </ListItemIcon>
                    Sair
                </MenuItem>
            </Menu>
        </Box>
    );
}
