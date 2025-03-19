import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { Button, Card, Typography } from "@material-tailwind/react";

const PhysioconnectCard = ({ title, description, img, onclickFn }) => {
  const navigate = useNavigate();  // Initialize navigate here

  return (
    <Card className="min-h-[280px] flex !flex-row border border-[#EAEBEC] rounded-lg p-0.5 shadow-none max-w-[100vw] gap-1">
      <img
        loading="lazy"
        src={img}
        alt={"name"}
        className="block w-1/2 rounded-lg object-cover shadow-none"
      />

      <div className="w-1/2 flex flex-col justify-around px-2.5 py-2.5 overflow-hidden">
        <Typography
          variant="h6"
          className="text-xl font-bold text-black "
        >
          {title}
        </Typography>
        <Typography
          variant="h6"
          className="text-base font-medium text-black"
        >
          {description}
        </Typography>

        <Button
          onClick={() => {
            navigate("/physios"); // This will now work because navigate is defined
          }}
          className="w-fit py-2.5 px-8 bg-green shadow-none justify-center rounded-full capitalize hover:shadow-none text-base font-medium"
        >
          Book an Appointment
        </Button>
      </div>
    </Card>
  );
};

export default PhysioconnectCard;
