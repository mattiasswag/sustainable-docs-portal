
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CompanyProfile from "@/components/company/CompanyProfile";

const Profile = () => {
  const navigate = useNavigate();

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <CompanyProfile />
    </div>
  );
};

export default Profile;
