import {
    Box,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListItemButton,
    Typography,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AssignmentIcon from "@mui/icons-material/Assignment";
import ProfileMenu from "./ProfileMenu";
import { useNavigate } from "react-router-dom";

const navItems = [
    {
        label: "Início",
        icon: <DashboardIcon sx={{ color: "#8a2be2" }} />,
        path: "/",
    },
    {
        label: "Meus Ativos",
        icon: <AssignmentIcon sx={{ color: "#8a2be2" }} />,
        path: "/my-assets",
    },
];

export const Sidebar = () => {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                width: 250,
                height: "100vh",
                bgcolor: "rgba(0, 0, 0, 0.2)",
                borderRight: "1px solid rgba(0, 0, 0, 0.8)",
                display: "flex",
                flexDirection: "column",
                gap: 2,
                backdropFilter: "blur(10px)",
                color: "black",
                p: 2,
            }}
        >
            <List>
                <ListItem sx={{ borderBottom: "1px solid rgba(0, 0, 0, 0.8)" }}>
                    <Typography
                        variant="h4"
                        align="center"
                        sx={{ textShadow: "0 0 8px rgba(138,43,226,0.7)" }}
                    >
                        Zyfira
                    </Typography>
                </ListItem>

                {navItems.map(({ label, icon, path }) => (
                    <ListItemButton key={label} onClick={() => navigate(path)}>
                        <ListItemIcon>{icon}</ListItemIcon>
                        <ListItemText primary={label} sx={{ color: "black" }} />
                    </ListItemButton>
                ))}
            </List>

            <List sx={{ mt: "auto" }}>
                <ProfileMenu />
            </List>
        </Box>
    );
};
