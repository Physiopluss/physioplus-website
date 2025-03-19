import ReactGA from "react-ga4";
import { useEffect } from "react";

const Privacy = () => {
	// google analytics
	useEffect(() => {
		ReactGA.send({ hitType: "pageview", page: window.location.pathname, title: "Privacy" });
	}, []);

	// scroll to top
	useEffect(() => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	}, []);

	return (
		<div className="mx-10 sm:mx-16 my-6 sm:my-10">
			<h6 className="text-4xl text-center font-bold mb-2 sm:mb-6">Privacy Policy</h6>
			<div className="flex flex-col gap-4">
				<ul className="flex flex-col gap-4  font-semibold">
					<li>
						<p className="text-xl font-semibold mb-1">A. Introduction</p>
						<p className="text-justify sm:leading-7">
							Welcome to <span className="bg-yellow-200">PHYSIOPLUS HEALTHCARE PRIVATE LIMITED</span>, We respect your
							privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect,
							use, disclose, and safeguard your information when you visit our website or mobile application
							[www.physioplushealthcare.com]. We are based in India and adhere to the local privacy laws.
						</p>
					</li>
					<li>
						<p className="text-xl font-semibold  mb-1">B. Acceptance of Terms</p>
						<p className="text-justify sm:leading-7">
							We may collect the following types of information:
							<li>
								B.1 <span className="font-semibold">Personal Identification Information:</span> Name, email address,
								phone number, etc.
							</li>
							<li>
								B.2 <span className="font-semibold">Health Information:</span> Information related to physical health,
								mental health, and diet preferences, if provided.
							</li>
							<li>
								B.3 <span className="font-semibold">Payment Information:</span> Credit/debit card details, bank account
								details, UPI IDs, etc., processed through a third-party payment gateway.
							</li>
							<li>
								B.4 <span className="font-semibold">Technical Data:</span> IP address, browser type, operating system,
								and other usage data
							</li>
						</p>
					</li>
					<li>
						<p className="text-xl font-semibold mb-1">C. How We Use Your Information</p>
						<p className="text-justify sm:leading-7">
							Consent for Use of Submitted Data <br />
							By registering on our platform, all physiotherapists provide their explicit consent for the use of the
							following data on our website and mobile application:
							<li>Educational documents, including marksheets, degrees, and certificates.</li>
							<li>KYC details submitted during registration.</li>
							<li>Clinic images and patient testimonials provided at the time of registration.</li>
						</p>
						<p className="text-justify sm:leading-7">
							This data may be used to enhance user experience, ensure transparency, and maintain the credibility of our
							platform.
							<br />
							The information we collect may be used for the following purposes:
							<li>C.1 To connect you with physiotherapists.</li>
							<li>C.2 To manage our membership plans.</li>
							<li>C.3 To process payments and transactions.</li>
							<li>C.4 For communication regarding our services.</li>
							<li>C.5 To improve our website and services. .</li>
							<li>C.6 For compliance with legal obligations.</li>
						</p>
					</li>
					<li>
						<p className="text-xl font-semibold mb-1">D. Disclosure of Your Information</p>
						<p className="text-justify sm:leading-7">
							We may disclose your information as follows:
							<li>D.1 To service providers and affiliates who assist in conducting business.</li>
							<li>D.2 To comply with legal requirements such as a court order.</li>
							<li>D.3 To protect the rights and safety of our company, customers, or others.</li>
							<li>D.4 In connection with a merger, acquisition, or asset sale.</li>
						</p>
					</li>
					<li>
						<p className="text-xl font-semibold mb-1">E. Data Security</p>
						<p className="text-justify sm:leading-7">
							We implement a variety of security measures to maintain the safety of your personal information. However,
							no method of transmission over the Internet, or method of electronic storage, is 100% secure.
						</p>
					</li>
					<li>
						<p className="text-xl font-semibold mb-1">F. Your Rights</p>
						<p className="text-justify sm:leading-7">
							You have the right to access, correct, or delete your personal data. You can also request the restriction
							of processing of your data.
						</p>
					</li>
					<li>
						<p className="text-xl font-semibold mb-1">G. Third-Party Links</p>
						<p className="text-justify sm:leading-7">
							Our website may contain links to third-party websites. We are not responsible for the privacy practices of
							these external sites.
						</p>
					</li>
					<li>
						<p className="text-xl font-semibold mb-1">H. Changes to Our Privacy Policy</p>
						<p className="text-justify sm:leading-7">
							We reserve the right to modify this privacy policy at any time. All changes will be posted on this page.
						</p>
					</li>
				</ul>
				<ul className="flex flex-col gap-2 font-semibold">
					<p className="text-2xl font-bold">PRIVACY POLICY</p>
					<li>
						2.1 PHYSIOPLUS provides a service through its Application and website Physioplus, a mobile Application and
						website created by PHYSIOPLUS, which merely facilitates the interaction between its users/customers and
						Licensed and Registered Medical Physiotherapy Doctors through the Application and website of Physioplus. For
						providing this SERVICE, PHYSIOPLUS needs to collect and store personal information such as your name, age,
						sex, health information, and other lifestyle-related information for your profile. It is not possible for us
						to provide the Service in question without receiving this specific information from you. By enrolling as a
						member with us you give us your consent to collect, store, maintain, update and access such information in a
						protected online portal.
					</li>
					<li>
						2.2 Some portions of this SERVICE may require you to give us financial information such as your credit card,
						debit card, or net-banking information (Financial Information), for, without limitation, (i) registration on
						the Application to avail specific offers, health plans, home health care services, or newsletters; and (ii)
						making a payment towards our fee for providing the aforementioned SERVICES, either in the pre-paid or
						post-paid format.If you communicate with us by e-mail info@physioplushealthcare.com, post messages to any of
						our chat groups, bulletin boards or forums, or otherwise complete online web forms, surveys or contest
						entries, any information provided in such communications may be collected as Personal Information.
					</li>
					<li>
						2.3 If you elect to provide us Personal Information, we use it primarily to deliver the service you
						requested. Other uses of Personal Information are described elsewhere in this Policy.
					</li>
					<li>
						2.4 If you submit Financial Information, we use that information primarily to verify your credit and collect
						payments for your purchases, orders, registrations etc. PHYSIOPLUS uses a third party to process credit or
						debit card / net-banking transactions and does not store financial information, such as credit or debit card
						/ net-banking information on its Application. We may retain the last four digits of the credit or debit card
						number solely for customer service purposes. We employ industry-standard encryption and secured socket layer
						(SSL) protocols to protect your Financial Information when it is transmitted through our third-party payment
						gateway.
					</li>
					<li>
						2.5 We do not sell or rent Personal Information received through your use of this Service. This Service has
						security measures in place to help protect against the loss, misuse, or alteration of information under our
						control. Despite these measures, the confidentiality of any Personal Information communication or material
						transmitted to or from us via this Service by Internet or e-mail cannot be guaranteed. At your discretion,
						you may contact us at the mailing address or telephone number listed. If you have privacy or data security
						related questions, please feel free to contact the office.
					</li>
					<li>
						2.6 Your personal data may in some situations be seen by third parties, such as doctors (general
						physios/specialist physio doctors/national and international experts) or operations and maintenance
						contractors repairing and maintaining our technical systems. PHYSIOPLUS will use the information received to
						provide our services keeping your best interests in mind.
					</li>
					<li>
						2.7 PHYSIOPLUS may further use the aggregate information to study statistical results, epidemiological
						trends and produce summary reports. Such information may be shared with PHYSIOPLUS partners, clients and
						advertisers under the sole discretion of PHYSIOPLUS. Please note that this aggregate information does not
						identify individual user information in any manner.
					</li>
					<li>
						2.8 Please remember that any information you reveal, including personally identifiable information in a
						public forum such as in a discussion forum or review, is not subject to this Privacy Policy and can be seen
						by third parties unrelated to PHYSIOPLUS. It is therefore important that you carefully consider what
						Information you disclose in these areas.
					</li>
				</ul>
				<ul className="flex flex-col gap-2 font-semibold">
					<p className="text-2xl font-bold">Information Collected</p>
					<li>
						3.1 We may collect the following information:
						<ul>
							<li className="list-disc list-inside">
								Personal data of the User such as, but not limited to, your name, age, date of birth, occupation and
								gender.
							</li>
							<li className="list-disc list-inside">
								User’s e-mail and contact information proper KYC, GPS based location; tracking Information such as, but
								not limited to the device ID, Google Advertising ID and Android/iOS ID.
							</li>
							<li className="list-disc list-inside">User’s data sent across through the Application.</li>
						</ul>
					</li>
					<li>
						3.2 As a User of Physioplus, you may provide information about yourself, your spouse or family, your
						friends, their health issues, gender of the patient, age of the patient, previous medication taken, previous
						medical conditions, allergies, etc.
					</li>
					<li>
						3.3 The Information specified above and collected by us may be classified as ‘Personal Information’ or
						‘Sensitive Information’ under the Information Technology (Reasonable security practices and procedures and
						sensitive personal data or information) Rules, 2011. Collection of information which has been designated as
						‘sensitive personal data or information’ under the Information Technology (Reasonable security practices and
						procedures and sensitive personal data or information) Rules requires your express consent. By affirming
						your assent to this Privacy Policy, you provide your consent to such collection as required under applicable
						law. Our Services may be unavailable to you in the event such consent through an email is not given.
					</li>
				</ul>
				<ul className="flex flex-col gap-2 font-semibold">
					<p className="text-2xl font-bold">E-mail, SMS & Telephone Calls</p>
					<li>
						4.1 From time to time, PHYSIOPLUS will contact you and send you information related to your health records,
						services you are currently availing and promotional material. We will be sending e-mails and / or SMS’s at
						the e-mail id(s) and contact mobile number(s) provided by you. We will also be making calls on the phone
						numbers provided by you. By using our services and providing us the above contact details on our “Know Your
						Patient” form at the time of registration, you have authorised us to contact you by any of the communication
						modes mentioned above. In case you have given a wrong e-mail id or mobile / phone number for correspondence,
						PHYSIOPLUS will not be responsible for the loss of information or privacy due to the message going to an
						unknown destination.
					</li>
					<li>
						4.2 We may use a third-party vendor to help us manage some of our e-mail and SMS communications with you.
						While we may supply this vendor with e-mail addresses and mobile numbers of those we wish them to contact,
						your e-mail address or mobile number is never used for any purpose other than to communicate with you on our
						behalf. When you click on a link on our Application or in an e-mail sent by us, you may be temporarily
						redirected through one of the vendor’s servers (although this process will be invisible to you) which will
						register that you’ve clicked on that link, and have viApp our Application. PHYSIOPLUS never shares any
						information, other than your e-mail address, with our third party e-mail vendor, and they in turn do not
						share these e-mail addresses with anyone else. Even if you have given us permission to send e-mails to you,
						you may revoke that permission at any time by following the “unsubscribe” information at the bottom of each
						such e-mail.
					</li>
				</ul>
				<ul className="flex flex-col gap-2 font-semibold">
					<p className="text-2xl font-bold">Call & IP Logs</p>
					<li>
						5.1 We maintain standard call and IP logs that record data about all visitors and customers who call us
						and/or access our Application. We store this information for providing services and as an analysis tool for
						our physicians. All call logs are stored securely, and may only be accessed by PHYSIOPLUS employees or
						designees on a need-to-know basis for a specific purpose. PHYSIOPLUS uses call log information to help
						provide our members the efficient services under this membership. We collect IP address of all visitors to
						the Application, and a number is automatically assigned to your computer whenever you access the Internet.
						We collect IP address information in order to administer our system and gather aggregate information, to
						avoid any scope of misuse of the Application. The information may be shared with advertisers, sponsors and
						other businesses.
					</li>
				</ul>
				<ul className="flex flex-col gap-2 font-semibold">
					<p className="text-2xl font-bold">Evaluation & Research</p>
					<li>
						6.1 We will periodically ask users to complete surveys asking about their experiences with feature services.
						We use survey information for research and quality improvement purposes, including helping PHYSIOPLUS to
						improve information and services offered through this Service. In addition, users giving feedback may be
						individually contacted for follow-up due to concerns raised during the course of such evaluation.
					</li>
				</ul>
				<ul className="flex flex-col gap-2 font-semibold">
					<p className="text-2xl font-bold">Messages & Transactions</p>
					<li>
						7.1 Comments or questions sent to us using e-mail or secure messaging forms will be shared with PHYSIOPLUS
						staff and health care professionals who are most able to address your concerns. We will archive your
						messages once we have made our best effort to provide you with a complete and satisfactory response. When
						you use a service on the secure section of this Application or interact directly with PHYSIOPLUS personnel /
						professionals, some information you provide may be documented in your medical record, and will be available
						for use as a future guide for your treatment as a patient.
					</li>
				</ul>
				<ul className="flex flex-col gap-2 font-semibold">
					<p className="text-2xl font-bold">Data Integrity & Correction</p>
					<li>
						8.1. We request all the members to update us on any and all the changes that are documented in your medical
						records at any point of time either through calling us/ email/post. We also encourage you to login into your
						account to view your personal information and medical history and advise us of any changes to be made.
					</li>
					<li>
						Although we attempt to ensure the integrity and accurateness of this Service, we make no guarantees as to
						its correctness or accuracy. It is possible that the Service could include typographical errors,
						inaccuracies, or other errors, and that unauthorized additions, deletions, and alterations could be made to
						the Service by third parties. In the event that an inaccuracy arises, please inform us so that it can be
						corrected.
					</li>
				</ul>
				<ul className="flex flex-col gap-2 font-semibold">
					<p className="text-2xl font-bold">Disclosures</p>
					<li>
						9.1 PHYSIOPLUS may disclose personal information to any person performing audit, legal, operational, or
						other services for us. We will use Information which does not identify the individual for these activities
						whenever feasible.
					</li>
					<li>
						9.2 We may disclose personal information when required to do so by a subpoena, court order, or search
						warrant. We may disclose personal information as we deem it appropriate to protect the safety of an
						individual or for an investigation related to public safety or to report an activity that appears to be in
						violation of law. We may disclose personal information to protect the security and reliability of this
						service and to take precautions against liability.
					</li>
				</ul>
				<ul className="flex flex-col gap-2 font-semibold">
					<p className="text-2xl font-bold">Children</p>
					<li>
						10.1 We do not knowingly allow or solicit anyone under the age of 18 to participate directly in our
						services, unless accompanied and authorised by the parents/guardians, who may or may not be our subscribed
						members.
					</li>
				</ul>
				<ul className="flex flex-col gap-2 font-semibold">
					<p className="text-2xl font-bold">No Guarantee</p>
					<li>
						11.1 Despite our use of commercially reasonable efforts to protect your personal information from
						unauthorized access or disclosure, the Internet is not an inherently secure environment and so we cannot
						guarantee the security of your information. We assume no liability for any disclosure of data due to errors
						in transmission, unauthorized third party access or other acts of third parties, or acts or omissions beyond
						our reasonable control.
					</li>
				</ul>
				<ul className="flex flex-col gap-2 font-semibold">
					<p className="text-2xl font-bold">Contact Us</p>
					<li>
						12.1 If you have any questions about TERMS AND CONDITION and agreement, including your rights under this
						document, you can contact{" "}
						<span className="bg-yellow-200">PHYSIOPLUS HEALTHCARE PRIVATE LIMITED by telephone +91 8107333576</span>, by
						sending an e-mail message to <span className="bg-yellow-200">support@physioplushealthcare.com</span> by post
						at the address{" "}
						<span className="bg-yellow-200">
							PHYSIOPLUS HEALTHCARE PRIVATE LIMITED 109, 1st Floor, Sankalp Tower, Khatipura Road, Jaipur.
						</span>
					</li>
				</ul>
				<ul className="flex flex-col gap-2 font-semibold">
					<p className="text-2xl font-bold">Governing Law</p>
					<li>
						This Privacy Policy is governed by the laws of India and any disputes relating to this policy will be
						subject to the jurisdiction of the courts of India.
					</li>
				</ul>
			</div>
		</div>
	);
};
export default Privacy;
