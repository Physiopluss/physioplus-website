import ReactGA from "react-ga4";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const Refund = () => {
	// google analytics
	useEffect(() => {
		ReactGA.send({ hitType: "pageview", page: window.location.pathname, title: "Refund" });
	}, []);

	// scroll to top
	useEffect(() => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	}, []);

	return (
		<div className="mx-10 sm:mx-16 my-6 sm:my-10">
			<h6 className="text-4xl text-center font-bold mb-2 sm:mb-6">Refund and Cancellation Policy</h6>
			<p className="font-semibold mb-2">
				Welcome to PHYSIOPLUS HEALTHCARE PRIVATE LIMITED. This Refund and Cancellation Policy outlines the terms under
				which users can cancel services and request refunds on our website [www.physioplushealthcare.com].
			</p>
			<div className="flex flex-col gap-4">
				<ul className="flex flex-col gap-2 font-semibold">
					<p className="text-2xl font-bold">1. Cancellation Policy</p>
					<li className="list-inside list-disc">
						<span className="font-bold">Appointments:</span> Users can cancel their physiotherapy consultation
						appointments within 6 hr prior before the scheduled time. Cancellations made after this period may not be
						eligible for a full refund.
					</li>
					<li className="list-inside list-disc">
						<span className="font-bold">Membership Plans:</span> Memberships can be cancelled within first week (during
						assessment period) of purchase for a full refund, provided no services under the plan have been utilized.
					</li>
					<li className="list-inside list-disc">
						<span className="font-bold">Assessment Reports:</span> Once an assessment report is purchased and
						downloaded, it cannot be cancelled or refunded.
					</li>
				</ul>
				<ul className="flex flex-col gap-2 font-semibold">
					<p className="text-2xl font-bold">2. Refund Policy</p>
					<li className="list-inside list-disc">
						<span className="font-bold">Eligibility:</span> Refunds are only eligible for cancellations made within the
						specified timeframe and conditions.
					</li>
					<li className="list-inside list-disc">
						<span className="font-bold">Processing:</span> Refunds will be processed through the original method of
						payment within 3 business days.
					</li>
					<li className="list-inside list-disc">
						<span className="font-bold">Partial Refunds:</span>In cases where a partial refund is applicable (e.g., late
						cancellation of an appointment), the amount refunded will be prorated.
					</li>
					<li className="list-inside list-disc">
						<span className="font-bold">Non-refundable Fees:</span>Any fees stated as non-refundable at the time of
						purchase will not be included in the refund.
					</li>
				</ul>

				<ul className="flex flex-col gap-2 font-semibold">
					<p className="text-2xl font-bold">3. Rescheduling</p>
					<li className="list-inside list-disc">
						Users may reschedule appointments subject to availability. Rescheduling requests must be made at least 6 hr
						before the scheduled appointment time.
					</li>
				</ul>
				<ul className="flex flex-col gap-2 font-semibold">
					<p className="text-2xl font-bold">4. Exceptions</p>
					<li className="list-inside list-disc">
						Special circumstances, such as illness or emergencies, will be considered for refunds or rescheduling on a
						case-by-case basis.
					</li>
					<li className="list-inside list-disc">
						<Link
							to={"/"}
							className="underline text-blue-700"
						>
							www.physioplushealthcare.com
						</Link>{" "}
						reserves the right to offer refunds or credits in situations deemed exceptional.
					</li>
				</ul>
				<ul className="flex flex-col gap-2 font-semibold">
					<p className="text-2xl font-bold">5. Changes to the Refund and Cancellation Policy</p>
					<li className="list-inside list-disc">
						Physioplus Healthcare Private Limited reserves the right to modify this policy at any time. All changes will
						be posted on our website.
					</li>
				</ul>
				<ul className="flex flex-col gap-2 font-semibold">
					<p className="text-2xl font-bold">Refunds & Cancellation</p>
					<li>
						1.1 No Refunds or Cancellations are allowed once a payment has been made and the Service has been provided.
						For cancellations that are made before a Service has been attempted to be provided, no refunds are allowed,
						and any payment(s) made can only be adjusted against any future Service, irrespective of the service type.
						In cases of disputed Service, any cancellation or refund will only be considered on a case to case basis.
						All such requests for Cancellation or Refunds should be made in writing and addressed to the
						info@physioplushealthcare.com Please note that the above Refund & Cancellation Policy is applicable to all
						payments made through the online payment gateway on this Application
					</li>
				</ul>
				<ul className="flex flex-col gap-2 font-semibold">
					<p className="text-2xl font-bold">Jurisdiction & Miscellaneous</p>
					<li>
						2.1. The Application or mobile Application has been created with Indian users in mind and therefore its
						content may not be appropriate or lawful outside of INDIA. Users from outside of INDIA should therefore
						verify for themselves whether or not it is appropriate for them to access the Application or Services:{" "}
						<ul>
							<li className="list-inside list-disc">
								This Agreement sets forth the entire agreement between you and PHYSIOPLUS with respect to the Terms &
								Condition of Use (TOU) mentioned here and shall supersede all prior understandings or agreements,
								whether oral or in writing, between you and PHYSIOPLUS as regards to the subject matter herein.
							</li>
							<li className="list-inside list-disc">
								Jurisdiction of Disputes: THIS AGREEMENT SHALL BE GOVERNED BY AND CONSTRUED IN ACCORDANCE WITH LAWS OF
								INDIA. ANY DISPUTE ARISING FROM OR IN CONNECTION WITH THIS AGREEMENT, WHICH CANNOT BE SETTLED AMICABLY
								BETWEEN YOU AND TRAKTION WITHIN 30 DAYS FROM THE DATE OF A NOTICE OF DISPUTE FROM ONE PARTY TO THE
								OTHER, SHALL BE REFERRED TO AN ARBITRATION OF THE SOLE ARBITRATOR TO BE APPLICATIONOINTED IN ACCORDANCE
								WITH THE PROVISIONS OF ARBITRATION AND CONCILIATION ACT, 1996. THE ARBITRATION SHALL BE CONDUCTED IN
								ENGLISH AND VENUE SHALL BE NEW DELHI. ANY ACTION OR SUIT RELATED TO THIS AGREEMENT SHALL BE SUBJECT TO
								THE EXCLUSIVE JURSIDICTION OF THE COURTS IN NEW DELHI, INDIA. If any inconsistency exists between the
								terms of this Agreement and any additional terms and conditions posted on the Service, such terms shall
								be interpreted as to eliminate any inconsistency, if possible, and otherwise, the additional terms and
								conditions shall control. If any provision of this Agreement is held invalid, illegal or unenforceable
								in any respect,
								<ul>
									<li>
										(i) such provision shall be interpreted in such a manner as to preserve, to the maximum extent
										possible, the intent of the parties,
									</li>
									<li>
										(ii) the validity, legality and enforceability of the remaining provisions shall not in any way be
										affected or impaired thereby, and
									</li>
									<li>
										(ii) the validity, legality and enforceability of the remaining provisions shall not in any way be
										affected or impaired thereby, and
									</li>
									<li>
										(iii) such decision shall not affect the validity, legality or enforceability of such provision
										under other circumstances.
									</li>
								</ul>
							</li>
						</ul>
					</li>
				</ul>
				<ul className="flex flex-col gap-2 font-semibold">
					<p className="text-2xl font-bold">Contact for Cancellation or Refund</p>
					<li>
						To cancel or request a refund, please contact us at If you have any questions about refunds and agreement,
						including your rights under this document, you can contact PHYSIOPLUS HEALTHCARE PRIVATE LIMITED by
						telephone +91 8107333576, by sending an e-mail message to support@physioplushealthcare.com by post at the
						address PHYSIOPLUS HEALTHCARE PRIVATE LIMITED C-5 SHANTI NAGAR, GURJAR KI TRHADI, MANSAROVER 302019.
					</li>
				</ul>
			</div>
		</div>
	);
};
export default Refund;
