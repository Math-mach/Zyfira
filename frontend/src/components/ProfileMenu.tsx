import React from "react";
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

export default function ProfileMenu() {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
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
