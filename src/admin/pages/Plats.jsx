import AdminLayout from "../components/AdminLayout";
import PlatsForm from "../components/platData/PlatsForm";
import DeletePlat from "../components/platData/DeletePlat";
import { Box } from "@mui/material";
export default function Plats() {
    return (
       
        <AdminLayout>
        <Box sx={{ display:"flex", flexDirection:'column',gap:2,p:2}}>
        <PlatsForm />
        <DeletePlat />
        </Box>
        </AdminLayout>
    );
}
