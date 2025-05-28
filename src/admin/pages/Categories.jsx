import AdminLayout from "../components/AdminLayout";
import {} from "@mui/material"
import CategorieForm from "../components/CategorieData.jsx/CategorieForm";
import CategorieUpload from "../components/CategorieData.jsx/CategorieUpload";

export default function Categories() {
    return (
        <AdminLayout>
        <CategorieForm />
        <CategorieUpload />
        </AdminLayout>
    );
}