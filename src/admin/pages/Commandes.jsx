import CommandeUpload from "../components/CommandeData/CommandeUpload";
import AdminLayout from "../components/AdminLayout";
import {Box} from "@mui/material";

export default function Commandes() {
  return (
    <Box sx={{ p: 3 }}>
        <AdminLayout>
      <CommandeUpload />
      </AdminLayout>
    </Box>
  );
}