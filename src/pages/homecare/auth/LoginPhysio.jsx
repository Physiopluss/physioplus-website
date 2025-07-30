import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { numberSchema } from "../../../validation.js";
import { useFormik } from "formik";
import * as Yup from "yup";

import { setOtpModalOpen } from "../../../slices/homecare/newModalSlice.js";
import { useDispatch } from "react-redux";
import { setLoginData } from "../../../slices/homecare/newAuthSlice.js";
import { Input } from "@material-tailwind/react";
import OtpModalNew from "../../../components/homecare/comp/OtpModalNew.jsx";
import { loginPhysio } from "../../../api/homecare/physio.js";

const LoginPhysio = () => {
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      phone: "",
    },
    validationSchema: Yup.object({ phone: numberSchema }),
    onSubmit: (values) => {
      loginPhysio(values.phone).then((res) => {
        if (res.status >= 200 && res.status < 300) {
          toast.success(res.data.message, {
            id: "otpSendViaLogin",
            className: "capitalize",
          });
          dispatch(setLoginData(values.phone));
          setTimeout(() => {
            dispatch(setOtpModalOpen());
          }, 1500);
        } else if (res.status >= 400 && res.status < 500) {
          toast.error(res.data.message, {
            id: "loginError1",
            className: "capitalize",
          });
        } else {
          toast.error("Something went wrong", {
            id: "loginError2",
            className: "capitalize",
          });
        }
      });
    },
  });

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          alt="Physioplus healthcare"
          src="/logo-nobg.png"
          className="mx-auto h-10 w-auto"
        />
        <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form
          onSubmit={formik.handleSubmit}
          method="POST"
          className="space-y-6"
        >
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Phone Number
            </label>
            <div className="relative mt-2  flex">
              <div className="absolute top-[0.45rem] left-3 ">+91</div>
              <Input
                id="phone"
                name="phone"
                placeholder="9XXXXXXXXX"
                maxLength="10"
                className="block w-full rounded-md !border-none ring-black !ring-1 text-gray-900 shadow-sm ps-11 pe-2 placeholder:text-gray-400 sm:leading-6 "
                labelProps={{
                  className: "hidden",
                }}
                onChange={formik.handleChange}
                value={formik.values.phone}
                autoComplete="off"
              />
            </div>
            {formik.touched.phone && formik.errors.phone ? (
              <div className="text-red-500 mt-2">{formik.errors.phone}</div>
            ) : null}
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-green px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-lightGreen hover:text-green ring-1 ring-green"
            >
              Send OTP
            </button>
          </div>
        </form>
        <OtpModalNew type="physio" phone={formik.values.phone} />
      </div>
    </div>
  );
};
export default LoginPhysio;
