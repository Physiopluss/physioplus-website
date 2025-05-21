import { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

const ReviewOverlay = ({ onClose, onSubmit }) => {
    const [rating, setRating] = useState(0);

    const ReviewSchema = Yup.object().shape({
        review: Yup.string().required("Review is required"),
    });

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-2xl p-6 w-[90%] max-w-sm shadow-lg relative pt-10">
                <button className="absolute top-2 right-4 text-xl" onClick={onClose}>
                    ✕
                </button>
                <h2 className="text-center font-semibold text-lg">Help Us Improve. Your Opinion Matters!</h2>
                <p className="text-center mt-2 mb-4 text-sm">Rate your Physio</p>

                {/* Star Rating */}
                <div className="flex justify-center gap-2 mb-4">
                    {[1, 2, 3, 4, 5].map((num) => (
                        <span
                            key={num}
                            className={`text-2xl cursor-pointer ${rating >= num ? "text-yellow-400" : "text-gray-300"
                                }`}
                            onClick={() => setRating(num)}
                        >
                            ★
                        </span>
                    ))}
                </div>

                {/* Formik Form */}
                <Formik
                    initialValues={{ review: "" }}
                    validationSchema={ReviewSchema}
                    onSubmit={(values, actions) => {
                        onSubmit({ ...values, rating });
                        actions.resetForm();
                        onClose();
                    }}
                >
                    {({ errors, touched }) => (
                        <Form className="space-y-4">
                            <Field
                                as="textarea"
                                name="review"
                                placeholder="Write your review here"
                                className="w-full p-3 border border-gray-300 rounded-md resize-none text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                rows={4}
                            />
                            {errors.review && touched.review && (
                                <div className="text-red-500 text-xs">{errors.review}</div>
                            )}
                            <button
                                type="submit"
                                className="w-full bg-black text-white py-2 rounded-full hover:bg-gray-900"
                            >
                                Submit
                            </button>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default ReviewOverlay;
