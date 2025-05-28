import AdminLayout from "../components/AdminLayout";
import LivreurForm from "../components/LivreurData/LivreurForm";
import LivreurUpload from "../components/LivreurData/LivreurUpload";

export default function Livreur() {
  return (
    <AdminLayout>
     <LivreurForm />
     <LivreurUpload />
    </AdminLayout>
  );
}