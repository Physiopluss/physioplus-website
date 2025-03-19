import { string } from "yup";

export const numberSchema = string()
	.length(10, "Number should be 10 digits")
	.matches(/[6789]\d{9}$/g, "Phone number is not valid")
	.required("Phone number is required");
