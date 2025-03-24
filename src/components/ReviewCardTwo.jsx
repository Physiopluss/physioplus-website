import { Card, CardHeader, CardBody, Typography, Avatar } from "@material-tailwind/react";
import { FaStar } from "react-icons/fa6";
import { formatDistanceToNow } from 'date-fns';

const ReviewCardTwo = ({ id, name, img, rating, review, patientType, date }) => {
  return (
    <Card
      key={id}
      color="transparent"
      shadow={false}
      className="p-2 text-black text-wrap overflow-hidden"
    >
      <CardHeader
        color="transparent"
        floated={false}
        shadow={false}
        className="mx-0 flex items-center gap-4 mt-2 pt-0 pb-2"
      >
        <Avatar
          size="sm"
          variant="circular"
          src={img}
          alt={name}
        />
        <div className="flex w-full flex-col gap-0.5">
          <div className="flex flex-col items-start justify-between">
            <Typography
              variant="h5"
              color="blue-gray"
              className="text-sm font-normal"
            >
              {name}
            </Typography>
            <Typography
              className="text-xs font-normal"
              color="blue-gray"
            >
              {patientType || "Patient"}
            </Typography>
          </div>
        </div>
      </CardHeader>
      <CardBody className="flex flex-col gap-4 my-2 p-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                className={`h-3 w-3 ${i < rating ? "text-black" : "text-gray-400"}`}
              />
            ))}
          </div>
          {date && (
            <Typography className="text-xs">
              {formatDistanceToNow(new Date(date), { addSuffix: true })}
            </Typography>
          )}
        </div>
        <Typography className="!text-xs font-normal text-wrap">
          {review}
        </Typography>
      </CardBody>
    </Card>
  );
};

export default ReviewCardTwo;