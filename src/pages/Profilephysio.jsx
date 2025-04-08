import ReactGA from "react-ga4";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaPencilAlt } from "react-icons/fa";
import { singlePatient } from "../api/patient";
import toast from "react-hot-toast";
import Loading from "../components/Loading";
import { useDispatch, useSelector } from "react-redux";
import { setLogOut } from "../slices/authSlice";
import StepIndicatorprofile from "../pages/StepIndicatorprofile";

const Profilephysio = () => {
    const [editMode, setEditMode] = useState(false);
    const [patientData, setPatientData] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // const { userId } = useSelector((e) => e.auth.user || {});

    // if (!userId) {
    //     navigate("login");
    // }

    // google analytics
    useEffect(() => {
        ReactGA.send({ hitType: "pageview", page: window.location.pathname, title: "Profile" });
    }, []);

    // patient data
    useEffect(() => {
        singlePatient(userId)
            .then((res) => {
                setLoading(true);
                if (res.status >= 200 && res.status < 300) {
                    setPatientData(res.data.data);
                } else {
                    toast.error(res);
                }
            })
            .catch((err) => toast.error(err))
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return (
        <div className="font-Urbanist flex min-h-screen bg-[#FFFCF0] py-8 px-4 sm:px-12 lg:px-[120px] gap-4">
            {/* Sidebar - Step Indicator */}
            <div className="hidden md:block">
                <StepIndicatorprofile currentStep={1} />
            </div>

            {/* Mobile Step Indicator */}
            <div className="block md:hidden w-full mb-6">
                <StepIndicatorprofile currentStep={1} />
            </div>

            {/* Main Content */}
            {loading ? (
                <Loading />
            ) : (
              <div className="flex-1 p-8 bg-white rounded-2xl md:rounded-r-2xl md:rounded-l-none">
  <div className="block md:hidden text-xl font-semibold mb-4">My Profile</div>
  <div className="max-w-3xl mx-auto">
    {/* Profile Header */}
    <div className="flex justify-between items-center mb-8">
      <div className="flex items-center gap-4">
        <img 
          src="/mockPhysioMale.png" 
          alt="Profile" 
          className="w-16 h-16 rounded-full object-cover"
        />
        <div>
          <h2 className="text-xl font-semibold">Dr. John Smith</h2>
          <p className="text-gray-500">Physiotherapist</p>
        </div>
      </div>
    </div>

    {/* Profile Information */}
    <div className="space-y-6 bg-white p-6 rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1">
          <p className="text-sm text-gray-500">Name</p>
          <p className="font-medium">John Smith</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-gray-500">Email</p>
          <p className="font-medium">john.smith@example.com</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-gray-500">Phone</p>
          <p className="font-medium">+1 (555) 123-4567</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <p className="text-sm text-gray-500">Gender</p>
          <p className="font-medium">Male</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-gray-500">Date of Birth</p>
          <p className="font-medium">15 March 1985</p>
        </div>
      </div>

      {/* About Section */}
      <div className="space-y-1">
        <p className="text-sm text-gray-500">About</p>
        <p className="font-medium">
          Experienced physiotherapist with 10+ years in sports rehabilitation. 
          Specialized in ACL recovery and post-surgical therapy. Passionate about 
          helping athletes return to peak performance.
        </p>
      </div>

      {/* Specializations */}
      <div className="space-y-1">
        <p className="text-sm text-gray-500">Specializations</p>
        <div className="flex flex-wrap gap-2 mt-2">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Sports Therapy</span>
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Post-Surgical Rehab</span>
          <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">ACL Recovery</span>
          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">Pain Management</span>
        </div>
      </div>
    </div>
  </div>
</div>
            )}
        </div>
    );
};

export default Profilephysio;