import AdminLayout from "../components/AdminLayout";
import RestaurantForm from "../components/RestaurantData/RestaurantsForm";
import RestaurantUpload from "../components/RestaurantData/RestaurantUpload";
import { Box } from "@mui/material";

export default function Restaurants() {

    return (
        <AdminLayout>
            <Box sx={{ display: "flex", flexDirection: 'column', gap: 2, p: 2 }}>
                <RestaurantForm />
                <RestaurantUpload />
            </Box>
        </AdminLayout>
    );
}
