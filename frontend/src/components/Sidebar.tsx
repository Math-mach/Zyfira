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
import HistoryIcon from "@mui/icons-material/History";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

export const Sidebar = () => {
    return (
        <Box
            sx={{
                width: 250,
                height: "100vh",
                bgcolor: "rgba(0, 0, 0, 0.2)",
                borderRight: "1px solid rgba(0, 0, 0, 0.8)",
                display: "flex",
                flexDirection: "column",
                gap: "2rem",
                backdropFilter: "blur(10px)",
                color: "black",
                padding: 2,
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
                <ListItemButton>
                    <ListItemIcon>
                        <DashboardIcon sx={{ color: "#8a2be2" }} />
                    </ListItemIcon>
                    <ListItemText primary="Inicio" sx={{ color: "#black" }} />
                </ListItemButton>
                <ListItemButton>
                    <ListItemIcon>
                        <AssignmentIcon sx={{ color: "#8a2be2" }} />
                    </ListItemIcon>
                    <ListItemText
                        primary="Meus Ativos"
                        sx={{ color: "#black" }}
                    />
                </ListItemButton>
                <ListItemButton>
                    <ListItemIcon>
                        <HistoryIcon sx={{ color: "#8a2be2" }} />
                    </ListItemIcon>
                    <ListItemText
                        primary="Histórico"
                        sx={{ color: "#black" }}
                    />
                </ListItemButton>
            </List>

            <List sx={{ mt: "auto" }}>
                <ListItemButton>
                    <ListItemIcon>
                        <ExitToAppIcon sx={{ color: "#8a2be2" }} />
                    </ListItemIcon>
                    <ListItemText primary="Logout" sx={{ color: "#black" }} />
                </ListItemButton>
            </List>
        </Box>
    );
};
